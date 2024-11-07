import { Router } from "express";
import TagController from "../app/controllers/tagController.js";

const tagRoute = Router();

// get all tags
tagRoute.get("/tags", TagController.getTags);

// create new blog
tagRoute.post("/tags", TagController.createTag);

// update blog
tagRoute.put("/tags/:id", TagController.updateTag);

// delete blog
tagRoute.delete("/tags/:id", TagController.deleteTag);

export default tagRoute;
