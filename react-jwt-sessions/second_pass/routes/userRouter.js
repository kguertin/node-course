const router = require('express').Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const User = require('../models/userModel');


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
        res.status(500).json({error: err.message});
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
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.delete('/delete', auth, async (req, res) => {
    console.log(req.user);
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);

        const varified = jwt.verify(token, process.env.JWT_SECRET);
        if (!varified) return res.json(false);

        const user = await User.findById(varified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id
    });
})

module.exports = router