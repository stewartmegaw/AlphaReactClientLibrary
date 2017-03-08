const React = require('react');

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

var validate = require("validate.js");

const StdSelect = React.createClass({
	onChange:function(event,index,value){
		var p = this.props;
		var s = p.state;

	  	var _s = Object.assign({},s);
	  	_s.data[p.name] = value;


	  	if(s.error_msgs[p.name]) 
  		{
  			// Only validate this field
  			var fieldVals = {};
			fieldVals[p.name] = value.trim();
			var constraints = {};
			constraints[p.name] = s.constraints[p.name];
			var errors = validate(fieldVals, constraints);
			var _s = Object.assign({},s);
	  		_s.error_msgs = errors || {};
  		}

	  	this.props.updated(_s);
	},
	render: function() {
		var p = this.props;
		var s = p.state;

		var mui_props = {
			name: p.name,
			fullWidth: p.fullWidth,
			floatingLabelText: p.floatingLabelText,
		};

		return (
			<span>
				<SelectField
					{...mui_props}
					value={s.data[p.name]}
					onChange={this.onChange}
					errorText={s.error_msgs[p.name] ? s.error_msgs[p.name][0] : null}
				>
					{Object.keys(p.items).map(function(k) {
						return <MenuItem value={k} primaryText={p.items[k]} key={k}/>
					})}
			    </SelectField>
			    <input type="hidden" name={p.name} ref={p.name} value={s.data[p.name]} />
		    </span>				  
	);}
});

module.exports = StdSelect;