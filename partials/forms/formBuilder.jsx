const React = require('react');

var StdForm = require('alpha-client-lib/partials/forms/stdForm');
var StdTextField = require('alpha-client-lib/partials/forms/stdTextField');
var StdSelect = require('alpha-client-lib/partials/forms/stdSelect');

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const FormBuilder = React.createClass({
	contextTypes: {
        router: React.PropTypes.object.isRequired
  	},
	getInitialState:function(){
		// Ensure form has defaults
		var s = Object.assign(
			{
				data:{},
				error_msgs:{},
				constraints:{},
				sent:false,
			}, this.props.form);

		// Set default values
		var data = {};
		var fields = this.props.form.fields;
		for(var i = 0; i < fields.length; i++)
		{
			var defaultValue = fields[i].defaultValue;
			if(defaultValue && defaultValue.length != 0)
			{
				switch(defaultValue.type)
				{
					case "stateProperty":
						var prop_path = defaultValue.value;
						// Get appState value from prop_path string
						var _appState = Object.assign({}, appState);
						for (var j=0, prop_path=prop_path.split('.'), len=prop_path.length; j<len; j++){
					        _appState = _appState[prop_path[j]];
					    };
					    data[fields[i].name] = _appState;
						break;
					case "simple":
						data[fields[i].name] = defaultValue.value;
						break;
					case "clone":
						this.clones[fields[i].name] = defaultValue.value;
						break;
				}
			}
		}
		s.data = Object.assign(data, s.data);

		return s;
	},
	clones:{},
	render() {
		let _this = this;
		let s = this.state;
		let p = this.props;

		return(
			<StdForm
				id={"form_"+p.name}
				method="POST"
				action={s.action || p.location.pathname}
				state={s}
				updated={(_f)=>this.setState(_f)}
			>
				{p.topArea}
				{p.form.global_error_msg ? <div style={{color:"red"}}>{p.form.global_error_msg}</div> : null}
				{p.form.fields.map(function(v) {
					var component;
					switch(v.type)
					{
						case 'text':
							component = (
								<StdTextField
									key={v.name}
									name={v.name}
									floatingLabelText={v.label}
									fullWidth={true} 
									state={s}
							        updated={(_f)=>_this.setState(_f)}
								/>
							);
							break;
						case 'password':
							component = (
								<StdTextField
									key={v.name}
									name={v.name}
									floatingLabelText={v.label}
									fullWidth={true}
									type="password"
									state={s}
							        updated={(_f)=>_this.setState(_f)}
								/>
							);
							break;
						case 'textarea':
							component = (
								<StdTextField
									key={v.name}
									name={v.name}
									floatingLabelText={v.label}
									fullWidth={true}
									multiLine={true} 
									state={s}
							        updated={(_f)=>_this.setState(_f)}
								/>
							);
							break;
						case 'select':
							component = (
								<StdSelect
									key={v.name}
									name={v.name}
									floatingLabelText={v.label}
									fullWidth={true}
									state={s}
							        updated={(_f)=>_this.setState(_f)}
							        items={v.valueOptions}
								/>
							);
							break;
						case 'hidden':
						 	component = (
						 		<input
						 			key={v.name}
						 			type="hidden"
						 			name={v.name}
						 			value={_this.clones[v.name] ? s.data[_this.clones[v.name]] : s.data[v.name]}
					 			/>
							);
							break;
						case 'submit':
							var muiButton = "FlatButton";
							if(v.style && v.style.buttonType)
								muiButton = v.style.buttonType;
							switch(muiButton) {
								case "FlatButton":
									component = (
										<div key={v.name} style={Object.assign({textAlign:'center',margin:'20px 0 0'}, v.style ? v.style.style || {} : {})}>
											<FlatButton
												label={v.successLabel ? (s.success ? v.successLabel : v.label) : v.label}
											 	type="submit"
											 	name={v.name}
											 	disabled={s.success?true:false}
										 	/>
										</div>
									);
									break;
								case "RaisedButton":
									component = (
										<div key={v.name} style={Object.assign({textAlign:'center',margin:'20px 0 0'}, v.style ? v.style.style || {} : {})}>
											<RaisedButton
												primary={true}
												label={v.successLabel ? (s.success ? v.successLabel : v.label) : v.label}
											 	type="submit"
											 	name={v.name}
											 	disabled={s.success?true:false}
										 	/>
										</div>
									);
									break;
							}
							break;
					}
					return component;
				})}

		        <input key="hidden_form" type="hidden" name="form" value={p.name} />
			</StdForm>

		);
	}
});

module.exports = FormBuilder;