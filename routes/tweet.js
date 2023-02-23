const express = require('express');
const router = express.Router();

const {
  tweetOnTimeline,
  commentOnTweet,
  listTweets,
  retweet,
  like,
  // getTweet,
  remove,
  feed,
  // listLikedTweets,
  // listRepliedTweets,
  listTweetsWithMedia,
  // getTweetComments,
  // getNewTweet,
} = require('../controllers/tweet');
const { validateCreateStatus } = require('../validator/tweet');

// router.get('/feed', feed);

router.post('/tweet', tweetOnTimeline);
router.get('/', listTweets);
router.get('/tweets/all', listTweets);
// router.get('/tweets/replies/:userId', listRepliedTweets);
router.get('/tweets/media/', listTweetsWithMedia);

router.delete('/tweet/:id', remove);
// router.get('/status/comments/:id', jwtCheck, authCheck, readComments);

router.put('/tweet/like/:id', like);
// router.put('/tweet/retweet/:id', retweet);
// router.put('/tweet/comment/:id', commentOnTweet);
// router.delete('/tweet/comment/:id', jwtCheck, authCheck, removeComment);

//any routes containing :userId,then app will first execute userById()

module.exports = router;
