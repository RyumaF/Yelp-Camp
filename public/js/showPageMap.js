	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',//streets-v9
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 15,
        center: campground.geometry.coordinates
    });

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h3>${campground.title}<\h3><p>${campground.location}</p>`))
    .addTo(map);