const {validationResult} = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200).json({
            message: 'Posts Fetched',
            posts: posts
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        const error = new Error('validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    if(!req.file){
        const error = new Error('No Image Provided');
        error.statusCode = 422;
        throw error;
    }
    console.log('here')
    const imageUrl = req.file.path.replace(/\\/g, "/")
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({message: 'Post Fetched', post: post})
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}