const Language = require('../enums/Language');
const AppError = require('../utils/AppError');

const validateLanguage = (req, res, next) => {
    const { lang } = req.params;
    if (!Object.values(Language).includes(lang)) {
        return next(new AppError(`Invalid language: ${lang}. Supported languages are: ${Object.values(Language).join(', ')}`, 400));
    }
    next();
};

module.exports = { validateLanguage };
