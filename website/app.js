// Personal API Key for OpenWeatherMap API
const apiKey = '41e31698059348f91ac66b0cd2bc4295&units=imperial';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Event listener for the Generate button
document.getElementById('generate').addEventListener('click', handleGenerate);

/**
 * Main function executed on button click.
 * Handles user input, fetches weather data, posts to the server, and updates the UI.
 */
async function handleGenerate() {
  const zipCode = document.getElementById('zip').value.trim();
  const feelings = document.getElementById('feelings').value.trim();

  // Validate ZIP code input
  if (!zipCode) {
    alert('Please enter a valid ZIP code.');
    return;
  }

  try {
    // Fetch weather data
    const weatherData = await getWeatherData(zipCode);

    if (weatherData?.main) {
      // Prepare data for POST request
      const newDate = new Date().toLocaleDateString('en-US');
      const weatherInfo = {
        temperature: weatherData.main.temp,
        date: newDate,
        userResponse: feelings || 'No feelings provided.',
      };

      // Send data to the server
      await postData('/add', weatherInfo);

      // Update UI
      updateUI();
    } else {
      alert('Invalid ZIP code or unable to fetch weather data. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  }
}

/**
 * Function to fetch weather data from the OpenWeatherMap API.
 * @param {string} zipCode - The ZIP code to fetch weather data for.
 * @returns {Object} - The weather data object.
 */
const getWeatherData = async (zipCode) => {
  try {
    const response = await fetch(`${baseUrl}?zip=${zipCode}&appid=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch weather data.');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Function to post data to the server.
 * @param {string} url - The endpoint to send data to.
 * @param {Object} data - The data to send.
 * @returns {Object} - The server response.
 */
const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to post data.');
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

/**
 * Function to update the UI with the latest project data.
 */
const updateUI = async () => {
  try {
    const response = await fetch('/all');
    if (!response.ok) throw new Error('Failed to fetch UI data.');
    const data = await response.json();

    // Update the DOM elements with the fetched data
    document.getElementById('date').textContent = `Date: ${data.date}`;
    document.getElementById('temp').textContent = `Temperature: ${Math.round(data.temperature)}°F`;
    document.getElementById('content').textContent = `Feelings: ${data.userResponse}`;
  } catch (error) {
    console.error('Error updating UI:', error);
    alert('Unable to update the UI. Please try again later.');
  }
};
