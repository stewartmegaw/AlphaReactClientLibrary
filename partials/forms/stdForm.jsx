const React = require('react');

var validate = require("validate.js");

import 'whatwg-fetch';

const StdForm = React.createClass({
	validate:function(e){
		var _this = this;
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

		if(!errors && s.requestType == 'json')
		{
			var formData = new FormData(form);
			// Temporarily setting the form.success = true is a quite way to disable any buttons
			this.props.updated(Object.assign({},s,{success:1}));
			e.preventDefault();	

			fetch(s.action, {method:'POST', body: formData}).then(function(response) {
				if(response.ok)
					return response.json();
				else
					throw new Error('Network response error');
			}).then(function(r) {
				console.log(r);
            	_this.props.updated(Object.assign({},s,r.routes[_this.props.formName].form));
			}).catch(function(err) {
				// TODO handle this error better
				_this.props.updated(Object.assign({},s,{success:0}));
				console.log(err);
			});
		}
	},
	render: function() {
		var p = this.props;

		var form_props = {
			id:p.id,
			method:p.method,
			action:p.action,
			style:p.style || {},
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