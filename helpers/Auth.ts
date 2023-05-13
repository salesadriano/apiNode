import jwt from "jsonwebtoken";
import express from "express";
import getParameter from "../helpers/Parameter";
import dotenv from "dotenv"
import Resposta from "./Resposta";
import UsuarioSistema from "../Models/UsuarioSistema";
import Db from "../util/Db";
import { createHash } from "crypto";
dotenv.config();

class Auth {

  validate(req: express.Request, res: express.Response, next: express.NextFunction) {

    if (req.path == "/" || req.path == "/login") {
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

    var Authorization = (<String>req.headers["authorization"]).split(' ');
    var token = Authorization.length == 1 ? Authorization[0] : Authorization[1];

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: err.message
          });
        } else {
          const user = new UsuarioSistema(Db.db);
          user.findWithSon(JSON.parse(JSON.stringify(decoded)))
            .then(user => {
              if (user.length > 0 && user[0].situacaousuariosistema == 'ATIVO') {
                req.session.user =  { "userID" : user[0].idusuariosistema }; 
                next();
              } else {
                return res.status(403).send({
                  success: false,
                  message: "Invalid token"
                });
              }
            })
        }
      });
    } else {
      return Resposta.sendUnauthorized(res);
    }
  }

  login(req: express.Request, res: express.Response, next: express.NextFunction) {
    const JWT_SECRET = process.env.JWT_SECRET
    let parametro = getParameter(req);
    if (!parametro.loginusuariosistema || !parametro.senhausuariosistema) {
      return Resposta.sendInvalid(res, { msg: "Login e Senha obrigatórios." })
    } else {
      const user = new UsuarioSistema(Db.db);
      parametro.senhausuariosistema = createHash("md5").update(parametro.senhausuariosistema).digest("hex")
      user.findWithSon(parametro)
        .then(user => {
          if (user.length > 0) {
            const token = jwt.sign(user[0], <string>JWT_SECRET, {
              expiresIn: "2h"
            });
            Object.assign(user[0], { "token": token });
            req.session.user = user;
            return Resposta.sendSucess(res, user[0]);
          } else {
            return Resposta.sendInvalid(res, { msg: "Login e Senha inválidos." })
          }
        }).catch(e => {
          return Resposta.sendInvalid(res, { msg: e })
        })
    }
  }

  logout(req: express.Request) { 
    req.session.destroy; 
  }

}

export default new Auth();