const React = require('react');

var validate = require("validate.js");

const StdForm = React.createClass({
	validate:function(e){
		var s = this.props.state;

		var form = document.querySelector('form#'+this.props.id);

		var errors = validate(validate.collectFormValues(form, {trim:true}), s.constraints);
		
		if(errors)
		{
			var _s = Object.assign({},s);
      		_s.error_msgs = errors;
      		this.props.updated(_s);
      		e.preventDefault();
		}
	},
	render: function() {
		var p = this.props;

		var form_props = {
			id:p.id,
			method:p.method,
			action:p.action
		};

		return (
			<form
				{...form_props}
				onSubmit={this.validate}
			>
				{p.children}
			</form>
	);}
});

module.exports = StdForm;