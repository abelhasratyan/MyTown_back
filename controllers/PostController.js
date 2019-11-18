const Posts = require('../models/PostModel')
const User = require('../models/UserModel')

exports.addPost = (req, res, next) => {
    const postData = {
        userId: req.body.userId,
        text: req.body.text,
    };
    // console.log("+_+_+_+ req.file =>?", req.file);
    if (req.file) {
        postData.file = {
            path: `${process.env.SERVER_URL}/uploads/posts/${req.file.filename}`,
            name: req.file.filename
        }
    }
    Posts.findOneAndUpdate({ userId: postData.userId }, {
        $push: {
           posts: {
                $each: [postData],
                $position: 0
        }} 
    }, {new: true})
    .then(result => {
        if (!result) {
            res.json({
                success: false
            })
        }
        res.json({
            success: true,
            result: result.posts.slice(0)[0]
        })
    }).catch(err => {
        console.log(err)
        next(err)
    })
}

exports.getUserPosts = (req, res, next) => {
    const userid = req.params.id;
    Posts.findOne({ 
        userId: userid
    }).then(result => {
        // console.log(result);
        if (!result) {            
            res.json({
                error: true,
                message: "Posts not found"
            })
        } else {
            res.json({
                success: true,
                postsList: result.posts
            })
        }
    })
    .catch(err => {
        next(err)
    })
};

// exports.addComment = (req, res, next) => {
    
//     console.log('log in add comment controller0')

// } 

