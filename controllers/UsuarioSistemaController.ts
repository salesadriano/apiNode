import Controller from '../helpers/Controller'
import Db from '../util/Db'
import UsuarioSistema from '../Models/UsuarioSistema';
import { Request, Response } from "express";

class UsuarioSistemaController extends Controller {

  constructor() {
    super();
    this.modelo = new UsuarioSistema(Db.db);
  }
  
}

export default UsuarioSistemaController