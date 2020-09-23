const {validationResult} = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
    res.status(200).json({
        posts: [{
            title: 'First Post', 
            content: "This is the first post.", 
            imageUrl: 'images/garden_of_the_moon.jpg', 
            creator:{
            name: 'Kevin'
        },
        createdAt: new Date()
        }]
    })
}

exports.createPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: 'validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }

    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/garden_of_the_moon.jpg',
        creator: {
            name: 'Kevin'
        }
    })
    post.save()
        .then(response => {
            console.log(res);
            res.status(201).json({
                message: 'Post created successfully',
                post: response
            })
        })
        .catch(err => console.log(err));
}