const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

module.exports.register = asyncHandler( async(req, res, next) => {
    const { name, email, password, role } = req.body;

    console.log(name, email, password, role, req.body);

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({
        status: true
    });
})