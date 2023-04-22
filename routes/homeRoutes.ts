import { Router } from "express";
import Db from "../util/Db";
import { UsuarioSistema } from "../Models";
import Resposta from "../helpers/Resposta";

const homeRouters = Router();

homeRouters.route("/").get(async (req, res, next) => { 
  const User = new UsuarioSistema(Db.db);  
  let resul = await User.set({situacaousuariosistema: "ATIVO"}, {situacaousuariosistema: "INATIVO"} );
  Resposta.sendSucess(res, resul);
});

export default homeRouters;