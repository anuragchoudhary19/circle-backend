const Tweet = require('../models/tweet');
const _ = require('lodash');

exports.tweetOnTimeline = async (req, res) => {
  try {
    const tweet = await new Tweet({ ...req.body }).save();
    req.socket.emit(`new tweet`, tweet);
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

exports.listTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ user: { $exists: false } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({ tweets });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
  }
};
exports.listTweetsWithMedia = async (req, res) => {
  try {
    const tweets = await Tweet.find({
      user: { $exists: false },
      $or: [{ 'images.0': { $exists: true } }, { video: { $exists: true } }],
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({ tweets });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
  }
};

exports.remove = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndDelete({ _id: req.params.id }).exec();
    req.socket.emit(`tweet-deleted`, tweet._id);
    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    res.status(403).json({ error: error });
    console.log(error);
  }
};

exports.like = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ _id: req.params.id }).exec();
    Tweet.findOneAndUpdate({ _id: req.params.id }, { likes: tweet.likes + 1 }, { new: true }).exec((err, result) => {
      req.socket.emit(`liked ${result._id}`, result.likes);
    });

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(403).json({ error: 'failed' });
  }
};
