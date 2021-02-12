const Joi = require("joi");

module.exports = {

    validateGHPost: (body) => {

        const schema = Joi.object({
            ghpost: Joi.string()
                .required()
                .trim()
                .uppercase()
                .max(13)
        });

        return schema.validate(body)


    },

    validateLatLong: (body) => {

            const schema = Joi.object({
                lat: Joi.number()
                    .required(),

                long:Joi.number()
                    .required()
            });

            return schema.validate(body)


        }


}

