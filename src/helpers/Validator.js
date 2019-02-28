const validator = {

    validateItem(item, fields) {
        const messages = [];

        for (const field of fields) {
            const validationResult = this.validate(item[field.name], field);

            if (validationResult !== null) {
                messages.push(validationResult);
            }
        }

        if (messages.length > 0) {
            throw new Error(messages.join('<br>'));
        }
    },

    validateAttribute(value, field) {
        const validationResult = this.validate(value, field);

        if (validationResult !== null) {
            throw new Error(validationResult);
        }
    },


    validate(value, field) {
        if (field.isNonNull() && value === null) {
            return `${field.name} is required.`;
        }

        if (value === null || value === undefined) {
            return null;
        }


        if (field.isInt() && isNaN(parseInt(value))) {
            return `${field.name} must be a number.`;
        }

        if (field.isFloat() && isNaN(parseFloat(value))) {
            return `${field.name} must be a floating point number.`;
        }

        return null;
    }
};


export default validator;
