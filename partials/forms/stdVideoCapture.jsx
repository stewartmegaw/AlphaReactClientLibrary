const React = require('react');

const VideoRecorder = require('alpha-client-lib/partials/video/videoRecorder');

import FlatButton from 'material-ui/FlatButton';
import VideoSVG from 'material-ui/svg-icons/av/videocam';
import UploadSVG from 'material-ui/svg-icons/file/file-upload';

const StdVideoCapture = React.createClass({
	getInitialState() {
		return {
			recorder:0,
			video:null,
		}
	},
	render: function() {
		var s = this.state;
		var p = this.props;

		return (
			<div style={Object.assign({marginTop:16},p.style)}>
				<div>{p.label}</div>
				{!s.recorder ? null : 
					<div style={{marginTop:10}}>
						<VideoRecorder
							id={p.id}
							width={p.style && p.style.maxWidth ? p.style.maxWidth : 300}
						/>
						<FlatButton
							style={{top:10}}
							label="Back"
							onClick={()=>this.setState({recorder:0})}
					    />
					</div>
				}
				{s.recorder ? null :
					<div>
						<FlatButton
							label="Record"
							icon={<VideoSVG />}
							onClick={()=>this.setState({recorder:1})}
					    />
					    <FlatButton
							label="Upload"
							icon={<UploadSVG />}
					    />
				    </div>
				}
			</div>
		);
	}
});

module.exports = StdVideoCapture;