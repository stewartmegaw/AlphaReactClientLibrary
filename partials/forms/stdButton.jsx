const React = require('react');

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const StdButton = React.createClass({
	render: function() {
		var s = this.props.state;
		var p = this.props;
		var _s = this.state;

		var mui_props = {
			id:p.id,
			label: p.label,
			type: p.type,
			disabled:p.disabled,
			hoverColor:p.hoverColor,
			backgroundColor:p.backgroundColor,
		};

		return (
			<div style={Object.assign({textAlign:'center',margin:'20px 0 0'}, p.style|| {})}>
				{p.headerText ? <div style={{marginBottom:8}}>{p.headerText}</div> : null}
				{p.muiButton == 'FlatButton' ?
					<FlatButton
						{...mui_props}
					/>
			 	:
			 		<RaisedButton
			 			{...mui_props}
			 			primary={p.primary || false}
		 			/>
			 	}
			 	{p.disabled ? null :
				 	<input type="hidden" name={p.name} value="1"/>
				}
			</div>
				  
	);}
});

module.exports = StdButton;