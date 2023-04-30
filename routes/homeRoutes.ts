import { Router } from "express";
import Db from "../util/Db";
import { UsuarioSistema, Entidade, EntidadeRazao } from "../Models";
import Resposta from "../helpers/Resposta";

const homeRouters = Router();

homeRouters.route("/").get(async (req, res, next) => { 
  const entidade = new Entidade(Db.db);  
  let resul = await entidade.findWithSon();
  Resposta.sendSucess(res, resul);
});

export default homeRouters;