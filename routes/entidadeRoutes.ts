import { Router } from "express";
import { EntidadeController } from '../controllers'
import Resposta from "../helpers/Resposta";

const homeRouters = Router();
const entidadeController = new EntidadeController();

homeRouters.route("/").get(async (req, res, next) => {
  entidadeController.get(req)
  .then( resul => {
    Resposta.sendSucess(res, resul);
  }).catch( err => {
    Resposta.sendInvalid(res, err);
  })  
});

homeRouters.route("/").post(async (req, res, next) => {
  entidadeController.set(req)
  .then( resul => {
    Resposta.sendSucess(res, resul);
  }).catch( err => {
    Resposta.sendInvalid(res, err);
  })  
});

homeRouters.route("/").delete(async (req, res, next) => {
  entidadeController.rm(req)
  .then( resul => {
    Resposta.sendSucess(res, resul);
  }).catch( err => {
    Resposta.sendInvalid(res, err);
  })  
});

export default homeRouters;