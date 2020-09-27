const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
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

    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                email: email,
                password: hashedPass,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({message: 'User created.', userId: result._id});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                const error = new Error('This email could not be found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(passMatch => {
            if(!passMatch){
                const error = new Error('Wrong Password');
                error.status = 401;
                throw error
            }
            const token = jwt.sign({
                email: loadedUser.email, 
                userId: loadedUser._id.toString()
            }, 'secret', {
                expiresIn: '1h'
            })
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getUserStatus =(req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                statusCode = 404;
                throw error;
            }

            res.status(200).json({status: user.status});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    console.log('status:' ,newStatus)
    
    User.findById(req.userId)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                statusCode = 404;
                throw error;
            }

            user.status = newStatus;
            return user.save();
        })
        .then(result => {
            res.status(200).json({message: 'User updated.'});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}