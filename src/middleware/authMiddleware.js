const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).populate('role').select('-password');
            if (!req.user) {
                return next(new AppError('Unauthorized access. User not found.', 401, 'UNAUTHORIZED'));
            }
            next();
        } catch (error) {
            next(error);
        }
    }

    if (!token) {
        next(new AppError('Unauthorized access. No token provided.', 401, 'UNAUTHORIZED'));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        const userRoles = req.user.role.map(r => r.name);
        const hasRole = roles.some(role => userRoles.includes(role));
        
        if (!hasRole) {
            return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
        }
        next();
    };
};

module.exports = { protect, authorize };