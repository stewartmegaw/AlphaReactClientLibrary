const React = require('react');

if(!serverSide)
{   
	var mapsapi = require( 'google-maps-api' )(Config.maps_api_key, ['places']);
}

import AutoComplete from 'material-ui/AutoComplete';


const StdPlaceSuggest = React.createClass({
	getInitialState:function() {
		return {
			predictions:[],
			dest_empty: 0,
			invalid_dest: 0,
		};
	},
	componentDidMount:function(){
		this.init(this.props.place, this.props.field);
	},
	init:function(place, field) {
		if(place)
		{
			var s = {};
			if(!field && Locations.is_valid(place))
				s["inputVal"] = Locations.get_destination(place);

			this.setState(Object.assign({},this.state,place,s));
		}
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
			lng:''
	},
	prediction_ids:[],
	place_changed:function(v){
		var _this = this;

		if(this.props.nullOnChange && this.props.placeUpdated)
        {
        	this.setState(Object.assign({},this.state,this.destination));
        	this.props.placeUpdated(false);
        }

		var new_state = {};
		new_state[this.props.field || "inputVal"] = v;
        _this.setState(new_state, function(){
	        if(_this.props.saveFreeText && _this.props.placeUpdated)
    	    	_this.props.placeUpdated(_this.state);
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
		emitter.emit('info_msg','betaMessage');
		return;
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

			var s = Object.assign({}, _this.state, destination, {dest_empty:0, invalid_dest:0});
			
			if(Locations.is_valid(s))
			{
				_this.setState(s);
				if(_this.props.placeUpdated)
					_this.props.placeUpdated(s);
			}
			else
				fail();
		}

		function fail() {
			_this.setState({invalid_dest:1, lat:null, lng:null});
			emitter.emit('info_msg',null);

			if(_this.props.placeUpdated)
				_this.props.placeUpdated(false);
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
		                destination.lng =  place.geometry.location.lng();
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
	checkValid: function(){
		var s = this.state;

		if(!Locations.is_valid(s))
		{
			if(!s.invalid_dest)
				this.setState({dest_empty:1});
			return false;
		}

		return true;
	},
	reset:function(){
		var s = {
			inputVal: ""
		};

		this.setState(Object.assign({},this.state,s));
	},
	focus:function(){
		this.refs.autoComplete.focus();
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

		return (
			<AutoComplete
				{...mui_props}
				ref="autoComplete"
				filter={AutoComplete.noFilter}
				dataSource={s.predictions}
				onUpdateInput={this.place_changed} 
				onNewRequest={this.place_selected}
				searchText={s[p.field || "inputVal"] || ""}
				errorText={s.dest_empty || s.invalid_dest ? (s.invalid_dest ? (p.coord_problem || "Problem getting location") : (p.empty_problem || "Select location")) : ""}
				onKeyDown={(e)=>{
					if(e.keyCode == 13 && s.predictions.length)
					{
						_this.place_selected(s.predictions[0]);
						var new_state = {};
						new_state[p.field || "inputVal"] = s.predictions[0];
						_this.setState(new_state);
					}	
				}}
			/>
		);
	}
});

module.exports = StdPlaceSuggest;