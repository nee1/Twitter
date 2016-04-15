var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var connection = mongoose.connect("mongodb://localhost:27017/users");
//  Getters and Setters
/*var getTags = function(tags) {
  return tags.join(',');
};

var setTags = function(tags) {
  return tags.split(',');
};
*/

var tweetSchema = new Schema({
    body: {
        type: String,
        default: '',
        trim: true
    },
    tags: {
        type: [] ,
        index: true
        //get: getTags,
        //set: setTags
    },
    retweetCount : {
        type : Number,
        required: false,
        default: 0
    },
    isRetweet: {
        type: Boolean,
        required:false
    },
    originTweetId: {
        type: Schema.ObjectId,
        required: false
    },
    originTweetBy: {
        type: String,
        required:false
    },
    originTweetAt: {
        type: Date,
        required:false
    },
    //if retweet this is real tweet time
    createdAt: {
        type: Date,
        default: Date.now
    }
    //user: {type: Schema.ObjectId, ref: 'User'},
    //comments: [{
    //    body: {type: String, default: ''},
    //    user: {type: Schema.ObjectId, ref: 'User'},
    //    commenterName: {type: String, default: ''},
    //    createdAt: {type: Date, default: Date.now}
    //}],
    //favorites: [{type: Schema.ObjectId, ref: 'User'}],
    //favoriters: [{type: Schema.ObjectId, ref: 'User'}],  // same as favorites
    //favoritesCount: Number,
});

// create a schema
var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first: {
    	type: String,
        required: true
    },
    last: {
    	type: String,
        required: false
    },
    email: {
    	type: String,
        required: true
    },
    birthdate: {
    	type: Date,
        required: false
    },
    location: {
    	type: String,
    	require: false
    },

    followers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],

    tweets: [tweetSchema]
},{
    timestamps: true,
    versionKey: false
});


userSchema.methods = {
  // Methods on the Schema
    follow: function(id) {
        if (this.following.indexOf(id) === -1) {
          this.following.push(id);
        } else {
          this.following.splice(this.following.indexOf(id), 1);
        }
        console.log(this.following);
    },
    follower: function(id){
        if(this.followers.indexOf(id) === -1){
            this.followers.push(id);
        } else {
            this.followers.splice(this.followers.indexOf(id),1);
        }
    }
};
// the schema is useless so far
// we need to create a model using it
var Users = mongoose.model('User', userSchema);

// make this available to our Node applications
module.exports = Users;
