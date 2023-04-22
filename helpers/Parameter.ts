import express from "express";

class Parameter {
  private parameters: object;

  constructor( req: express.Request) {
    this.parameters = {};
    if (Object.keys(req.body).length) {
      this.parameters = req.body;      
    } else if (Object.keys(req.query).length) {
      this.parameters = req.query;      
    } else if (Object.keys(req.params).length) {
      this.parameters = req.params;      
    }
  }
  get parameter():any {
    return this.parameters;
  }
 }

 export default Parameter;