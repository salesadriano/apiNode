import Modelo from "../helpers/Modelo";
import { Pool } from "pg";

class UsuarioSistema extends Modelo {
  public idusuariosistema: number = 0;  
  public loginusuariosistema: string = "";
  public nomeusuariosistema: string = "";
  public emailusuariosistema: string = "";
  public senhausuariosistema: string = "";
  public situacaousuariosistema: string = "";

  constructor(Db: Pool) {
    super(Db);    
    this.schema = "fwork";
    this.sourceName = "usuariosistema";
    this.pk = "idusuariosistema";
    this.hidden = ["senhausuariosistema"];
  }
  
};

export default UsuarioSistema;