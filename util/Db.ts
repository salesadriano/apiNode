import Pg from "pg";
import dotenv from "dotenv";
dotenv.config()


class Db {
  private conn: Pg.Pool

  constructor() {
    const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PWD } = process.env

    this.conn = new Pg.Pool({
      host: DB_HOST,
      user: DB_USER,
      database: DB_NAME,
      password: DB_PWD,
      port: 5432
    });
  }

  async query(sqlQuery: string) {
    return new Promise((resolve, reject) => {
      (<Pg.Pool>this.conn).query(sqlQuery)
        .then(resul => {
          resolve(resul.rows);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  get db():Pg.Pool {
    return this.conn;    
  }
}

export default new Db();

