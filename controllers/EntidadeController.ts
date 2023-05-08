import Controller from '../helpers/Controller'
import Db from '../util/Db'
import Entidade from '../Models/Entidade';

class EntidadeController extends Controller {

  constructor() {
    super();
    this.modelo = new Entidade(Db.db);
  }
}

export default EntidadeController