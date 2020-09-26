const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth')

router.put('/signup',[
    body('email')
        .isEmail()
        .withMessage('please enter a valid email.')
        .custom((value, {req}) => {
            User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email address already exists');
                }
            })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5}),
    body('name')
        .trim()
        .not()
        .isEmpty()
    ], authController.signup)

module.exports = router;