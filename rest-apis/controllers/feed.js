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
    const title = req.body.title;
    const content = req.body.content;
    console.log(title, content)
    //Create post in db
    res.status(201).json({
        message: 'Post created successfully',
        post: {
            id: new Date().toISOString(),
            title,
            content
        }
    })
}