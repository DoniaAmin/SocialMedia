const { Schema, default: mongoose } = require('mongoose');

const postSchema = new Schema({
   content: {
      type: String,
      required: true,
   },
   creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }

});

postSchema.virtual('comments', {
   ref: 'Comment',
   localField: '_id', 
   foreignField: 'post',    
   justOne: false,

})

postSchema.virtual('reviews', {
   ref: 'Review',
   localField: '_id', 
   foreignField: 'post',    
   justOne: false,

})

// Enable virtual population
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true, transform: (_doc, ret) => { delete ret.id; } });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;