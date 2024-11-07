import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: { type: String },
    thumbnailUrl: {
      type: String,
    },
    tags: [{ type: String }],
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// setup middleware for queries
blogSchema.pre("find", function (next) {
  this.where({
    isDelete: {
      $ne: true,
    },
  });
  next();
});

blogSchema.pre("findOne", function (next) {
  this.where({
    isDelete: {
      $ne: true,
    },
  });
  next();
});

const BlogSchema = mongoose.model("blogs", blogSchema);

export default BlogSchema;
