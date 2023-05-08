import Modelo from "./Modelo"
import { Request, Response } from "express";
import getParameter from "./Parameter";

class Controller {

  private _modelo: Modelo | undefined;
  private _registers: number = 50;

  set modelo(modelo: Modelo | undefined) {
    this._modelo = modelo
  }

  get modelo() {
    return this._modelo;
  }

  async get(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      try {
        const param = getParameter(req);
        let page = <any>param.page | 1;
        let registers = param.registers ? param.registers : this._registers;
        const fields = param.fields ? param.fields : undefined;
        if (this.modelo && this.modelo.filhos) {
          this.modelo.count(param)
            .then(pages => {
              registers = parseInt(registers == -1 ? pages : registers);
              pages = pages / registers;
              pages = pages > parseInt(pages) ? parseInt(pages) + 1 : pages;
              page = page > pages ? pages : page;
              if (this.modelo) this.modelo.findWithSon(param, fields, registers, page).then(result => {
                resolve({ "pages": pages, "page": page, "registers": registers, "data": result });
              }).catch(err => {
                reject(err);
              })
            })
        } else if (this.modelo) {
          this.modelo.count(param)
            .then(pages => {
              registers = parseInt(registers == -1 ? pages : registers);
              pages = pages / registers;
              pages = pages > parseInt(pages) ? parseInt(pages) + 1 : pages;
              page = page > pages ? pages : page;
              if (this.modelo) this.modelo.find(param, fields, registers, page).then(result => {
                resolve({ "pages": pages, "page": page, "registers": registers, "data": result });
              }).catch(err => {
                reject(err);
              })
            })
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async set(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      const param = getParameter(req);
      let hasCriteria = undefined;

      Object.entries(param).forEach(el => {
        if (this.modelo && el[0] == this.modelo.pk) {
          hasCriteria = JSON.parse(`{"${this.modelo.pk}" : ${el[1]} }`);
        }
      })

      if (this.modelo) this.modelo.set(param, hasCriteria)
        .then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        })
    })
  }

  async rm(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      const param = getParameter(req);
      
      if (this.modelo) this.modelo.remove(param)
        .then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        })
    })
  }

}

export default Controller