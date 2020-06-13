const router = require('express').Router();

router.get('/test', (req, res) => {
    res.send("Hello, its working");
    
})

module.exports = router