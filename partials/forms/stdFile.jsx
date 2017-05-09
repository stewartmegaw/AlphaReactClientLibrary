const React = require('react');

var validate = require("validate.js");

const StdFile = React.createClass({

    onChange:function(event){

        var file = event.target.files[0];
        var s = this.props.state;

        var _s = Object.assign({},s);
        _s.data[p.name] = file;

        // There is currently an error so validate onChange
        if(s.error_msgs[p.name])
        {
            // Only validate this field
            var fieldVals = {};
            fieldVals[p.name] = file.name.trim();
            var constraints = {};
            constraints[p.name] = s.constraints[p.name];
            var errors = validate(fieldVals, constraints);
            _s.error_msgs = errors || {};
        }

        this.props.updated(_s);
	},
	render: function() {
		var s = this.props.state;
		var p = this.props;
        var _this = this;

		return (
			<span>
                <p style={{marginBottom:2}}>{p.label}</p>
				<input type='file' onChange={(event)=>_this.onChange(event)} />
                {s.error_msgs[p.name] ?<p style={{color:'red',fontSize:12}}>{s.error_msgs[p.name]}</p> : null }
	        </span>
        )
    }
});

module.exports = StdFile;
