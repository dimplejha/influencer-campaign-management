const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  username: String,
  influence_score: Number,
  posts: Number,
  followers: Number,
  avg_likes: Number,
  engagement_rate: Number,
  new_post_avg_like: Number,
  total_likes: Number,
  country: String,
});

module.exports = mongoose.model('Influencer', influencerSchema);
