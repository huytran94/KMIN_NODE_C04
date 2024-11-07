import { Router } from "express";
import BlogController from "../app/controllers/blogController.js";
import upload from "../utils/upload.js";

const blogRoute = Router();

// get all blog
blogRoute.get("/blogs", BlogController.getBlogs);

// create new blog
blogRoute.post("/blogs", upload.single("thumbnail"), BlogController.createBlog);

// update blog
blogRoute.put(
  "/blogs/:id",
  upload.single("thumbnail"),
  BlogController.updateBlog
);

// delete blog
blogRoute.delete("/blogs/:id", BlogController.deleteBlog);

export default blogRoute;