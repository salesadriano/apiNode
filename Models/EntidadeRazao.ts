import Modelo from "../helpers/Modelo";
import { Pool } from "pg";

class EntidadeRazao extends Modelo {

  public identidaderazao: number = 0; 
  public identidade: number = 0; 
  public razaosocial: string = "";

  constructor(Db: Pool) {
    super(Db);    
    this.schema = "fwork";
    this.sourceName = "entidaderazao";
    this.pk = "identidaderazao";
  }
}

export default EntidadeRazao;