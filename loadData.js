const db = require('./db'); 
const csv = require('csvtojson');
const Influencer = require('./models/Influencer');

db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const jsonArray = await csv().fromFile('top_insta_influencers_data.csv');
    console.log('CSV data loaded successfully.');

    const saveOperations = jsonArray.map(async (item) => {
      item.posts = convertToNumber(item.posts);
      item.followers = convertToNumber(item.followers);
      item.avg_likes = convertToNumber(item.avg_likes);
      item.new_post_avg_like = convertToNumber(item.new_post_avg_like);
      item.total_likes = convertToNumber(item.total_likes);

      const influencer = new Influencer(item);
      try {
        await influencer.save();
        console.log(`Saved influencer: ${item.channel_info}`);
      } catch (error) {
        console.error('Error saving influencer:', error);
      }
    });

    await Promise.all(saveOperations); 
    console.log('All influencers have been saved.');
  } catch (err) {
    console.error('Error during data processing:', err);
  }
});

function convertToNumber(value) {
  if (typeof value !== 'string') return value;
  let multiplier = 1;

  if (value.endsWith('k')) {
    multiplier = 1000;
    value = value.slice(0, -1);
  } else if (value.endsWith('m')) {
    multiplier = 1000000;
    value = value.slice(0, -1);
  } else if (value.endsWith('b')) {
    multiplier = 1000000000;
    value = value.slice(0, -1);
  }

  return parseFloat(value) * multiplier;
}
