//import mapbox, mapboxtoken, mapboxgl
import * as MapboxClient from "mapbox";
import * as mapboxgl from "../../node_modules/mapbox-gl/dist/mapbox-gl.js";

// console.log(mapboxgl, MapboxClient);

const TOKEN = process.env.MAPBOX_TOKEN;

export async function mapping() {
  const mapboxClient = new MapboxClient(TOKEN);

  function initMap() {
    mapboxgl.accessToken = TOKEN;
    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }

  function initSearchForm(callback) {
    const form = document.querySelector(".pet-data");
    form.addEventListener("change", (e) => {
      e.preventDefault();
      mapboxClient.geocodeForward(
        form.geoloc.value,
        {
          country: "ar",
          autocomplete: true,
          language: "es",
        },
        function (err, data, res) {
          // console.log(data);
          if (!err) callback(data.features);
        }
      );
    });
  }
  window.map = initMap();
  initSearchForm(async function (results) {
    const form = document.querySelector(".pet-data");
    // console.log(results);
    const firstResult = results[0];
    const marker = new mapboxgl.Marker({ color: "#222", draggable: true })
      .setLngLat(firstResult.geometry.coordinates)
      .addTo(map);
    map.setCenter(firstResult.geometry.coordinates);
    map.setZoom(14);

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      // form.style.display = "block";
      form.geoloc.value = `${lngLat.lng}, ${lngLat.lat}`;
      // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    });
  });
}

//const lngLat = marker.getLngLat();
// .setLngLat([0, 0])
// .addTo(map);

// function onDragEnd() {
// const lngLat = marker.getLngLat();
// coordinates.style.display = 'block';
// coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
// }

// marker.on('dragend', onDragEnd);

// (function () {
//   window.map = initMap();
//   initSearchForm(async function (results) {
//     console.log(results);
//     const firstResult = results[0];
//     const marker = new mapboxgl.Marker()
//       .setLngLat(firstResult.geometry.coordinates)
//       .addTo(map);
//     map.setCenter(firstResult.geometry.coordinates);
//     map.setZoom(14);

// const [lng, lat] = firstResult.geometry.coordinates;

// const request = await fetch(`/comercios-cerca-de?lat=${lat}&lng=${lng}`);
// const data = await request.json();

// try {
//   data.map((result) => {
//     console.log(result);
//     new mapboxgl.Marker({ color: "#222" })
//       .setLngLat(result._geoloc)
//       .setPopup(new mapboxgl.Popup().setHTML(`<h1>${result.name}</h1>`))
//       .addTo(map);
//       map.setCenter(result._geoloc);
//       map.setZoom(14);
//   });
// } catch (err) {
//   console.error(err);
// }
//   });
// })();
// <script src="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
// <script src="https://unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>
// <form class="search-form">
// <input name="q" type="search" />
// <button>Buscar</button>
// </form>
// <div id="map" style="width: 100%; height: 100%"></div>
