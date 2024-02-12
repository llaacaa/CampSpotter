const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    //images: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
});