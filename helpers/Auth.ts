import jwt from "jsonwebtoken";
import express from "express";
import Db from "../util/Db";
import getParameter from "../helpers/Parameter";
import dotenv from "dotenv"
import Resposta from "./Resposta";

dotenv.config();

class Auth {
  
  validate(req: express.Request, res: express.Response, next: express.NextFunction ) {
    
    if (req.path == "/" || req.path == "/login" ) {
      next();
      return;
    }

    var secret = <jwt.Secret>process.env.JWT_SECRET;

    if (!req.headers["authorization"]) {
      return res.status(403).send({
        success: false,
        message: "403 - Token Não Informado"
      });
    }

    var Authorization =  (<String>req.headers["authorization"]).split(' ');
    var token = Authorization.length == 1 ? Authorization[0] : Authorization[1];

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: "403 - Token Inválido"
          });
        } else {
          next();
        }
      });
    } else {
      return Resposta.sendUnauthorized(res);
    }
  }

  login(req: express.Request, res: express.Response, next: express.NextFunction ) { 
    let parametro = getParameter(req);
    if(!parametro.loginusuariosistema || !parametro.senhausuariosistema) {
      return Resposta.sendInvalid(res,{msg: "sdfjsdkgj"})
    }    
    return Resposta.sendSucess(res,{msg: "chegou aki"})
  }

}

export default new Auth();