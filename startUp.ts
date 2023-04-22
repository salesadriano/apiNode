import express from "express";
import cors from "cors";
import homeRouters from "./routes/homeRoutes";
import Auth from "./helpers/Auth";


class StartUp {
  public app: express.Application;
  
  constructor() {
    this.app = express();
    this.middler();
    this.routes();
  }

  enableCors() {
    const options: cors.CorsOptions = {
      methods: "GET,OPTIONS,PUT,POST,DELETE",
      origin: "*"
    };
    this.app.use(cors(options));
  }

  middler() {
    this.enableCors();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes() {
    this.app.use(Auth.validate);
    this.app.use("/login", Auth.login);    
    this.app.use("/", homeRouters);    
  }
}

export default new StartUp();