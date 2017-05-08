const React = require('react');

import Snackbar from 'material-ui/Snackbar';

const BottomPopupMessage = React.createClass({
	componentWillUnmount:function(){
		emitter.removeListener(
			'info_msg', 
			this.info_msg_listener
	 	);
	},
	componentDidMount: function() {
		emitter.on(
			'info_msg', 
			this.info_msg_listener
	 	);
	},
	info_msg_listener: function(m) {
		if (!m)
        	m = 'An unknown error occurred';
        if(m=='betaMessage')
        	m = 'This functionality is not available in during staging.';
		this.setState({snackbar_open:true,snackbar_msg:m});
	},
	getInitialState:function (){
		return {
			snackbar_open:false,
			snackbar_msg:"",
		}
	},
	snackClosed:function() {
		this.setState({snackbar_open:false,snackbar_msg:""});
	},
	snackHide:function() {
		this.setState({snackbar_open:false,snackbar_msg:""});
	},
	render() {
		return (
			<Snackbar
			  ref="snackbar"
	          open={this.state.snackbar_open}
	          message={this.state.snackbar_msg}
	     	      action="hide"
	          onActionTouchTap={this.snackHide}
	          onRequestClose={this.snackClosed}
	          bodyStyle={{height:'auto',lineHeight:'inherit',padding:'10px 24px 2px'}}
        	/>
    	);
	}
});

module.exports = BottomPopupMessage; 