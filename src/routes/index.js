import blogRoute from "./blogRoute.js";
import tagRoute from "./tagRoute.js";

const routes = (app) => {
  app.use("/api/v1", blogRoute, tagRoute);
};

export default routes;
