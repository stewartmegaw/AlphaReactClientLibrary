var React = require('react');

const AppState = require('alpha-client-lib/lib/appState');

var NotFound404 = React.createClass({
    render: function() {
        return (
            <div style={{margin:'50px 0',textAlign:'center'}}>
                <div dangerouslySetInnerHTML={{__html:AppState.getProp('exception')}}/>
            </div>
        );
    }

});

module.exports = NotFound404;
