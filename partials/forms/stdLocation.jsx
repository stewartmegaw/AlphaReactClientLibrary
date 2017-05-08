const React = require('react');

var validate = require("validate.js");
var StdTextField = require('./stdTextField');

const StdLocation = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        var s = this.state;
        var p = this.props;
        var _this = this;

        var plain_map_styles = [
                {"featureType": "administrative.country","elementType": "labels.text", "stylers": [{"visibility": "off"}]},
                {"featureType": "water", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
                {"featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]},
                {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#c3d7ec"}]},
                {"featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{"color": "#efebe2"}]},
                {"featureType": "road", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "landscape", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "administrative.province", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "administrative.neighborhood", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]},
                {"featureType": "road", "stylers": [{"visibility": "off"}]},
                {"featureType": "transit", "stylers": [{"visibility": "off"}]}
            ];

            var country_map_styles = [
                {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "off"}]},
                {"featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"}]},
                {"featureType": "administrative"}, {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#c3d7ec"}]},
                {"featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{"color": "#efebe2"}]},
                {"featureType": "road", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "landscape", "elementType": "labels.text.fill", "stylers": [{"color": "#7f6c54"}]},
                {"featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "administrative.province", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
                {"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#808080"}]},
                {"featureType": "road", "stylers": [{"visibility": "off"}]},
                {"featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}
            ];


            var googleMap = new google.maps.Map((_this.refs.map), {
                zoom: 1,
                minZoom: 4,
                center: new google.maps.LatLng(51.5283063, -0.2571552),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: country_map_styles,
                disableDefaultUI: true,
                zoomControl: true
            });

            var searchInput = this.refs.locationSearchBox;
            var searchBox = new google.maps.places.SearchBox(searchInput);
            googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                if (places.length === 0) {
                    return;
                }

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                googleMap.fitBounds(bounds);
            });
    },

    render: function() {
        var p = this.props;
        return (
                <span>
                    <p style={{marginBottom:2}}>{p.label}</p>
                    <div ref="map" id="map" style={{'minHeight':'300px','marginBottom':'0'}}></div>
                    <input
                        id="pac-input"
                        name="something-location"
                        placeholder="Search Location"
                        className="controls"
                        ref="locationSearchBox"
                        type="text"
                        value={'Islamabad, Pakistan'}
                        onChange={()=>{}}
                        />
                    <StdTextField />
                    <StdTextField />
                </span>
        )
    }
});

module.exports = StdLocation;
