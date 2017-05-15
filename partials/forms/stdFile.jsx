const React = require('react');

var validate = require("validate.js");

const StdFile = React.createClass({
	getInitialState:function() {
		return {
			previousFilename: this.props.state.data[this.props.name]
		}
	},
	render: function() {
		var s = this.props.state;
		var p = this.props;
        var _this = this;
        var _s = this.state;

		return (
			<div style={{margin:'15px 0'}}>
                <p style={{marginBottom:2}}>
                	{p.label}
                	{_s.previousFilename ? <span><br/>Previously uploaded: <b>{_s.previousFilename.split('/').pop()}</b></span> : null}
            	</p>
				<input name={p.name} type="file" onChange={(event)=>_this.onChange(event)} />
                {s.error_msgs[p.name] ?<p style={{color:'red',fontSize:12}}>{s.error_msgs[p.name]}</p> : null }
                <input type="hidden" name={p.name+'PreviousFilename'} value={_s.previousFilename}/>
	        </div>
        )
    }
});

module.exports = StdFile;
