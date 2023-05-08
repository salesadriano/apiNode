import express from "express";

class Parameter  {
  
  getParameter(req: express.Request):any { 
    
    let parameters: object = {};
    
    if (req.body && Object.keys(req.body).length > 0) {
      parameters =  req.body;      
    } else if (req.query && Object.keys(req.query).length > 0) {
      parameters = req.query;      
    } else if (req.params && Object.keys(req.params).length > 0) {
      parameters = req.params;      
    }
    
    return parameters;

  }
 }

 export default new Parameter().getParameter ;