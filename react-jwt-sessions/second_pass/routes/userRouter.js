const router = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { rawListeners } = require('../models/userModel');

router.post('/register', async (req, res) => {
    try {
        let {email, password, passwordCheck, displayName} = req.body;
    
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({msg: "Not all fields have been entered"})
        }
        if (password.length < 5){
            return res.status(400).json({msg: "The password needs to be at least 5 characters long"})
        }
        if (password !== passwordCheck) {
            return res.status(400).json({msg: "Enter the same password twice for varification"})
        }

        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({msg: 'An account with this email already exist'});
        }
        if (!displayName) displayName = email;

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            password: passwordHash, 
            displayName: displayName
        });

        const savedUser = await newUser.save();
        res.json(savedUser)

    } catch (err) {
        res.status(500).json({errpr: err.message});
    }

});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({msg: "Not all fields have been entered"})
        }

        const user = await User.findOne({email: email})
        if (!user) {
            return res.status(400).json({msg: 'No account with this email has been registered'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json('Invalid credentials')
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({token, user: { 
            id: user._id,
            displayName: user.displayName,
            email: user.email
        }})
    } catch {
        res.status(500).json({error: err.message});
    }
})


module.exports = router