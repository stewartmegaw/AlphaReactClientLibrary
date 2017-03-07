/*
Takes an array of nested objects and arrays and returns either:
Nested html list

Example input array (passed via props.listArray)
Array[3]
	0 : Object
		id : 1
		title: "Level 1"
		routeLabel : "level1"
	1 : Array[3]
		0 : Object
			id : 2
			title: "Level 2"
			routeLabel : "level2"
		1 : Array[1]
			0 : Object
				id : 5
				title: "Level 3"
				routeLabel : "level3"
		2 : Object
			id : 4
			title: "Level 2"
			routeLabel : "level2"
	2 : Object
		id : 3
		title: "Level 1"
		routeLabel : "level1"

Note:
- Each Object needs a unqiue id
- title and routeLabel properties are required

*/

const React = require('react');

const {Link} = require('react-router');

const List = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	get_list_item: function(listArray, routeLabels) {
		var _this = this;

		var items = [];

		if(!routeLabels)
			routeLabels = [];


		for(var j = 0; j < listArray.length; j++)
		{
			if(listArray[j].constructor !== Array)
			{
				(function(){

					var newRouteLabels = routeLabels.slice(0);					
					newRouteLabels.push(listArray[j].routeLabel);


					items.push(
						<li key={listArray[j].id} style={_this.props.itemStyle}>
							<Link
								to={'/help/'+newRouteLabels.join('/')}
								style={_this.props.linkStyle}
								activeStyle={_this.props.activeLinkStyle}
								onClick={(e)=>{
									window.location = '/help/'+newRouteLabels.join('/');
									e.stopPropagation();
								}}
							>
								{listArray[j].title}
							</Link>

							{listArray.length > j + 1 && listArray[j+1].constructor === Array ?
								<ul style={_this.props.listStyle}>
									{_this.get_list_item(listArray[j+1], newRouteLabels)}
								</ul>
							:null}
						</li>
					);

				})();
			}
		}

		return items;
	},
    render() {

		return (
			<ul style={Object.assign({}, this.props.listStyle || {}, this.props.outerListStyle || {})}>
				{this.get_list_item(this.props.listArray)}
			</ul>
		);
	}
});

module.exports = List;