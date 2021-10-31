//import mapbox, mapboxtoken, mapboxgl
const MapboxClient = require("mapbox");
import * as mapboxgl from "../../node_modules/mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.MAPBOX_TOKEN;

export async function mapping() {
  const form: any = document.querySelector(".pet-data");
  const mapboxClient = new MapboxClient(TOKEN);

  function initMap() {
    mapboxgl.accessToken = TOKEN;
    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }

  function initSearchForm(callback) {
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
          if (!err) callback(data.features);
        }
      );
    });
  }

  const map = initMap();
  initSearchForm(async function (results) {
    const firstResult = results[0];
    const marker = new mapboxgl.Marker({ color: "#222", draggable: true })
      .setLngLat(firstResult.geometry.coordinates)
      .addTo(map);
    map.setCenter(firstResult.geometry.coordinates);
    map.setZoom(14);
    form.geoloc.value = firstResult.geometry.coordinates;

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      // form.style.display = "block";
      form.geoloc.value = `${lngLat.lng}, ${lngLat.lat}`;
      // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    });
  });
}
