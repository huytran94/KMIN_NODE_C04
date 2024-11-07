import { BadRequest, SuccessResponse } from "../apiResponses/apiResponse.js";
import { HttpStatusCode } from "../constants/httpStatusCode.js";
import TagSchema from "../models/TagSchema.js";

class TagController {
  async getTags(req, res, next) {
    try {
      const tagRecords = await TagSchema.find();
      const convertData = tagRecords.map((item) => ({
        id: item._id,
        tagName: item.tagName,
      }));
      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse(convertData));
    } catch (error) {
      next(error);
    }
  }

  async createTag(req, res, next) {
    let { tagName } = req.body;

    // clean the tagName
    tagName = tagName.trim().toLowerCase();

    // Validate tag info
    if (tagName.length === 0) {
      res.status(400).send({ message: "Tag name must not be empty" });
    }

    const newTag = new TagSchema({
      tagName,
    });

    // save to db and return result
    await newTag.save();

    // save to db blogtag

    return res.status(200).send({
      message: "New tag is created successfully",
    });
  }

  async updateTag(req, res, next) {
    try {
      const { id } = req.params;
      let { tagName } = req.body;
      const tagRecord = await TagSchema.findOne({
        _id: id,
      });

      if (!tagRecord) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Tag does not exist"));
      }

      // clean the tagName
      tagName = tagName.trim();

      if (!tagName || tagName.length === 0) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("tag name must not be empty"));
      }

      let updateResult = await TagSchema.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            tagName,
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Tag fail to be updated"));
      }

      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse("Tag is updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      const tagRecord = await TagSchema.findOne({
        _id: id,
      });

      if (!tagRecord) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(new BadRequest("Tag does not exist"));
      }

      let updateResult = await TagSchema.updateOne(
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
          .send(new BadRequest(`Can't delete tag with id : ${id}`));
      }

      return res
        .status(HttpStatusCode.Ok)
        .send(new SuccessResponse("Tag is deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default new TagController();
