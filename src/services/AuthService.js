const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../enums/UserRole');
const AppError = require('../utils/AppError');

class AuthService {
    async register({ name, email, password, roles }) {
        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new AppError('Resource already exists.', 409, 'CONFLICT');
        }

        let roleIds = [];
        if (roles && Array.isArray(roles)) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            roleIds = foundRoles.map(r => r._id);
        }

        if (roleIds.length === 0) {
            const publicRole = await Role.findOne({ name: UserRole.PUBLIC });
            if (publicRole) roleIds.push(publicRole._id);
        }

        const user = await User.create({ name, email, password, role: roleIds });
        const populatedUser = await User.findById(user._id).populate('role');
        
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: populatedUser.role.map(r => r.name),
            token: this.generateToken(user._id)
        };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email }).populate('role');

        if (user && (await user.comparePassword(password))) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.role.map(r => r.name),
                token: this.generateToken(user._id)
            };
        } else {
            throw new AppError('Unauthorized access.', 401, 'UNAUTHORIZED');
        }
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }
}

module.exports = new AuthService();
