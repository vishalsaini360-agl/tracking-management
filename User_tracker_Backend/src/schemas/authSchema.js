const Joi = require("joi")
const loginSchema = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()  })

  module.exports = { loginSchema };