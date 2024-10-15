import App from "app";
import EventsRoutes from "./routes/EventsRoute";
import UserRoutes from "./routes/UserRoute";
import AuthAndTokenRoutes from "./routes/AuthAndTokenRoutes";

let app = new App([
  new EventsRoutes(),
  new UserRoutes(),
  new AuthAndTokenRoutes(),
]);
app.listen();
