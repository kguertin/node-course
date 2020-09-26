const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')

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
            console.log('success')
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}