import express from "express";
import cors from "cors";
import session from "express-session";
import { homeRoutes, entidadeRoutes } from "./routes";
import Auth from "./helpers/Auth";

type User = {
  userID: number;
};

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

class StartUp {
  public app: express.Application;
 

  constructor() {
        
    this.app = express();

    this.app.use(session({
      secret: 'keyboardcat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    }));
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
    this.app.use("/login", Auth.login);
    this.app.use("/logout", Auth.logout);
    this.app.use(Auth.validate);
    this.app.use("/", homeRoutes);
    this.app.use("/entidade", entidadeRoutes);
  }
}

export default new StartUp();