const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tweetSchema = new mongoose.Schema(
  {
    tweet: {
      type: String,
    },
    images: {
      type: Array,
    },
    video: {
      public_id: String,
      url: String,
      // views: {
      //   type: Number,
      //   default: 0,
      // },
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tweet', tweetSchema);
