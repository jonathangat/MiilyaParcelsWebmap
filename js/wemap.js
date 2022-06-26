// set up map
var map = L.map("map").setView([33.032663320260156, 35.22448930268471], 13);

// add tiles
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution: "© OpenStreetMap | אפיון ופיתוח: יונתן גת",
// }).addTo(map);

L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: "אפיון ופיתוח: יונתן גת | מפת רקע: גוגל מפות",
}).addTo(map);

// add locate
L.control.locate({ strings: { title: "إظهار موقعي" } }).addTo(map);

// interaction - mouse hover
// https://leafletjs.com/examples/choropleth/
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}
// build popup content

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });

  // build popup content
  let popupContent = `<div class='popupContent'>`;
  if (feature.properties.parcel_id) {
    popupContent += `<b>الرقم التسلسلي: </b>${feature.properties.parcel_id}<br />`;
  }
  if (feature.properties.parcel_name) {
    popupContent += `<b>اسم المنطقة: </b>${feature.properties.parcel_name}<br />`;
  }
  if (feature.properties.land_use) {
    popupContent += `<b>نوع التربة:</b> ${feature.properties.land_use}<br />`;
  }
  if (feature.properties.parcel_area) {
    popupContent += `<b>المساحة بالدونم:</b> ${feature.properties.parcel_area}<br />`;
  }
  if (feature.properties.agriculture_past_crop) {
    popupContent += `<b>استعمال الأرض بالماضي:</b> ${feature.properties.agriculture_past_crop}<br />`;
  }
  if (feature.properties.agriculture_present_crop) {
    popupContent += `<b>استعمال الأرض بالحاضر:</b> ${feature.properties.agriculture_present_crop}<br />`;
  }
  if (feature.properties.name_source) {
    popupContent += `<b>اصل التسمية:</b> ${feature.properties.name_source}<br />`;
  }
  if (feature.properties.archeological_sites) {
    popupContent += `<b>مواقع اثرية:</b> ${feature.properties.archeological_sites}<br />`;
  }

  popupContent += `</div>`;
  layer.bindPopup(popupContent);
}

// wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // fetch and add to map
  var parcelLayer = L.featureGroup();

  var fetchParcels = await fetch(
    "https://jonathang.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM miilya_parcels"
  ).then((response) => response.json());

  var parcelStyle = {};

  geojson = L.geoJson(fetchParcels, {
    style: parcelStyle,
    onEachFeature: onEachFeature,
  });

  geojson.addTo(parcelLayer);
  parcelLayer.addTo(map);
});
