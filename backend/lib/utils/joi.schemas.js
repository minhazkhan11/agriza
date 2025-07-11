const { description } = require('@hapi/joi/lib/base');
const Joi = require('joi');

//Auth validations

module.exports.addUser = Joi.object({
  name: Joi.string().required(),
  password: Joi.optional(),
  phone: Joi.string().required(),
  email: Joi.string().required().email(),
  role: Joi.string(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});

// Signin
module.exports.signinUser = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Category
module.exports.addcategory = Joi.object({
  category_name: Joi.string().required(),
  description: Joi.optional(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});
// Units
module.exports.addunits = Joi.object({
  unit_name: Joi.string().required(),
  description: Joi.optional(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});

// State
module.exports.addstate = Joi.object({
  state_name: Joi.string().required(),
  country_id: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});
// District
module.exports.adddistrict = Joi.object({
  district_name: Joi.string().required(),
  country_id: Joi.required(),
  state_id: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});
// Tehsil
module.exports.addtehsil = Joi.object({
  tehsil_name: Joi.required(),
  district_id: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')
});
// Pin
module.exports.addpin = Joi.object({
  pin_code: Joi.required(),
  tehsil_id: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')
});
// Place
module.exports.addplace = Joi.object({
  place_name: Joi.required(),
  pin_id: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')
});
//Status
module.exports.changeStatus = Joi.object({
  active_status: Joi.string()
    .valid('active', 'inactive')
    .required(),
  id: Joi.required(),
});

// Action
module.exports.actionChange = Joi.object({
  ids: Joi.required(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted')
    .required(),
});

// Country
module.exports.addcountry = Joi.object({
  country_name: Joi.string().required(),
  country_code: Joi.optional(),
  active_status: Joi.string()
    .valid('active', 'inactive', 'deleted', 'hidden')

});


module.exports.verifyCode = Joi.object({
  code: Joi.string().required(),
});



