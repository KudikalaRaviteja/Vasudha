// Initialize the map
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        projection: 'EPSG:4326', // Set projection to EPSG:4326
        center: [79.7, 17.92], // Set center to [79.7, 17.92]
        zoom: 10
    })
});

// Create the sources for the WMS layers
const source2 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Historical/wms',
    params: { 'LAYERS': 'Historical:MergedRainfall', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source2
    serverType: 'geoserver'
});

const source3 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Historical/wms',
    params: { 'LAYERS': 'Historical:MergedTmax', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source3
    serverType: 'geoserver'
});

const source4 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Historical/wms',
    params: { 'LAYERS': 'Historical:MergedTmin', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source4
    serverType: 'geoserver'
});

const source5 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Historical/wms',
    params: { 'LAYERS': 'Historical:Normal_Rainfall', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source4
    serverType: 'geoserver'
});

const source6 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Real_Time/wms',
    params: { 'LAYERS': 'Real_Time:June_1_17', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source4
    serverType: 'geoserver'
});

const source7 = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Prediction/wms',
    params: { 'LAYERS': 'Prediction:June2024', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source4
    serverType: 'geoserver'
});
// Create the WMS layers
const layer2 = new ol.layer.Image({
    source: source2,
    opacity:0.6
});

const layer3 = new ol.layer.Image({
    source: source3,
    opacity:0.6
});

const layer4 = new ol.layer.Image({
    source: source4,
    opacity:0.6
});

const layer5 = new ol.layer.Image({
    source: source5,
    opacity:0.6
});

const layer6 = new ol.layer.Image({
    source: source6,
    opacity:0.6
});

const layer7 = new ol.layer.Image({
    source: source7,
    opacity:0.6
});

// Add the layers to the map
map.addLayer(layer2);
map.addLayer(layer3);
map.addLayer(layer4);
map.addLayer(layer5);
map.addLayer(layer6);
map.addLayer(layer7);

// Initially only show the checked layer
layer2.setVisible(true);
layer3.setVisible(false);
layer4.setVisible(false);
layer5.setVisible(false);
layer6.setVisible(false);
layer6.setVisible(false);

// Handle layer visibility based on radio button state
document.getElementById('layer2').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(true);
        layer3.setVisible(false);
        layer4.setVisible(false);
        layer5.setVisible(false);
        layer6.setVisible(false);
        clearFeatureInfo2();
        
    }
});

document.getElementById('layer3').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(false);
        layer3.setVisible(true);
        layer4.setVisible(false);
        layer5.setVisible(false);
        layer6.setVisible(false);
        clearFeatureInfo3();
    }
});

document.getElementById('layer4').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(false);
        layer3.setVisible(false);
        layer4.setVisible(true);
        layer5.setVisible(false);
        layer6.setVisible(false);
        clearFeatureInfo4()
    }
});

document.getElementById('layer5').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(false);
        layer3.setVisible(false);
        layer4.setVisible(false);
        layer5.setVisible(true);
        layer6.setVisible(false);
        clearFeatureInfo5()
    }
});

document.getElementById('layer6').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(false);
        layer3.setVisible(false);
        layer4.setVisible(false);
        layer5.setVisible(false);
        layer6.setVisible(true);

        clearFeatureInfo6()
    }
});

document.getElementById('layer7').addEventListener('change', function () {
    if (this.checked) {
        layer2.setVisible(false);
        layer3.setVisible(false);
        layer4.setVisible(false);
        layer5.setVisible(false);
        layer6.setVisible(false);
        layer7.setVisible(true);

        clearFeatureInfo7()
    }
});

// Handle feature info display
// Handle feature info display
map.on('singleclick', function (evt) {
    const viewResolution = map.getView().getResolution();

    function getFeatureInfo(url, layerName) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let infoHtml = `<table><tr>`;
                if (data.features && data.features.length > 0) {
                    const properties = data.features[0].properties;
                    for (const key in properties) {
                        infoHtml += `<td><strong>${key}</strong></td>`;
                    }
                    infoHtml+=`</tr><tr>`
                    for (const key in properties) {
                        const value = parseFloat(properties[key]);
                        const displayValue = (value < 0) ? '-' : value.toFixed(3);
                        infoHtml += `<td>${displayValue}</td>`;
                    }
                    infoHtml+=`</tr>`
                } else {
                    infoHtml += '<tr><td colspan="2">No features found.</td></tr>';
                }
                infoHtml += `</table>`;
                document.getElementById('info').innerHTML = infoHtml; // Only show current layer info
            })
            .catch(error => {
                console.error('Error fetching feature info:', error);
                document.getElementById('info').innerHTML = `<p><strong>${layerName}:</strong> Error fetching feature info.</p>`;
            });
    }



    const checkedLayer = document.querySelector('input[name="layer"]:checked').id;

    if (checkedLayer === 'layer2') {
        const url = source2.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Merged Rainfall');
    } else if (checkedLayer === 'layer3') {
        const url = source3.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Merged Tmax');
    } else if (checkedLayer === 'layer4') {
        const url = source4.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Merged Tmin');
    }
    else if (checkedLayer === 'layer5') {
        const url = source5.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Normal Rainfall');
    }
    else if (checkedLayer === 'layer6') {
        const url = source6.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Observed Rainfall');
    }
    else if (checkedLayer === 'layer7') {
        const url = source7.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        if (url) getFeatureInfo(url, 'Forecasted Rainfall');
    }
});

// Function to clear feature info
function clearFeatureInfo2() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Daily Average Rainfall</p>';
}

function clearFeatureInfo3() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Daily Average Maximum Temperature</p>';
}

function clearFeatureInfo4() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Daily Average Minimum Temperature</p>';
}

function clearFeatureInfo5() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Normal Annual Rainfall of 123 years</p>';
}

function clearFeatureInfo6() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Observed Rainfall  in June-2024</p>';
}

function clearFeatureInfo7() {
    document.getElementById('info').innerHTML = '<p>Click on Warangel district map to get Forecasted Rainfall of June-2024</p>';
}

// ADDING GEOJSON OF WARANGAL TO HIGHLIGHT THE BORDER OF WARANGAL DISTRICT

// var fill = new ol.style.Fill({
//     color: 'rgba(255,255,255,0)'
//   });
//   var stroke = new ol.style.Stroke({
//     color: '#FF0000',
//     width: 3
//   });

// var style=new ol.style.Style({
//     fill:fill,
//     stroke:stroke
// })

// var sr=new ol.source.Vector({
//     format:new ol.format.GeoJSON({}),
//     url:'warangal.json'
// })

// var geoJSON=new ol.layer.Vector({
//     source:sr,
//     style:style
// })

// map.addLayer(geoJSON)


const shpSrc = new ol.source.ImageWMS({
    url: 'http://54.166.153.107:8080/geoserver/Warangal/wms',
    params: { 'LAYERS': '	Warangal:dist', 'CRS': 'EPSG:4326' }, // Set workspace and layer for source4
    serverType: 'geoserver'
});
// Create the WMS layers
const shpLay = new ol.layer.Image({
    source: shpSrc
});

map.addLayer(shpLay)
