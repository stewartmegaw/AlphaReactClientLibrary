const React = require('react');

import TextField from 'material-ui/TextField';

var validate = require("validate.js");

const StdTextField = React.createClass({
	onChange:function(field){
		var s = this.props.state;

	  	var _s = Object.assign({},s);
	  	_s.data[field] = this.refs[field].getValue();

	  	// There is currently an error so validate onChange
	  	if(s.error_msgs[field]) 
  		{
  			// Only validate this field
  			var fieldVals = {};
			fieldVals[field] = this.refs[field].getValue().trim();
			var constraints = {};
			constraints[field] = s.constraints[field];
			var errors = validate(fieldVals, constraints);
	  		_s.error_msgs = errors || {};
  		}

	  	this.props.updated(_s);
	},
	render: function() {
		var s = this.props.state;
		var p = this.props;

		var mui_props = {
			name: p.name,
			fullWidth: p.fullWidth,
			floatingLabelText: p.floatingLabelText,
			type: p.type,
			multiLine:p.multiLine,
			id:p.id,
		};

		return (
			<TextField
			  {...mui_props}
	          ref={p.name}
	          value={s.data[p.name]}
	          onChange={this.onChange.bind(null,p.name)}
	          errorText={s.error_msgs[p.name] ? s.error_msgs[p.name][0] : null}
	        />
				  
	);}
});

module.exports = StdTextField;