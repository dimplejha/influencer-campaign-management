const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  description: String,
  influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }],
  start_date: Date,
  end_date: Date,
  status: String, // 'pending', 'active', 'completed'
});

module.exports = mongoose.model('Campaign', campaignSchema);
