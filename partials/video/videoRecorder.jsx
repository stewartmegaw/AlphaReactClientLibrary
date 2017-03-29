const React = require('react');

require('!style-loader!css-loader!video.js/dist/video-js.min.css');
require('!style-loader!css-loader!videojs-record/dist/css/videojs.record.min.css');
require('!style-loader!css-loader!../../style/videoPlayer.css');

var videojs = require('video.js');
import recordRTC from 'recordrtc';
window.MRecordRTC = recordRTC.MRecordRTC;
require('videojs-record');

const VideoRecorder = React.createClass({
	componentDidMount() {
		var p = this.props;

		var player = videojs(this.refs.video,{
			controls:true,
			width: p.width,
			plugins: {
		        record: {
		            audio: true,
		            video: true,
		            maxLength: 60,
		            debug: true
		        }
		    },
		});

		player.on('deviceError', function()
		{
		    console.log('device error:', player.deviceErrorCode);
		});
		player.on('error', function(error)
		{
		    console.log('error:', error);
		});
		// user clicked the record button and started recording
		player.on('startRecord', function()
		{
		    console.log('started recording!');
		});

		player.recorder.getDevice();
	},
	render() {
		let s = this.state;
		let p = this.props;

		return(
			<video
				ref="video"
				id={p.id}
				className="video-js vjs-default-skin"
			>
			</video>
		);
	}
});

module.exports = VideoRecorder;