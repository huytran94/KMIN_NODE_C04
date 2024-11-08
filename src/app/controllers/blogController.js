import { isValidObjectId } from "mongoose";
import BlogSchema from "../models/BlogSchema.js";
import TagSchema from "../models/TagSchema.js";
import { HttpStatusCode } from "../constants/httpStatusCode.js";
import { BadRequest, SuccessResponse } from "../apiResponses/apiResponse.js";
class BlogController {
  async getBlogs(req, res, next) {
    try {
      const blogRecords = await BlogSchema.find();

      // convert tagname if available
      const convertData = await Promise.all(
        blogRecords.map(async (blogItem) => {
          const convertItem = {
            id: blogItem.id,
            content: blogItem.content,
            title: blogItem.title,
            thumbnailUrl: blogItem.thumbnailUrl,
            tagList: [],
          };

          if (blogItem.tags.length > 0) {
            const tagRecords = await TagSchema.find({
              _id: { $in: blogItem.tags },
            });

            if (tagRecords.length > 0) {
              convertItem["tagList"] = tagRecords.map((tag) => tag.tagName);
            }
          }

          return convertItem;
        })
      );

      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse(convertData));
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req, res, next) {
    try {
      const { id } = req.params;
      const blogRecord = await BlogSchema.findOne({
        _id: id,
      });

      if (!blogRecord) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Blog does not exist"));
      }

      const convertItem = {
        id: blogRecord._id,
        title: blogRecord.title,
        content: blogRecord.content,
        tagList: [],
      };
      if (blogRecord.tags.length > 0) {
        const tagRecords = await TagSchema.find({
          _id: { $in: blogRecord.tags },
        });

        if (tagRecords.length > 0) {
          convertItem["tagList"] = tagRecords.map((tag) => tag.tagName);
        }
      }

      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse(convertItem));
    } catch (error) {
      next(error);
    }
  }

  async getBlogByName(req, res, next) {
    try {
      const { name } = req.params;
      const blogRecords = await BlogSchema.find({
        title: { $regex: name, $options: "i" },
      });

      if (!blogRecords) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Blog does not exist"));
      }

      // convert tagname if available
      const convertData = await Promise.all(
        blogRecords.map(async (blogItem) => {
          const convertItem = {
            id: blogItem.id,
            content: blogItem.content,
            title: blogItem.title,
            thumbnailUrl: blogItem.thumbnailUrl,
            tagList: [],
          };

          if (blogItem.tags.length > 0) {
            const tagRecords = await TagSchema.find({
              _id: { $in: blogItem.tags },
            });

            if (tagRecords.length > 0) {
              convertItem["tagList"] = tagRecords.map((tag) => tag.tagName);
            }
          }

          return convertItem;
        })
      );

      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse(convertData));
    } catch (error) {
      next(error);
    }
  }

  async createBlog(req, res, next) {
    const { title, content, tags } = req.body;
    const thumbnail = req.file;
    let tagList = [];
    let count = 0;

    let thumbnailUrl = "";

    // Validate blog info
    if (title?.length === 0) {
      res.status(400).send({ message: "Title must not be empty" });
      return;
    }

    if (tags) {
      // check if tagId valid
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].trim().length !== 0 && isValidObjectId(tags[i].trim())) {
          count += 1;
        }
      }

      if (count > 0 && count < tags.length) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Tag id contains some invalid data"));
      }

      if (count === tags.length) {
        const tagRecords = await TagSchema.find({ _id: { $in: tags } });
        if (tagRecords.length === 0 || tagRecords.length !== tags.length) {
          return res
            .status(HttpStatusCode.BadRequest)
            .send(new BadRequest("Tag id contains some invalid data"));
        }

        tagList = JSON.parse(JSON.stringify(tags));
      }
    }

    // check if image is uploaded correctly
    if (thumbnail) {
      thumbnailUrl = thumbnail.path;
    }

    // create model to insert db

    const newBlog = new BlogSchema({
      title,
      content,
      tags: tagList,
      thumbnailUrl,
    });

    // save to db and return result
    await newBlog.save();

    // save to db blogtag

    return res.status(200).send({
      message: "Blog is created successfully",
    });
  }

  async updateBlog(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      const thumbnail = req.file;
      let thumbnailUrl = "";

      const blogRecord = await BlogSchema.findOne({
        _id: id,
      });

      if (!blogRecord) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Blog does not exist"));
      }

      // check new title
      if (title?.trim().length === 0) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Title must not be empty"));
      }

      // check new tags

      let tagList = [];
      let count = 0;

      // check if tagId valid
      let invalidTagItemList = ["", "undefined", "null"];
      for (let i = 0; i < tags?.length; i++) {
        if (!invalidTagItemList.includes(tags[i].trim())) {
          count += 1;
        }
      }

      if (count > 0 && count < tags.length) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Tag id contains some invalid data"));
      }

      if (count === tags?.length) {
        let tagRecords = await TagSchema.find({ _id: { $in: tags } });
        if (tagRecords.length > 0) {
          tagList = JSON.parse(JSON.stringify(tags));
        }
      }

      // handle thumbnail
      thumbnailUrl = blogRecord.thumbnailUrl;

      // check if new file is uploaded
      if (thumbnail) {
        thumbnailUrl = thumbnail.path;
      }
      let updateResult = await BlogSchema.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            title: title,
            content: content,
            tags: tagList,
            thumbnailUrl: thumbnailUrl,
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Blog fail to be updated"));
      }

      // update found blog
      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse("Blog is updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const { id } = req.params;

      const blogRecord = await BlogSchema.findOne({
        _id: id,
      });

      if (!blogRecord) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Blog does not exist"));
      }

      console.log({ id });
      console.log(blogRecord);

      let updateResult = await BlogSchema.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            isDelete: true,
            deletedDate: new Date(),
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest(`Can't delete blog with id : ${id}`));
      }

      // update found blog
      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse("Blog is deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
