const { body, validationResult } = require('express-validator');
const User = require('../models/users');

const userValidationRules = () => {
  return [
	body('email').trim(),
	body('email').normalizeEmail(),
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors);
  if (errors.isEmpty()) {
    return next()
  }
  console.log(req.body.email);
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}