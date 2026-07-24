import Joi from "joi";

const updateUserStatusSchema =
  Joi.object({
    isActive: Joi.boolean()
      .required(),
  });

const updateUserRoleSchema =
  Joi.object({
    role: Joi.string()
      .valid(
        "user",
        "staff",
        "admin",
      )
      .required(),
  });

export {
  updateUserStatusSchema,
  updateUserRoleSchema,
};