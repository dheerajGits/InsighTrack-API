import App from "app";
import EventsRoutes from "./routes/EventsRoute";
import UserRoutes from "./routes/UserRoute";

let app = new App([new EventsRoutes(), new UserRoutes()]);
app.listen();
