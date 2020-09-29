const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.')
        errors.statusCode = 422;
        errors.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({
            email: email,
            password: hashedPass,
            name: name
        });
        const savedUser = await user.save();
        res.status(201).json({message: 'User created.', userId: savedUser._id});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email})
        if(!user){
            const error = new Error('This email could not be found');
            error.statusCode = 401;
            throw error;
        }
        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch){
            const error = new Error('Wrong Password');
            error.status = 401;
            throw error
        }
        const token = jwt.sign({
            email: user.email, 
            userId: user._id.toString()
        }, 'secret', {
            expiresIn: '1h'
        })
        res.status(200).json({ token: token, userId: user._id.toString() })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if(!user){
            const error = new Error('User not found');
            statusCode = 404;
            throw error;
        }
        res.status(200).json({status: user.status});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try{
        const user = await User.findById(req.userId)
        if(!user){
            const error = new Error('User not found');
            statusCode = 404;
            throw error;
        }

        user.status = newStatus;
        await user.save();
        res.status(200).json({message: 'User updated.'});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}