const express = require('express');
const db = require('./db'); 
const Influencer = require('./models/Influencer');

const app = express();

app.use(express.json());

// Route to filter influencers based on criteria
app.get('/filter', async (req, res) => {
  const { min_influence_score, min_followers, country } = req.query;

  try {
    // Validate input query parameters
    const filters = {};
    if (min_influence_score) {
      if (isNaN(min_influence_score)) throw new Error('min_influence_score must be a number');
      filters.influence_score = { $gte: Number(min_influence_score) };
    }
    if (min_followers) {
      if (isNaN(min_followers)) throw new Error('min_followers must be a number');
      filters.followers = { $gte: Number(min_followers) };
    }
    if (country) filters.country = country;

    // Fetch influencers based on filters
    const influencers = await Influencer.find(filters);

    if (influencers.length === 0) {
      return res.status(404).json({ error: 'No influencers found matching the criteria' });
    }

    res.json(influencers);
  } catch (err) {
    console.error('Error in /filter API:', err.message);

    // Send a detailed error message
    res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

// Start the server only after the database connection is established
db.once('open', () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Handle unexpected errors or server shutdowns
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You might want to shut down the server or clean up resources here
});
