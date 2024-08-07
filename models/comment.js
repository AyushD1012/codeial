const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    //comments belongs to the user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //include the array of ids of all comments in the post schema itself

    post:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]

}, {
    timestamps: true
});


const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;