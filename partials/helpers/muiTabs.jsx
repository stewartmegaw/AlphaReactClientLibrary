const React = require('react');

import {Tabs, Tab} from 'material-ui/Tabs';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const MuiTabs = React.createClass({
	getInitialState:function(){
		return {
			tab:this.props.tab
		};
	},
	muiTheme:null,
	componentWillMount:function(){
		this.muiTheme = getMuiTheme(Object.assign({},this.props.muiThemeOptions || {}, serverSide ? {userAgent:userAgent} : {}));
	},
	change(v){
		var p = this.props;
		this.setState({tab:v});
		for(var i =0; i<p.tabs.length; i++)
		{
			if(p.tabs[i].value == v)
			{
				window.location = p.tabs[i].route;
				break		
			}
		}
	},
	render: function() {
		var s = this.state;
		return (
			<MuiThemeProvider muiTheme={this.muiTheme}>
				<div style={{width: "100%"}}>
					<Tabs value={s.tab} onChange={this.change}>
						{this.props.tabs.map(function(tab,i){
							return (<Tab key={i} label={tab.value} value={tab.value} />)
						})}
					</Tabs>
				</div>
			</MuiThemeProvider>
		);
	}
});

module.exports = MuiTabs;