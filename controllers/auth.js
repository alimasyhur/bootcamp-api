const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc     Register user to the application
// @route    POST /api/v1/auth/register
// @access   Public
module.exports.register = asyncHandler( async(req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
})

// @desc     User login authentication to the application
// @route    POST /api/v1/auth/login
// @access   Public
module.exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Match user password if email is found
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
})

// @desc     User getM authenticed user to the application
// @route    POST /api/v1/auth/getMe
// @access   Public
module.exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res
        .status(200)
        .json({
            success: true,
            data: user
        })
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}