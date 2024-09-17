import bodyParser from "body-parser";
import { Router, Request, Response } from "express";
import express from "express";
import http from "http";
import cors from "cors";

class App {
  public app: express.Application;
  public server: http.Server;
  public port = 3030;

  constructor(routes: any) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.initializeMiddlewares(); // initialize the middlewares when instance is created
    this.initializeRoutes(routes);
  }
  public listen() {
    this.server.listen(this.port, () => {
      console.log("-----Server listening on port ", this.port, "----------");
    });
  }

  public initializeMiddlewares() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // set limit to 50mb
    this.app.use(cors());
  }
  public initializeRoutes(Routes: any) {
    const router = Router();
    this.app.use(
      "/",
      router.get("/", (req: Request, res: Response) => {
        res.status(200).send("OK");
      })
    );
    Routes.map((Route: any) => {
      this.app.use("/", Route.router);
    });
  }
}
export default App;
