const Joi = require("joi");

const performanceCycleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().allow("").max(255).default(""),
  active: Joi.boolean().default(true),
});

const updatePerformanceCycleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().allow("").max(255),
  active: Joi.boolean(),
}).min(1);

const reviewSessionSchema = Joi.object({
  performanceCycleId: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required(),
  targetUserId: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required(),
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().allow("").max(255).default(""),
  active: Joi.boolean().default(true),
});

const updateReviewSessionSchema = Joi.object({
  performanceCycleId: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }),
  targetUserId: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .allow(null),
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().allow("").max(255),
  active: Joi.boolean(),
}).min(1);

const assignmentSchema = Joi.object({
  reviewerId: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }),
  reviewerIds: Joi.array()
    .items(Joi.string().guid({ version: ["uuidv4", "uuidv5"] }))
    .min(1)
    .unique(),
  revieweeId: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .allow(null),
}).or("reviewerId", "reviewerIds");

const feedbackSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  detail: Joi.string().trim().allow("").max(2000).default(""),
  star: Joi.number().integer().min(1).max(5).required(),
});

module.exports = {
  performanceCycleSchema,
  updatePerformanceCycleSchema,
  reviewSessionSchema,
  updateReviewSessionSchema,
  assignmentSchema,
  feedbackSchema,
};
