const React = require('react');

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

var StdForm = require('alpha-client-lib/partials/forms/stdForm');

const FormBuilder = React.createClass({
	contextTypes: {
        router: React.PropTypes.object.isRequired
  	},
	getInitialState:function(){
		// Ensure form has defaults
		var s = Object.assign(
			{
				components:{},
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
					case "date":
						if(defaultValue.value.indexOf('now') != -1)
						{	
							var d = new Date();
							d.setHours(0,0,0,0); // No time
							data[fields[i].name] = d.getTime();
							if(defaultValue.add)
								data[fields[i].name] += (defaultValue.add * 1000 * 60 * 60 * 24);
						}
						else
							data[fields[i].name] = defaultValue.value;
						break;
				}
			}
		}
		s.data = Object.assign(data, s.data);

		return s;
	},
	componentDidMount(){
		// Get the components async or we will have a lot of used code
		if(!serverSide)
		{
			var _this = this;
			var s = this.state;
			var components = s.components;

			this.props.form.fields.map(function(field) {
				switch(field.type)
				{
					case 'text':
					case 'password':
					case 'textarea':
						if(!components.stdTextField)
							require.ensure([], (require) => {
				                  components.stdTextField = require('alpha-client-lib/partials/forms/stdTextField');
				                  _this.setState({components:components});
				            });
						break;
					case 'select':
						if(!components.stdSelect)
							require.ensure([], (require) => {
				                  components.stdSelect = require('alpha-client-lib/partials/forms/stdSelect');
				                  _this.setState({components:components});
				            });
						break;
					case 'date':
						if(!components.stdDatePicker)
							require.ensure([], (require) => {
				                  components.stdDatePicker = require('alpha-client-lib/partials/forms/stdDatePicker');
				                  _this.setState({components:components});
				            });
						break;
					case 'placeSuggest':
						if(!components.stdDatePicker)
							require.ensure([], (require) => {
				                  components.stdPlaceSuggest = require('alpha-client-lib/partials/forms/stdPlaceSuggest');
				                  _this.setState({components:components});
				            });
						break;
					case 'videoCapture':
						if(!components.stdVideoCapture)
							require.ensure([], (require) => {
				                  components.stdVideoCapture = require('alpha-client-lib/partials/forms/stdVideoCapture');
				                  _this.setState({components:components});
				            });
						break;

				}
			});
		}
	},
	clones:{},
	render() {
		let _this = this;
		let s = this.state;
		let p = this.props;

		// Most of the MUI components in switch need an id passed so that server
		// rendering is reusable

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
				{p.form.fields.map(function(field) {
					var component;
					switch(field.type)
					{
						case 'text':
							if(s.components.stdTextField)
							{	
								component = (
									<s.components.stdTextField
										id={p.name + field.name} 
										key={field.name}
										name={field.name}
										floatingLabelText={field.label}
										fullWidth={true} 
										state={s}
								        updated={(_f)=>_this.setState(_f)}
									/>
								);
							}
							break;
						case 'password':
							if(s.components.stdTextField)
							{
								component = (
									<s.components.stdTextField
										id={p.name + field.name} 
										key={field.name}
										name={field.name}
										floatingLabelText={field.label}
										fullWidth={true}
										type="password"
										state={s}
								        updated={(_f)=>_this.setState(_f)}
									/>
								);
							}
							break;
						case 'textarea':
							if(s.components.stdTextField)
							{
								component = (
									<s.components.stdTextField
										id={p.name + field.name} 
										key={field.name}
										name={field.name}
										floatingLabelText={field.label}
										fullWidth={true}
										multiLine={true} 
										state={s}
								        updated={(_f)=>_this.setState(_f)}
									/>
								);
							}
							break;
						case 'date':
							if(s.components.stdDatePicker)
							{
								var minDate = null;
								if(field.options && field.options.minDate)
								{
									if(field.options.minDate.value.indexOf('now') != -1)
									{
										minDate = new Date();
										minDate.setHours(0,0,0,0); // No time
										minDate = minDate.getTime();
										if(field.options.minDate.add)
											minDate += (field.options.minDate.add * 1000 * 60 * 60 * 24);
										minDate = new Date(minDate);
									}
								}

								component = (
									<s.components.stdDatePicker
										id={p.name + field.name} 
										key={field.name}
										name={field.name}
										hintText={field.label}
										state={s}
								        updated={(_f)=>_this.setState(_f)}
								        style={field.style ? (field.style.style || {}) : {}}
								        updateNeighbour={field.options ? field.options.updateNeighbour : null}
								        minDate={minDate}
									/>
								);
							}
							break;
						case 'select':
							if(s.components.stdSelect)
							{
								component = (
									<s.components.stdSelect
										id={p.name + field.name} 
										key={field.name}
										name={field.name}
										floatingLabelText={field.label}
										autoWidth={field.style && field.style.autoWidth === 1 ? true : false}
										fullWidth={field.style && field.style.fullWidth === 1 ? true : false}
										state={s}
								        updated={(_f)=>_this.setState(_f)}
								        items={field.valueOptions}
								        style={field.style ? (field.style.style || {}) : {}}
									/>
								);
							}
							break;
						case 'placeSuggest':
							if(s.components.stdPlaceSuggest)
							{
								component = (
									<s.components.stdPlaceSuggest
					                    id={p.name + field.name} 
										key={field.name}
										name={field.name}
						                floatingLabelText={field.label}
						                hintText={field.options && field.options.hintText ? field.options.hintText : null}
						                nullOnChange={true}
						                style={field.style ? (field.style.style || {}) : {}}
						                fullWidth={field.style && field.style === 1 ? true : false}
						            />
								);
							}
							break;
						case 'videoCapture':
							if(s.components.stdVideoCapture)
							{
								component = (
									<s.components.stdVideoCapture
					                    id={p.name + field.name} 
										key={field.name}
										name={field.name}
										style={field.style ? (field.style.style || {}) : {}}
										label={field.label}
						            />
								);
							}
							break;
						case 'hidden':
						 	component = (
						 		<input
						 			key={field.name}
						 			type="hidden"
						 			name={field.name}
						 			value={_this.clones[field.name] ? s.data[_this.clones[field.name]] : s.data[field.name]}
					 			/>
							);
							break;
						case 'submit':
							var muiButton = "FlatButton";
							if(field.style && field.style.buttonType)
								muiButton = field.style.buttonType;
							switch(muiButton) {
								case "FlatButton":
									component = (
										<div key={field.name} style={Object.assign({textAlign:'center',margin:'20px 0 0'}, field.style ? field.style.style || {} : {})}>
											<FlatButton
												label={field.successLabel ? (s.success ? field.successLabel : field.label) : field.label}
											 	type="submit"
											 	name={field.name}
											 	disabled={s.success?true:false}
										 	/>
										</div>
									);
									break;
								case "RaisedButton":
									component = (
										<div key={field.name} style={Object.assign({textAlign:'center',margin:'20px 0 0'}, field.style ? field.style.style || {} : {})}>
											<RaisedButton
												primary={true}
												label={field.successLabel ? (s.success ? field.successLabel : field.label) : field.label}
											 	type="submit"
											 	name={field.name}
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