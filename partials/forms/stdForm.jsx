const React = require('react');

var validate = require("validate.js");

import 'whatwg-fetch';

import intersect from 'boundless-utils-object-intersection';

var style = require('alpha-client-lib/style/form.css');

const StdForm = React.createClass({
	validate:function(e){
		var _this = this;
		var s = this.props.state;

		var form = document.querySelector('form#'+this.props.id);

		var errors = validate(validate.collectFormValues(form, {trim:true}), s.constraints);

		// TODO Hack to validate tag count until https://github.com/ansman/validate.js/pull/184 implemented
		if(this.props.id == 'form_tripCreateNew' || this.props.id == 'form_tripCreateDraft')
		{
			var tags = document.getElementById(this.props.id).elements["tags[]"];
			if(!tags || !tags.length || tags.length < 3)
			{
				if(!errors)
					errors = {};
				errors.tags = ['Select 3 tags'];
			}
		}
		// End of Hack

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
			// Temporarily setting the form.success = true is a quick way to disable any buttons
			this.props.updated(Object.assign({},s,{success:1}));
			e.preventDefault();

			fetch(s.action, {
				headers: {
	                'X-Requested-With': 'XMLHttpRequest'
				},
				method:'POST',
				body: formData,
		        credentials: 'include',
			}).then(function(response) {
				if(response.ok)
					return response.json();
				else
					throw new Error('Network response error');
			}).then(function(r) {
				console.log(r);
				if(r.redirect302)
					window.location = r.redirect302;
				else
	            	_this.props.updated(Object.assign({},s,r.form));
			}).catch(function(err) {
				// TODO handle this error better
				_this.props.updated(Object.assign({},s,{success:0}));
				console.log(err);
			});
		}
	},
	componentWillReceiveProps(nextProps){
		if(nextProps.state.componentsLoaded && ! this.props.state.componentsLoaded)
			this.componentsLoaded();
	},
	componentsLoaded(){
		// Validate any non-empty field immediately
		// Useful if the user is editing a form for example - they
		// will want to see error msgs immediately on page load
		var s = this.props.state;
		var form = document.querySelector('form#'+this.props.id);

		var data = validate.collectFormValues(form, {trim:true});
		var constraints = Object.assign({},s.constraints);

		// Remove non empty fields
		for (var field in data) {
			if (data[field] === null || data[field] === undefined || data[field] === '') {
				delete data[field];
			}
		}
		// Now remove constraints not in data
		constraints = intersect(constraints, data);

		var errors = validate(data, constraints);

		if(errors)
		{
			var _s = Object.assign({}, s);
      		_s.error_msgs = errors;
      		this.props.updated(_s);
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

		if(p.file)
			form_props.encType = "multipart/form-data";

		return (
			<form
				{...form_props}
				onSubmit={this.validate}
				className={style.form}
			>
				{p.children}
			</form>
	);}
});

module.exports = StdForm;
