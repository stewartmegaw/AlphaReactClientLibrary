const React = require('react');

if(!serverSide)
{   
	var mapsapi = require( 'google-maps-api' )(Config.maps_api_key, ['places']);
}


const param = require("jquery-param");
import AutoComplete from 'material-ui/AutoComplete';
var validate = require("validate.js");

const StdPlaceSuggest = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState:function() {
		var p = this.props;

		return {
			predictions:[],
			searchText: p.state && p.state.data ? (p.state.data[p.name] || "") : "",
		};
	},
	destination: {
			streetAddress:'',
			street_address : '',
			route:'',
			postalZip : '',
			country: '',
			locale:'',
			route:'',
			lat:'',
			lng:'',
	},
	prediction_ids:[],
	place_changed:function(v){
		var _this = this;

		if(this.props.nullOnChange)
        	this.placeUpdated(Object.assign({},this.destination));

        _this.setState({searchText:v}, function(){
        	// TODO - needs reimplemented
	        if(_this.props.saveFreeText)
    	    	_this.placeUpdated(Object.assign({},this.destination),v);
        });

		if(!v)
			return;


		mapsapi().then( function( maps ) {
			var service = new google.maps.places.AutocompleteService();
			service.getPlacePredictions({input: v, types: ['(cities)']}, function (place_array, status) {
				if (status != google.maps.places.PlacesServiceStatus.OK) {
					callback([]);
				}
				else {
					var predictions = [];
					_this.prediction_ids = []; // Used later get more data from result
					for (var i = 0; i < place_array.length; i++)
					{
						predictions.push(place_array[i].description);
						_this.prediction_ids.push({
							d:place_array[i].description,
							id:place_array[i].place_id
						});
					}
					_this.setState({predictions:predictions});
				}
			});
		});
	},
	place_selected:function(v, index) {
		var _this = this;

		var destination = Object.assign({},this.destination);

		function done() {
			
			if(destination.street_number || destination.street_address || destination.route)
			{
				destination.streetAddress = destination.street_number || '';
				if(destination.streetAddress && destination.street_address)
					destination.streetAddress += ' ';
			 	destination.streetAddress += destination.street_address;
			 	if(destination.streetAddress && destination.route)
			 		destination.streetAddress += ' ';
			 	destination.streetAddress += destination.route;
			}

			if(destination.locale && destination.locale == destination.country)
				destination.locale = '';

			_this.placeUpdated(destination, v);
		}

		function fail() {
			emitter.emit('info_msg',null);

			_this.placeUpdated(Object.assign({},_this.destination), v);
		}

		
        // 1) Get correct Place ID
		var place_id = null;
		for (var i = 0; i < this.prediction_ids.length; i++)
		{

			if(this.prediction_ids[i].d == v)
			{
				place_id = this.prediction_ids[i].id;
				break;
			}
        }

        // 2) get lat lng from Google api using place id
		if(!place_id)
		{
			if(index != -1) // This is passed by MUI if enter is pressed
				fail();
		}
		else
		{
			var service = new google.maps.places.PlacesService(document.getElementById("leftLogo"));
	        service.getDetails({placeId: place_id}, function (place, status) {
	            if (status == google.maps.places.PlacesServiceStatus.OK) {
	            	var pac = place.address_components;
	            	for(var i =0; i<pac.length; i++)
	            	{
	            		switch(pac[i].types[0])
	            		{
	            			case 'street_number':
	            				destination.street_number = pac[i].long_name;
	            				break;
	            			case 'street_address':
	            				destination.street_address = pac[i].long_name;
	            				break;
            				case 'route':
	            				destination.route = pac[i].long_name;
	            				break;
            				case 'locality':
            				case 'postal_town':
            					if(!destination.locale)
		            				destination.locale = pac[i].long_name;
	            				break;
            				case 'country':
	            				destination.country = pac[i].long_name;
	            				break;
            				case 'postal_code':
	            				destination.postalZip = pac[i].long_name;
	            				break;
	            		}	
		                destination.lat = place.geometry.location.lat();
		                destination.lng = place.geometry.location.lng();
	            	}
	                done();
	            }
	            else
	            {
	            	fail();
	            }
	        });
    	}
    	return false;
	},
	placeUpdated(place, searchText){
		var p = this.props;
		var _s = Object.assign({}, p.state || {});
		var _data = Object.assign({searchText:searchText||""}, _s.data || {}, place);
		_s.data = _data;

		if(this.getErrorMsg()) 
  		{
  			// Only validate appropriate fields
  			var fieldVals = {};
			var constraints = {};
			for(var i = 0; i < p.hiddenFields.length; i++) {
				var _fieldname = p.hiddenFields[i].name;
				fieldVals[_fieldname] = place[_fieldname];
				constraints[_fieldname] = _s.constraints[_fieldname];
			}
			var errors = validate(fieldVals, constraints);
	  		_s.error_msgs = errors || {};
  		}

  		if(p.updateLocationQuery)
  		{
  			var new_data = Object.assign({searchText:searchText||""},this.destination, place);
			var subset = (({country,lat,lng,locale,searchText}) => ({country,lat,lng,locale,searchText}))(new_data);
			var q = param(Object.assign({}, p.location.query, subset));
			this.context.router.replace(p.location.pathname+'?'+ q);
  		}

		this.props.updated(_s);
	},
	focus:function(){
		this.refs.autoComplete.focus();
	},
	getErrorMsg(){
		var p = this.props;
		var msg = "";
		if(p.state && p.state.error_msgs)
		{
			for(var i = 0; i < p.hiddenFields.length; i++) {
				var _field = p.hiddenFields[i];
				msg = p.state.error_msgs[_field.name] ? "Problem with " + p.name : "";
				if(msg != "")
					break;
			}
		}
		return msg;
	},
	getSearchText(){
		return this.state.searchText;
	},
	render:function() {
		var s = this.state;
		var p = this.props;
		var _this = this;

		var mui_props = {
			name: p.name,
			id:p.id,
			floatingLabelText:p.floatingLabelText,
			hintText:p.hintText,
			style:p.style || {},
			fullWidth: p.fullWidth || false,
			hintStyle: p.hintStyle || {},
			listStyle: p.listStyle || {},
			disableFocusRipple: p.disableFocusRipple || false,
			menuStyle: p.menuStyle || {},
			className: p.className,
			textFieldStyle: p.textFieldStyle || {},
		};


		function getErrorMsg() {
			return _this.getErrorMsg();
		}

		return (
			<span>
				<AutoComplete
					{...mui_props}
					ref="autoComplete"
					filter={AutoComplete.noFilter}
					dataSource={s.predictions}
					onUpdateInput={this.place_changed}
					onNewRequest={this.place_selected}
					searchText={s.searchText}
					errorText={getErrorMsg()}
					onKeyDown={(e)=>{
						if(e.keyCode == 13 && s.predictions.length)
						{
							_this.place_selected(s.predictions[0]);
							_this.setState({searchText:s.predictions[0]});
						}	
					}}
					data-ignored={true}
				/>
				{p.hiddenFields.map(function(_field) {
					return <input key={_field.name} type="hidden" name={_field.name} value={p.state &&  p.state.data ? p.state.data[_field.name] : ''} />
				})}
			</span>
		);
	}
});

module.exports = StdPlaceSuggest;