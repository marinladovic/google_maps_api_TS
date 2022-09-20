/**
 * Enter an address, get the latitude and longitude, and render these coordinates on a map.
 */
import axios from 'axios';

const GOOGLE_API_KEY = ''; // Enter your Google API key here

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const address = addressInput.value;

  // send this to Google's API!
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        address
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }

      // Drill down into the response to get the coordinates
      const coordinates = response.data.results[0].geometry.location;

      // Render the coordinates on a map
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 16,
      });

      // Add a marker to the map
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
});
