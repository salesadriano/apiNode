import Modelo from "../helpers/Modelo";
import EntidadeRazao from "./EntidadeRazao";
import { Pool } from "pg";

class Entidade extends Modelo {
  
  public identidade: number = 0;
  public razaoentidade: string = ""; 
  public fantasiaentidade: string = "";
  public siglaentidade: string = "";
  public cnpjentidade: string = "";
  public situacaoentidade: string = "ATIVO";
  public _entidadeRazao: EntidadeRazao; 


  constructor(Db: Pool) {
    super(Db);
    this._entidadeRazao = new EntidadeRazao(Db);   
    this.schema = "fwork";
    this.sourceName = "entidade";
    this.pk = "identidade";
    this.addTem(this._entidadeRazao, "entidadeRazao");
  }  

}

export default Entidade