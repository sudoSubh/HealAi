const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration to allow requests from localhost and Vercel
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
    'https://healer--ai.vercel.app',
    'https://healer--ai-git-*.vercel.app' // For preview deployments
  ],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Google Places API proxy endpoint
app.get('/api/google-places', async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get parameters from query
  const { lat, lng, radius = '10000', type = 'hospital' } = req.query;

  // Validate required parameters
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Validate that lat and lng are numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  // Validate radius
  const searchRadius = parseInt(radius);
  if (isNaN(searchRadius) || searchRadius > 50000) {
    return res.status(400).json({ error: 'Invalid radius. Must be a number and less than 50000 meters.' });
  }

  try {
    // Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key not found');
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    // Construct the Google Places API URL for nearby search
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${searchRadius}&type=${type}&key=${apiKey}`;
    
    console.log('Making request to Google Places API (Nearby Search):', nearbySearchUrl);

    // Make request to Google Places API (Nearby Search)
    const nearbyResponse = await fetch(nearbySearchUrl);
    
    if (!nearbyResponse.ok) {
      const errorText = await nearbyResponse.text();
      console.error('Google Places API error:', nearbyResponse.status, errorText);
      return res.status(nearbyResponse.status).json({ 
        error: `Google Places API error: ${nearbyResponse.status}`, 
        details: errorText 
      });
    }

    const nearbyData = await nearbyResponse.json();
    
    // Fetch detailed information for each place
    const detailedResults = [];
    if (nearbyData.results) {
      for (const place of nearbyData.results) {
        // Construct the Google Places Details API URL
        // Include more fields to get better information
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,opening_hours,website,geometry,url,place_id&key=${apiKey}`;
        
        try {
          // Make request to Google Places Details API
          const detailsResponse = await fetch(detailsUrl);
          
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            
            if (detailsData.result) {
              // Use detailed geometry if available, otherwise fallback to original geometry
              const geometry = detailsData.result.geometry || place.geometry;
              
              // Calculate distance using the most accurate geometry available
              const distance = geometry && geometry.location ? 
                calculateDistance(
                  latitude, 
                  longitude, 
                  geometry.location.lat, 
                  geometry.location.lng
                ) : 0;
              
              console.log(`Hospital: ${place.name}, Distance: ${distance.toFixed(2)} km`);
              
              // Merge the detailed information with the nearby search result
              const detailedPlace = {
                ...place,
                ...detailsData.result,
                distance: distance
              };
              
              detailedResults.push(detailedPlace);
            } else {
              // If details API doesn't return result, use the nearby search data
              const distance = place.geometry && place.geometry.location ? 
                calculateDistance(
                  latitude, 
                  longitude, 
                  place.geometry.location.lat, 
                  place.geometry.location.lng
                ) : 0;
              
              detailedResults.push({
                ...place,
                distance: distance
              });
            }
          } else {
            // If details API request fails, use the nearby search data
            const distance = place.geometry && place.geometry.location ? 
              calculateDistance(
                latitude, 
                longitude, 
                place.geometry.location.lat, 
                place.geometry.location.lng
              ) : 0;
            
            detailedResults.push({
              ...place,
              distance: distance
            });
          }
        } catch (detailsError) {
          // If details API request fails, use the nearby search data
          const distance = place.geometry && place.geometry.location ? 
            calculateDistance(
              latitude, 
              longitude, 
              place.geometry.location.lat, 
              place.geometry.location.lng
            ) : 0;
          
          detailedResults.push({
            ...place,
            distance: distance
          });
        }
      }
      
      // Sort by distance (closest first)
      detailedResults.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Return the data with detailed information
    return res.status(200).json({
      ...nearbyData,
      results: detailedResults
    });
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data from Google Places API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});