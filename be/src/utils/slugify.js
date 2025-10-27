const slugify = require('slugify');

const generateSlug = (text) => {
    return slugify(text, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
};

module.exports = generateSlug;