const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName :{
        type: 'string',
        required: true
    },
    lastName :{
        type: 'string',
        required: true
    },
    friends : [
        String
    ],
    email :{
        type: 'string',
        required: true
    },
    password : {
        type: 'string',
        required: true
    },
    picturePath : {
        type: 'string',
        required: true
    },
    location : String,
    occupation : String,
    viewedProfile : Number,
    impressions : Number
},
    {timestamps: true}
);

module.exports = mongoose.model("Users",UserSchema);