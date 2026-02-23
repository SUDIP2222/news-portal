const Language = require('../enums/Language');
const AppError = require('../utils/AppError');

const validateLanguage = (req, res, next) => {
    const lang = req.query.lang || req.params.lang;
    if (!lang || !Object.values(Language).includes(lang)) {
        return next(new AppError('Invalid request data.', 400, 'BAD_REQUEST'));
    }
    next();
};

module.exports = { validateLanguage };
