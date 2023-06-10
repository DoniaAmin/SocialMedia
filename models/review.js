const { Schema, default: mongoose } = require('mongoose');

const reviewSchema = new Schema({
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
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

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;