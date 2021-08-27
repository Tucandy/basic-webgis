
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    
    var overlay = new ol.Overlay(({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    var shouldUpdate = true;
    var center = [564429.04, 2317738.2];
    var zoom = 16.56631263565161;
    var rotation = 0
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };      
    //B1.HienThi
    var format = 'image/png';
    var toado = [564180.4375, 2317463.25, 564516.125, 2318016.75];
    var vung = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/DataGis/wms',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: 'DataGis:camhoangdc_1',
            }
        })
    });
        var duong = new ol.layer.Image({
         source: new ol.source.ImageWMS({
             ratio: 1,
             url: 'http://localhost:8080/geoserver/DataGis/wms',
             params: {
                 'FORMAT': format,
                 'VERSION': '1.1.0',
                 STYLES: '',
                 LAYERS: 'DataGis:camhoanggt_1',
             }
         })
     });

    var projection = new ol.proj.Projection({
        code: 'EPSG:3405',
        units: 'm',
        axisOrientation: 'neu'
    });
    var view = new ol.View({
            projection: projection,
            center: center,
            zoom: zoom,
            rotation: rotation
        })
    var map = new ol.Map({
        target: 'map',
        layers: [vung,duong],
        overlays: [overlay],
        view: view
    });
    var styles = {
        'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 3
            })
        })
    };

    var styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
    };

    var vectorLayer = new ol.layer.Vector({
        style: styleFunction
    });
    map.addLayer(vectorLayer);

    map.getView().fit(toado, map.getSize());
    
    if (window.location.hash !== ''){
        var hash = window.location.hash.replace('#map=', '')
        var parts = hash.split('/')
        if (parts.length === 4){
            zoom = parseInt(parts[0], 10);
            center = [
                parseFloat(parts[1]),
                parseFloat(parts[2])
            ]
            rotation = parseFloat(parts[3])
        }
    }
    //B2.Battatcaclopbando
    $("#checkvung").change(function () {
        if ($("#checkvung").is(":checked")) {
            vung.setVisible(true)
        } else {
            vung.setVisible(false)
        }
    });

    $("#checkduong").change(function () {
        if ($("#checkduong").is(":checked")) {
            duong.setVisible(true)
        } else {
            duong.setVisible(false)
        }
    });
    //B3 lay thong tin
    map.on('singleclick', function (evt) {
        document.getElementById('info').innerHTML = "Loading... please wait...";
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = vung.get('visible') ? vung.getSource() : tiled.getSource();
        var url = source.getFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
        console.log(url)
        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf8",
                dataType: 'json',
                success: function (n) {
                    var content = "<table>";
                    for (var i = 0; i < n.features.length; i++) {
                        var feature = n.features[i];
                        var featureAttr = feature.properties;
                        content += "<tr><td>Chủ sử dụng: " + featureAttr["chusd"] + "</td></tr><tr><td>Diện tích: " + featureAttr["shape_area"] + "<td></tr>"
                    }
                    content += "</table>";
                    $("#popup-content").html(content);
                    overlay.setPosition(evt.coordinate);
                    var vectorSource = new ol.source.Vector({
                        features: (new ol.format.GeoJSON()).readFeatures(n)
                    }); 
                
                    vectorLayer.setSource(vectorSource);
                
                },
                error: function (error) {
                    alert(error);
                }
            })
        }
    });

    var updatePermalink = function(){
        if (!shouldUpdate){
            shouldUpdate = true;
            return;
        }
        var center = view.getCenter();
        var hash = '#map=' +
            view.getZoom() + '/' + 
            Math.round(center[0] * 100) / 100 + '/' +
            Math.round(center[1] * 100) / 100 + '/' +
            view.getRotation();
        var state = {
            zoom: view.getZoom(),
            center: view.getCenter(),
            rotation: view.getRotation()
        }
        window.history.pushState(state, 'map', hash)
    }
    map.on('moveend', updatePermalink)
    window.addEventListener('popstate', function(event) {
        if (event.state === null) {
            return
        }
        map.getView().setCenter(event.state.center);
        map.getView().setZoom(event.state.zoom);
        map.getView().setRotation(event.state.rotation);
        shouldUpdate = false;
    })
    function di_den_diem(x,y){
        var vi_tri = ol.proj.fromLonLat([x,y], projection);
        view.animate({
            center: vi_tri,
            duration: 2000,
            zoom: 20
        })
    }


