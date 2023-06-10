const { Schema, default: mongoose } = require('mongoose');

const commentSchema = new Schema({
   content: {
      type: String,
      required: true,
   },
   post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }

});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;