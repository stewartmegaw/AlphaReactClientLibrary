const React = require('react');

const ManualForm = React.createClass({
	render: function() {
		var p = this.props;

		var form_props = {
			method:p.method || 'POST',
			action:p.action,
			style:p.style|| {padding:0,margin:0},
			className:p.className
		};

		return (
			<form
				{...form_props}
				ref="form"
				onClick={this.props.submitOnClick ? ()=>this.refs.form.submit() : null}
				onSubmit={this.props.onSubmit || null}
			>
				{p.children}
				<input type="hidden" name="formNameUniqueIdentifier" value={p.formName}/>
			</form>
	);}
});

module.exports = ManualForm;
