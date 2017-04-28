// TODO this.prop.msgStyle=="popup" is not implemented yet
// because its not required yet!

const React = require('react');

var StdForm = require('alpha-client-lib/partials/forms/stdForm');

require('alpha-client-lib/style/global.gcss');

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
				requestType:''
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
					case "useQuery":
						var query_fieldname = defaultValue.field || fields[i].name;
						data[fields[i].name] = this.props.location.query[query_fieldname];
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
						if(!components.stdPlaceSuggest)
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
					case 'tagSuggest':
						if(!components.stdTagSuggest)
							require.ensure([], (require) => {
				                  components.stdTagSuggest = require('alpha-client-lib/partials/forms/stdTagSuggest');
				                  _this.setState({components:components});
				            });
						break;
					case 'codeMirror':
						if(!components.stdCodeMirror)
							require.ensure([], (require) => {
				                  components.stdCodeMirror = require('alpha-client-lib/partials/forms/stdCodeMirror');
													_this.setState({components:components});
				            });
						break;
					case 'button':
					case 'submit':
						if(!components.stdButton)
							require.ensure([], (require) => {
				                  components.stdButton = require('alpha-client-lib/partials/forms/stdButton');
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
				formName={p.name}
				method="POST"
				action={s.action || p.location.pathname}
				state={s}
				updated={(_f)=>this.setState(_f)}
				style={p.style}
				msgStyle={p.msgStyle}
			>
				{p.msgStyle!='popup' && s.global_error_msg ? <div style={{color:"red"}}>{s.global_error_msg}</div> : null}
				{p.msgStyle!='popup' && s.success_msg ? <div style={p.successMsgStyle || {}}>{s.success_msg}</div> : null}
				{p.form.fields.map(function(field) {
					var component;
					var options = Object.assign({},field.options);
					var style = Object.assign({},field.style);
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
										floatingLabelStyle={style.floatingLabelStyle}
										inputStyle={style.inputStyle}
										fullWidth={true}
										below={style.below}
										className={style.class}
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
										floatingLabelStyle={style.floatingLabelStyle}
										inputStyle={style.inputStyle}
										fullWidth={true}
										below={style.below}
										className={style.class}
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
										floatingLabelStyle={style.floatingLabelStyle}
										textareaStyle={style.textareaStyle}
										fullWidth={true}
										multiLine={true}
										below={style.below}
										className={style.class}
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
								if(options.minDate)
								{
									if(options.minDate.value.indexOf('now') != -1)
									{
										minDate = new Date();
										minDate.setHours(0,0,0,0); // No time
										minDate = minDate.getTime();
										if(options.minDate.add)
											minDate += (options.minDate.add * 1000 * 60 * 60 * 24);
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
								        style={style.style || {}}
								        updateNeighbour={options ? options.updateNeighbour : null}
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
										autoWidth={style.autoWidth === 1 ? true : false}
										fullWidth={style.fullWidth === 1 ? true : false}
										state={s}
								        updated={(_f)=>_this.setState(_f)}
								        items={field.valueOptions}
								        style={style.style || {}}
								        valueToString={options && options.valueCast == 'string'}
									/>
								);
							}
							break;
						case 'placeSuggest':
							if(s.components.stdPlaceSuggest)
							{
								// Check for linked fields
								var hiddenFields = [];
								p.form.fields.map(function(_field) {
									if(_field.options && _field.options.linkedTo == field.name)
										hiddenFields.push(_field);
								});
								component = (
									<s.components.stdPlaceSuggest
					                    id={p.name + field.name}
										key={field.name}
										name={field.name}
						                floatingLabelText={field.label}
						                hintText={options.hintText ? options.hintText : null}
						                nullOnChange={true}
						                style={style.style || {}}
						                fullWidth={style === 1 ? true : false}
						                hiddenFields={hiddenFields}
						                state={s}
								        updated={(_f)=>_this.setState(_f)}
								        updateLocationQuery={true}
								        location={p.location}
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
										style={style.style || {}}
										label={field.label}
						            />
								);
							}
							break;
						case 'tagSuggest':
							if(s.components.stdTagSuggest)
							{
								component = (
									<s.components.stdTagSuggest
					                    id={p.name + field.name}
										key={field.name}
										name={field.name}
										hintText={field.label}
										hintTextStyle={options.hintTextStyle ? options.hintTextStyle : null}
										unique={true}
										headerText={options.headerText ? options.headerText : null}
										state={s}
										updated={(_f)=>_this.setState(_f)}
						            />
								);
							}
							break;
						case 'codeMirror':
								if(s.components.stdCodeMirror)
								{
									component = (
										<s.components.stdCodeMirror
											label={field.label}
											name={field.name}
											state={s}
											updated={(_f)=>_this.setState(_f)}
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
						case 'button':
							if(s.components.stdButton)
							{
								component = (
									<s.components.stdButton
										id={p.name + field.name}
										key={field.name}
									 	name={field.name}
										muiButton={style.buttonType ? style.buttonType : "FlatButton"}
										label={options.successLabel ? (s.success ? options.successLabel : field.label) : field.label}
									 	type="submit"
									 	disabled={s.success?true:false}
									 	style={style.style || {}}
										primary={true}
										headerText={options.headerText ? options.headerText : null}
										hoverColor={style.hoverColor}
										backgroundColor={style.backgroundColor}
									/>
								);
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
