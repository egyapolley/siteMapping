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


        },

    validateMessage: (body) => {

        const schema = Joi.object({
            name: Joi.string()
                .max(400)
                .trim()
                .label("Name")
                .required(),

            email:Joi.string()
                .email()
                .max(400)
                .trim()
                .label("Email")
                .required(),

            contact:Joi.string()
                .max(400)
                .trim()
                .label("Phone Contact")
                .required(),

            message: Joi.string()
                .max(500)
                .trim()
                .label("Message")
                .required(),
        });

        return schema.validate(body)


    }


}

