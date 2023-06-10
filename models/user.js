require('dotenv').config()
const { Schema, default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   profileImage: {
      type: String,
      default: ''
   },
   bio: {
      type: String,
      default: ''
   },
   password: {
      type: String,
      required: true,
      select: false
   },
   role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

userSchema.virtual('posts', {
   ref: 'Post',
   localField: '_id',
   foreignField: 'creator',
   justOne: false,

})

// Enable virtual population
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true, transform: (_doc, ret) => { delete ret.id; } });


userSchema.pre('save', async function () {
   const { password } = this;
   if (this.isModified('password')) {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
      this.password = hashedPassword;
   }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;