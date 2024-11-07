import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    tagName: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// only get the data not deleted
tagSchema.pre("find", function (next) {
  this.where({
    isDelete: {
      $ne: true,
    },
  });
  next();
});

tagSchema.pre("findOne", function (next) {
  this.where({
    isDelete: {
      $ne: true,
    },
  });
  next();
});

const TagSchema = mongoose.model("Tags", tagSchema);

export default TagSchema;
