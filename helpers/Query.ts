import Modelo from "./Modelo"

class Query {

  private _attributes: string[];
  private _visible: string[];
  private _table: string;
  private _pk: string;

  constructor(modelo: Modelo) {
    this._attributes = [];
    this._visible = [];
    this._table = modelo.sourceName;
    this._pk = modelo.pk;
    Object.keys(modelo).forEach(el => {
      if (el.substring(0, 1) != "_") {
        this._attributes.push(el);
        if (modelo.hidden) {
          if (modelo.hidden.indexOf(el) === -1) { this._visible.push(el) }
        }
        else this._visible.push(el)
      }
    })
  }

  select(parameters?: object, fields: Array<string> = [], registers: number = 0, page: number = 0): string {
    let strFields: string = " ";
    let where: string = "    ";
    let sql: string = " ";
    let limit: string = registers > 0 ? ` limit ${registers}` : '';
    let igual: string = "=";

    page = page > 0 ? page - 1 : page;

    if (parameters) {
      Object.entries(parameters).forEach(key => {
        igual = typeof (key[1]) == "string" && key[1].indexOf("%") >= 0 ? "like" : "="
        if (this._attributes.indexOf(key[0]) >= 0) where += `${key[0]} ${igual} '${key[1]}' and `;
      });
    }

    where = where.substring(0, where.length - 4);

    if (fields.length > 0) {
      fields.forEach(el => {
        if (this._visible.indexOf(el) >= 0) strFields += ` ${el},`
      });
    } else {
      this._visible.forEach(el => {
        strFields += `${el},`
      });
    }

    if (where.length > 0) where = `where ${where}`

    strFields = strFields.substring(0, strFields.length - 1);

    sql = ` SELECT ${strFields} FROM ${this._table} ${where} ${limit} offset ${page * registers};`

    return sql;
  }
  insert(data: object): string {
    let sql: string = " ";
    let strFields: string = " ";
    let strValues: string = " ";

    Object.entries(data).forEach(key => {

      if (this._attributes.indexOf(key[0]) >= 0 && key[0] != this._pk) {
        strFields += `${key[0]},`;
        strValues += `'${key[1]}',`;
      }

    })

    strFields = strFields.substring(0, strFields.length - 1);
    strValues = strValues.substring(0, strValues.length - 1);

    sql = `insert into ${this._table}(${strFields}) select ${strValues};`;

    return sql;

  }
  update(data: object, parameters?: object): string {
    let sql: string = " ";
    let where: string = "    ";
    let igual: string = "=";
    let strValues: string = " ";

    Object.entries(data).forEach(key => {

      if (this._attributes.indexOf(key[0]) >= 0 && key[0] != this._pk) {
        strValues += `${key[0]} = '${key[1]}',`;
      }
    })

    strValues = strValues.substring(0, strValues.length - 1);

    if (parameters) {
      Object.entries(parameters).forEach(key => {
        igual = typeof (key[1]) == "string" && key[1].indexOf("%") >= 0 ? "like" : "="
        if (this._attributes.indexOf(key[0]) >= 0) where += `${key[0]} ${igual} '${key[1]}' and `;
      });
    }

    where = where.substring(0, where.length - 4);
    if (where.length > 0) where = `where ${where}`

    sql = `update ${this._table} set ${strValues} ${where}`;

    return sql;
  }
  delete(id: number): string {
    return `delete from ${this._table} where ${this._pk} = '${id}';`;
  }
  max() {
    return `select max(${this._pk}) ${this._pk} from ${this._table};`;
  }
}

export default Query