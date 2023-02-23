const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tweetSchema = new mongoose.Schema(
  {
    tweet: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tweet', tweetSchema);
