import iDataSource from "../interface/iDataSource";
import iRelacionamento from "../interface/iRelacionamento"
import { Pool } from "pg";
import Query from "./Query";

class Modelo implements iDataSource {
  private _dbConnection: Pool;
  private _pk?: string;
  private _sourceName?: string;
  private _type?: string;
  private _schema?: string;
  private _query?: Query;
  private _hidden?: string[];
  private _filhos?: iRelacionamento[] = [];

  constructor(dbConnection: Pool) {
    this._schema = "public";
    this._type = "table";
    this._dbConnection = dbConnection;
  }

  set dbConnection(dbConnection: Pool) {
    this._dbConnection = dbConnection;
    this.query = new Query(this);
  };

  get pk(): string {
    return this._pk || "";
  }

  set pk(primaryKey: string) {
    this._pk = primaryKey;
    this.query = new Query(this);
  }

  set sourceName(sourceName: string) {
    this._sourceName = sourceName;
    this.query = new Query(this);
  }

  get sourceName(): string {
    return `${this._schema}.${this._sourceName}`
  }

  set schema(nomeSchema: string) {
    this._schema = nomeSchema;
    this.query = new Query(this);
  }

  get type(): string {
    return this._type || "";
  }

  set type(tableType: string) {
    this._type = tableType;

  }

  get query(): Query {
    return <Query>this._query;
  }

  set query(query: Query | undefined) {
    this._query = query;
  }

  set hidden(campos: string[] | undefined) {
    this._hidden = campos;
    this.query = new Query(this);
  }

  get hidden(): string[] | undefined {
    return this._hidden;
  }

  async find(parameters?: object, fields?: Array<string>, numRegisters?: number, page?: number) {
    return new Promise<any>((resolve, reject) => {
      const param = parameters ? this.getParameters(parameters) : {};
      this._dbConnection.query(this.query.select(param, fields, numRegisters, page))
        .then(result => {
          resolve(result.rows);
        })
        .catch(e => {
          reject(e);
        })
    });
  }

  async count(parameters?: object) {
    return new Promise<any>((resolve, reject) => {
      const param = parameters ? this.getParameters(parameters) : {};
      this._dbConnection.query(this.query.count(param))
        .then(result => {
          resolve(result.rows[0]["rows"] || 0);
        })
        .catch(e => {
          reject(e);
        })
    });
  }

  async findWithSon(parameters?: object, fields?: Array<string>, numRegisters?: number, page?: number) {
    return new Promise<any>((resolve, reject) => {
      const param = parameters ? this.getParameters(parameters) : {};
      this._dbConnection.query(this.query.select(param, fields, numRegisters, page))
        .then(async resul => {
          let filhos = this.filhos;
          let response: object[] = [];
          if (filhos && filhos.length > 0) {
            for (let i = 0; i < resul.rows.length; i++) {
              const el = resul.rows[i];
              response.push(await this.processSon(el, filhos));
            }
          } else {
            response = resul.rows
          }
          resolve(response);
        }).catch(e => {
          reject(e);
        });
    });
  }

  async processSon(el: any, filhos: iRelacionamento[] | undefined) {
    if (!filhos) return {};
    let promises = filhos.map(async fl => {
      let pk;
      if (fl.foreingKey) pk = JSON.parse(`{"${fl.localKey}" : "${el[fl.foreingKey]}" }`);
      let json = await JSON.parse(`{"${fl.attributeName}" : ${JSON.stringify(await fl.sons.find(pk))} }`);
      Object.assign(el, json);
    });
    await Promise.all(promises);
    return el;
  }

  async set(values: object, parameters?: object) {
    const vlr = this.getParameters(values);
    const param = parameters ? this.getParameters(parameters) : {};
    let pk: any = undefined;

    Object.entries(values).forEach(el => {
      if (el[0] == this.pk) pk = JSON.parse(`{"${this.pk}" : ${el[1]} }`);
    })

    if (parameters) {
      Object.entries(param).forEach(el => {
        if (el[0] == this.pk) pk = JSON.parse(`{"${this.pk}" : ${el[1]} }`);
      })
    }
    
    if (pk) {
      return new Promise<any>((resolve, reject) => {
        this._dbConnection.query(this.query.update(vlr, pk))
          .then(result => {
            if (result.rowCount > 0)
              this._dbConnection.query(this.query.select(pk))
                .then( resul => {
                  resolve(resul.rows);
                }) 
            else {
              resolve({ msg: "No Register found" });
            }
          })
          .catch(e => {
            reject(e);
          })
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        this._dbConnection.query(this.query.insert(vlr))
          .then(() => {
            this._dbConnection.query(this.query.max())
              .then(result => {                
                console.log(result.rows[0]);
                this._dbConnection.query(this.query.select(result.rows[0]))
                .then( resul => {
                  resolve(resul.rows);
                })                 
              })
          })
          .catch(e => {
            reject(e.detail);
          })
      });
    }
  }

  async remove(parameters: object) {
    return new Promise<any>((resolve, reject) => {
      const param = parameters ? this.getParameters(parameters) : {};
      let pk = undefined;

      Object.entries(param).forEach(el => {
        if (el[0] == this.pk) pk = el[1];
      })

      if (pk) {
        this._dbConnection.query(this.query.delete(pk))
          .then(result => {
            if (result.rowCount > 0)
              resolve({ msg: "Register deleted" });
            else
              resolve({ msg: "No Register found" });
          })
          .catch(e => {
            reject(e);
          })
      } else {
        reject({ "errorMsg": "No record found" });
      }

    });
  }

  get filhos(): iRelacionamento[] | undefined {
    return this._filhos;
  }

  set filhos(filhos: iRelacionamento[] | undefined) {
    if (filhos) this._filhos = filhos;
  }

  addE(filho: Modelo, nomeAtributo: string, localKey?: string, foreingKey?: string) {
    if (!localKey || localKey.length == 0) localKey = filho.pk;
    if (!foreingKey || foreingKey.length == 0) foreingKey = filho.pk;
    let tmp = { sons: filho, attributeName: nomeAtributo, relationshipType: "eUm", localKey: localKey, foreingKey: foreingKey }
    this._filhos?.push(tmp);
  }

  addTem(filho: Modelo, nomeAtributo: string, localKey?: string, foreingKey?: string) {
    if (!localKey || localKey.length == 0) localKey = this.pk;
    if (!foreingKey || foreingKey.length == 0) foreingKey = this.pk;
    if (filho) {
      let tmp = { sons: filho, attributeName: nomeAtributo, relationshipType: "eUm", localKey: localKey, foreingKey: foreingKey }
      this._filhos?.push(tmp);
    }
  }

  getParameters(parameters: object): object {

    let param: object = {};

    Object.entries(parameters).map(el => {
      const keys = Object.keys(this);
      for (let index = 0; index < keys.length; index++) {
        if (keys[index] == el[0]) {
          Object.assign(param, JSON.parse(`{"${el[0]}" : "${el[1]}" }`));
        }
      }
    });

    return param;

  }

}

export default Modelo;
