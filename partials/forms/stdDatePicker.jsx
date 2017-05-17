const React = require('react');

import DatePicker from 'material-ui/DatePicker';

var validate = require("validate.js");

require('date-util');

const StdDatePicker = React.createClass({
	onChange:function(date, field){
		var s = this.props.state;

	  	var _s = Object.assign({},s);
	  	_s.data[field] = date.getTime();

	  	// There is currently an error so validate onChange
	  	if(s.error_msgs[field]) 
  		{
  			// Only validate this field
  			var fieldVals = {};
			fieldVals[field] = date.getTime();
			var constraints = {};
			constraints[field] = s.constraints[field];
			var errors = validate(fieldVals, constraints);
			var _s = Object.assign({},s);
	  		_s.error_msgs = errors || {};
  		}

  		var updateNeighbour = this.props.updateNeighbour;
  		if(updateNeighbour)
  		{
  			if(updateNeighbour.value == "value")
  			{
	  			if(updateNeighbour.condition)
	  			{
	  				var conditionMet = false;
	  				if(updateNeighbour.condition == "greaterOrEqual" && date >= new Date(_s.data[updateNeighbour.field]))
	  				{	
	  					conditionMet = true;
				  		_s.data[updateNeighbour.field] = _s.data[field];
				  		if(updateNeighbour.add)
				  			_s.data[updateNeighbour.field] += (updateNeighbour.add * 1000 * 60 * 60 * 24) 
	  				}
	  				else if(updateNeighbour.condition == "lessOrEqual" && date <= new Date(_s.data[updateNeighbour.field]))
	  				{	
	  					conditionMet = true;
				  		_s.data[updateNeighbour.field] = _s.data[field];
				  		if(updateNeighbour.subtract)
				  			_s.data[updateNeighbour.field] -= (updateNeighbour.subtract * 1000 * 60 * 60 * 24) 
	  				}

	  				if(conditionMet)
						if(updateNeighbour.msg)
							emitter.emit(
								'info_msg', 
								updateNeighbour.msg
						 	);	  					
	  			}
  			}
  		}

	  	this.props.updated(_s);
	},
    commonDateFormat: function(d){
        return d.format('ddd, mmm dS yy')
    },
	render: function() {
		var s = this.props.state;
		var p = this.props;

		var mui_props = {
			name: "dummy"+p.name,
			id:p.id,
			mode:p.mode || 'landscape',
			formatDate:p.formatDate || this.commonDateFormat,
			style: p.style,
			minDate:p.minDate,
			floatingLabelText:p.floatingLabelText || "Date"
		};

		return (
			<span>
				<DatePicker
				  {...mui_props}
				  autoOk={true}
		          ref={p.name}
		          value={!s.data[p.name] ? new Date() : new Date(Number(s.data[p.name]))}
		          onChange={(e,date)=>this.onChange(date, p.name)}
		          errorText={s.error_msgs[p.name] ? s.error_msgs[p.name][0] : null}
				  data-ignored={true}
		        />
		        <input type="hidden" name={p.name} value={s.data[p.name]} />
	        </span>
				  
	);}
});

module.exports = StdDatePicker;