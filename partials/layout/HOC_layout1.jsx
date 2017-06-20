const React = require('react');
/*
Some nice info on the difference between layoutExtended & layoutWrapper
https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.t3r6zwj02
*/

const AppState = require('alpha-client-lib/lib/appState');
const PopupMessage = require('alpha-client-lib/partials/helpers/bottomPopupMessage');
const param = require("jquery-param");

if(!serverSide)
{     
	require('script-loader!event-pubsub/event-pubsub-browser.js');
	window.emitter = new window.EventPubSub();
}

/*
Move this and the render code to a reusable alpha-client-lib module
*/
var uaTests = AppState.getProp('config.browserDetect',[]);
var uaTestFails = [];
if(uaTests.length)
{
	var uaParser = require('ua-parser-js');
	var ua;
	if(!serverSide)
		ua = new uaParser();
	else
		ua = new uaParser(userAgent);
	ua = ua.getResult();


	for(var i = 0; i< uaTests.length; i++)
	{
		var testSet = uaTests[i];
		var passed = true;
		dance:
		for(var j=0; j< testSet.tests.length; j++)
		{
			var test = testSet.tests[j];
			switch(test.type){
				case "lessThan":
					if(!test.browser || test.browser.name == ua.browser.name)
						if(!test.os || test.os.name == ua.os.name)
							if(ua.browser.major && Number(ua.browser.major) < Number(test.version))
							{
								passed = false;
								break dance;
							}
					break;
				case "*":
					if((!test.browser || test.browser.name == ua.browser.name))
					{
						if(!test.os || (test.os.name == ua.os.name))
						{	
							passed = false;
							break dance;
						}
					}
					break;
			}
		}

		if(!passed)
			uaTestFails.push(testSet.msg);
	}
}


/*
HOC Type 1: Props Proxy
Use this to:
1) Wrap the child in components
2) Manipulate the props
3) Abstract the state
*/
const HOC_PP_layout1 = function(WrappedComponent) {
	var Wrapped = class extends React.Component {
		constructor(props) {
			super(props);
		}
		render() {
			var s = this.state;

			return (
				<div>
					{uaTestFails.length ?
						<div className={[Colors.blueBg,'browserSupport'].join(' ')}>
							<div>Weestay sad face :(</div>
							<ul>
								{uaTestFails.map((msg,i)=>{
									return <li key={i} dangerouslySetInnerHTML={{__html:msg}}/>
								})}
								<li>For the best experience please switch to the latest <a style={{color:"white"}} href="https://www.google.com/chrome/browser" target="_blank">Google Chrome</a> (except iOS)</li>
							</ul>
						</div>
					:null}
					<WrappedComponent {...this.props} />
				</div>
			);
		}
	};

	return Wrapped;
}

/*
HOC Type 2: Inheritance Inversion
Use this to:
1) Override methods of the child
2) Render hijacking
3) Set state
*/
const HOC_II_layout1 = function(layout) {
	return HOC_PP_layout1(class extends layout {
		componentDidMount() {
			if(super.componentDidMount)
				super.componentDidMount();

			this.check_message();
		}

		getContent() {
			var p = this.props;
			// Show exception unless its 404
            if(AppState.getProp('exception') && !(p.routes.length == 2 && p.routes[1].notFound404))
            	return (
	                  <div>
	                  {AppState.getProp('exception') === true ?
	                        <div style={{padding:'50px 20px',textAlign:'center'}}><h1>Oh no, something went wrong!</h1><h3>We know about the problem and are working to fix it.</h3><h3>Please accept our apologies and check back again soon.</h3></div>
	                  :
	                        <div dangerouslySetInnerHTML={{__html:AppState.getProp('exception')}} />
	                  }
	                  </div>
                  );
            else
	            return p.children;
		}

		getPopupMessage(){
			return <PopupMessage/>
		}

		check_message(){
		    var msg = appState.msg;
		    if(!msg)
		    {
		          var l = this.props.location;
		          msg = l.query.msg
		          if(msg)
		                this.context.router.replace(l.pathname+'?'+ param(Object.assign({},l.query,{msg:''})));
		    }

		    if (msg)
		        emitter.emit('info_msg', msg);
		}

		render() {
			return super.render();
		}
	})
}

module.exports = HOC_II_layout1;