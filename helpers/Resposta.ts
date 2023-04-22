import { Response } from "express";

class Resposta {
  
  sendSucess = (res: Response, data: object ) => {
    res.status(200).send(data);
  };

  sendInvalid = (res: Response, data: object ) => {
    res.status(403).send(data);
  };

  sendUnauthorized = (res: Response) => {
    res.status(401).send({message: "401 - unauthorized"});
  };
}

export default new Resposta();
