// set up map
var map = L.map('map').setView([33.032663320260156, 35.22448930268471], 13);

// add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap | אפיון ופיתוח: יונתן גת'
}).addTo(map);