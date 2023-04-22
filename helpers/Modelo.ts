import iDataSource from "../interface/iDataSource";
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

  constructor(dbConnection: Pool) {
    this._schema = "public";
    this._type = "table";
    this._dbConnection = dbConnection;
  }

  set dbConnection(dbConnection: Pool) {
    this._dbConnection = dbConnection;
  };

  get pk(): string {
    return this._pk || "";
  }

  set pk(primaryKey: string) {
    this._pk = primaryKey;
  }

  set sourceName(sourceName: string) {
    this._sourceName = sourceName;
  }

  get sourceName(): string {
    return `${this._schema}.${this._sourceName}`
  }

  set schema(nomeSchema: string) {
    this._schema = nomeSchema;
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
  }

  get hidden(): string[] | undefined {
    return this._hidden;
  }

  async find(parameters?: object, fields?: Array<string>, numRegisters?: number, page?: number) {
    return new Promise<any>((resolve, reject) => {
      this._dbConnection.query(this.query.select(parameters, fields, numRegisters, page))
        .then(result => {
          resolve(result.rows);
        })
        .catch(e => {
          reject(e);
        })
    });
  }

  async set(values: object, parameters?: object) {
    let pk: object = {};

    Object.entries(values).forEach(el => {
      if (el[0] == this.pk) pk = JSON.parse(`{"${this.pk}" : ${el[1]} }`);
    })

    if (parameters) {
      Object.entries(parameters).forEach(el => {
        if (el[0] == this.pk) pk = JSON.parse(`{"${this.pk}" : ${el[1]} }`);
      })
    }
    
    if (Object.keys(pk).length > 0) {
      return new Promise<any>((resolve, reject) => {
        this._dbConnection.query(this.query.update(values, pk))
          .then(result => {
            if (result.rowCount > 0 )
              resolve(pk);
            else {
              resolve({msg: "No Register found"});
            }
          })
          .catch(e => {
            reject(e);
          })
      });
    } else if (parameters) {
      return new Promise<any>((resolve, reject) => {
        var ret = {} 
        this._dbConnection.query(this.query.select(parameters, [this.pk]))
        .then(result => {
          ret = result.rows
        });
        this._dbConnection.query(this.query.update(values, parameters))
          .then(result => {
            if (result.rowCount > 0 )
              resolve(ret); 
            else 
              resolve({msg: "No Register found"});
          })
          .catch(e => {
            reject(e);
          })
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        this._dbConnection.query(this.query.insert(values))
          .then(() => {
            this._dbConnection.query(this.query.max())
              .then(result => {
                resolve(result.rows);
              })
          })
          .catch(e => {
            reject(e.detail);
          })
      });
    }
  }

  async remove(idRegister: number) {
    return new Promise<any>((resolve, reject) => {
      this._dbConnection.query(this.query.delete(idRegister))
        .then(result => {
          if (result.rowCount > 0 ) 
            resolve({msg: "Register deleted"});
          else 
            resolve({msg: "No Register found"});
        })
        .catch(e => {
          reject(e);
        })
    });
  }

}

export default Modelo;
