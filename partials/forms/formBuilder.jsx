const React = require('react');

var StdForm = require('alpha-client-lib/partials/forms/stdForm');
var StdTextField = require('alpha-client-lib/partials/forms/stdTextField');
var StdSelect = require('alpha-client-lib/partials/forms/stdSelect');

import FlatButton from 'material-ui/FlatButton';

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
				}
			}
		}
		s.data = Object.assign(data, s.data);

		return s;
	},
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
						 			value={s.data[v.name]}
					 			/>
							);
							break;
						case 'submit':
							component = (
								<div key={v.name} style={{textAlign:'center',margin:'20px 0 0'}}>
									<FlatButton
										label={v.successLabel ? (s.success ? v.successLabel : v.label) : v.label}
									 	type="submit"
									 	name={v.name}
									 	disabled={s.success?true:false}
								 	/>
								</div>
							);
							break;
					}
					return component;
				})}

		        <input type="hidden" name="form" value={p.name} />
			</StdForm>

		);
	}
});

module.exports = FormBuilder;