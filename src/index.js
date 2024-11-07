import express from "express";
import connectToDatabase from "./configDb.js";
import routes from "./routes/index.js";
import pathResolve from "./pathHandler.js";
import { errorHandler } from "./app/middlewares/errorHandler.js";

const port = 3000;

// call express
const app = express();

// to get data json
app.use(express.json());

// get data from form
app.use(express.urlencoded({ extended: true }));

// set static files
app.use(express.static(pathResolve("public")));

// mongodb connection
await connectToDatabase();

// call routes
routes(app);

// error handler
app.use(errorHandler);

// run
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
