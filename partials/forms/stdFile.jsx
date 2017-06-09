const React = require('react');

var validate = require("validate.js");

var style = require('alpha-client-lib/style/file.css');

const StdFile = React.createClass({
	getInitialState:function() {
		var p = this.props;
		var previousFilename = null;
		if(p.previousFilenameField)
			previousFilename = p.state.data[p.previousFilenameField.name];
		return {
			previousFilename: previousFilename
		}
	},
	render: function() {
		var s = this.props.state;
		var p = this.props;
        var _this = this;
        var _s = this.state;

		return (
			<div style={Object.assign({margin:'26px 0'},p.style || {})} id={p.id}>
                <p className={style.label}>
                	{p.label}
                	{_s.previousFilename ? <span><br/>Previously uploaded: <b>{_s.previousFilename.split('/').pop()}</b></span> : null}
            	</p>
				<input name={p.name} type="file" onChange={(event)=>{
					if(s.error_msgs[p.name])
					{
						var copyS = Object.assign({},s);
						copyS.error_msgs[p.name] = null;
						p.updated(copyS);
					}	
				}} />
                {s.error_msgs[p.name] ?<p style={{color:'red',fontSize:12}}>{s.error_msgs[p.name]}</p> : null }
                {p.previousFilenameField ? 
					<input key={p.previousFilenameField.name} type="hidden" name={p.previousFilenameField.name} value={_s.previousFilename} />
				:null}
	        </div>
        )
    }
});

module.exports = StdFile;
