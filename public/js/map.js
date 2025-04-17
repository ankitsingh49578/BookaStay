mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: ok.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(ok.geometry.coordinates) // Listing.geometry.coordinates
  .setPopup(new mapboxgl.Popup({offset: 25, classname: 'my-class'}) // add popups
  .setHTML(`<h5>${ok.location}</h5><P>Welcome to BookaStay</P>`))
  .addTo(map);



