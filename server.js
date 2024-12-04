// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const cors = require('cors');
const bodyParser = require('body-parser');

/* Middleware */
// Here we are configuring express to use body-parser as middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors for cross-origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Callback function to complete GET '/all'
app.get('/all', (req, res) => {
  res.send(projectData);
});

// Post Route
app.post('/add', (req, res) => {
  const { temperature, date, userResponse } = req.body;
  projectData = { temperature, date, userResponse };
  res.send({ message: 'Data added successfully' });
});
