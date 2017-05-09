const React = require('react');

var validate = require("validate.js");

const StdFile = React.createClass({

    onChange:function(event){
        console.log(event);
	},

	render: function() {
		var s = this.props.state;
		var p = this.props;
        var _this = this;

		return (
			<span>
                <p style={{marginBottom:2}}>{p.label}</p>
				<input name={p.name} type='file' onChange={(event)=>_this.onChange(event)} />
                {s.error_msgs[p.name] ?<p style={{color:'red',fontSize:12}}>{s.error_msgs[p.name]}</p> : null }
	        </span>
        )
    }
});

module.exports = StdFile;
