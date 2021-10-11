//import mapbox, mapboxtoken, mapboxgl
import { MapboxClient, mapboxgl } from "mapbox";

const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

function initMap() {
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
  });
}

function initSearchForm(callback) {
  const form = document.querySelector(".search-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mapboxClient.geocodeForward(
      e.target.q.value,
      {
        country: "ar",
        autocomplete: true,
        language: "es",
      },
      function (err, data, res) {
        console.log(data);
        if (!err) callback(data.features);
      }
    );
  });
}

(function () {
  window.map = initMap();
  initSearchForm(async function (results) {
    console.log(results);
    const firstResult = results[0];
    const marker = new mapboxgl.Marker()
      .setLngLat(firstResult.geometry.coordinates)
      .addTo(map);
    map.setCenter(firstResult.geometry.coordinates);
    map.setZoom(14);

    const [lng, lat] = firstResult.geometry.coordinates;

    const request = await fetch(`/comercios-cerca-de?lat=${lat}&lng=${lng}`);
    const data = await request.json();

    try {
      data.map((result) => {
        console.log(result);
        new mapboxgl.Marker({ color: "#222" })
          .setLngLat(result._geoloc)
          .setPopup(new mapboxgl.Popup().setHTML(`<h1>${result.nombre}</h1>`))
          .addTo(map);
        map.setCenter(result._geoloc);
        map.setZoom(14);
      });
    } catch (err) {
      console.error(err);
    }
  });
})();

// <script src="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
// <script src="https://unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>
// <form class="search-form">
// <input name="q" type="search" />
// <button>Buscar</button>
// </form>
// <div id="map" style="width: 100%; height: 100%"></div>
