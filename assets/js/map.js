var map;

function unproject(coord) {
    return map.unproject(coord, map.getMaxZoom());
}

function onMapClick(e) {
    console.log("You clicked the map at " + map.project(e.latlng));
}

$(function () {
    "use strict";
    
    var southWest, northEast;
    
    map = L.map("map", {
        minZoom: 0,
        maxZoom: 7,
        crs: L.CRS.Simple
    }).setView([0, 0], 0);
    
    southWest = unproject([0, 32768]);
    northEast = unproject([32768, 0]);
    
    map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

    L.tileLayer("https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg", {
        minZoom: 0,
        maxZoom: 7,
        continuousWorld: true
    }).addTo(map);

    map.on("click", onMapClick);

    $.getJSON("https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1", function (data) {
        var region, gameMap, i, il, poi;
        
        for (region in data.regions) {
            region = data.regions[region];
            
            for (gameMap in region.maps) {
                gameMap = region.maps[gameMap];
                
                for (i = 0, il = gameMap.points_of_interest.length; i < il; i++) {
                    poi = gameMap.points_of_interest[i];
                    
                    if (poi.type != "waypoint") {
                        continue;
                    }

                    L.marker(unproject(poi.coord), {
                        title: poi.name
                    }).addTo(map);
                }
            }
        }
    });
});