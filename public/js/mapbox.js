export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmliZ3lvcjk4IiwiYSI6ImNrOXlsaHBwbTB0eDczc3FzNzdzeDlvdzUifQ.BH0DjvDvta5dF8w96SmNww';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vibgyor98/ck9ylzyt70l2q1ildve27n6p7',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 5,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const ele = document.createElement('div');
    ele.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: ele,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add pop up
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extend bnd to inc curr loc
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
