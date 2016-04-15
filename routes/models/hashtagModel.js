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
var hashtagSchema = new Schema({
  tags: {
      type: String ,
      index: true
      //get: getTags,
      //set: setTags
  },
  tweet: {
    type: Schema.ObjectId,
    ref: 'Users.tweets'
  }
},{
  versionKey: false
});
var Hashtags = mongoose.model('Hashtag',hashtagSchema);

module.exports = Hashtags;
