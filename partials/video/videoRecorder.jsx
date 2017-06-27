const React = require('react');

require('!style-loader!css-loader!video.js/dist/video-js.min.css');
require('!style-loader!css-loader!videojs-record/dist/css/videojs.record.min.css');
require('!style-loader!css-loader!../../style/videoPlayer1.css');

var styles = require('../../style/videoRecorder.css');

var videojs = require('video.js');
import recordRTC from 'recordrtc';
window.MRecordRTC = recordRTC.MRecordRTC;
require('videojs-record');

var uaParser = require('ua-parser-js');
var	ua = new uaParser();
ua = ua.getResult();

const VideoRecorder = React.createClass({
	getInitialState(){
		return {}
	},
	componentDidMount() {
		this.init();

		if(this.props.landscapeOnly)
		{
			var height = document.getElementById(this.props.id+"recorderContainer").clientHeight;
			var width = document.getElementById(this.props.id+"recorderContainer").clientWidth;
			if(height > width)
				this.setState({landscapeOnlyMsg:1});
		}

		var _this = this;
		// Listen for resize changes
		window.addEventListener("resize", function() {
			if(_this.resizedTimer)
				clearTimeout(_this.resizedTimer);
			else
				_this.setState({resizedMsg:1});

			_this.resizedTimer = setTimeout(() =>{
				window.location.reload();
			}, 2000);
		}, false);

		// Listen for orientation changes      
		window.addEventListener("orientationchange", function() {
		    window.location.reload();
		}, false);
	},
	resizedTimer:null,
	componentWillUnmount(){
		this.player.recorder.stopDevice();
	},
	init(){
		var _this = this;
		var p = this.props;

		// Set width equal to width of parent container
		var width16by9 = document.getElementById(p.id).parentElement.clientWidth;
		var height16by9 = width16by9 * 0.5625;
		// Adjust height so it's less than 0.9*height of browser window
		var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		if(height16by9 > (viewPortHeight * 0.9))
		{
			height16by9 = viewPortHeight * 0.9;
			// Now adjust width to maintain 16:9
			width16by9 = height16by9 / 0.5625;
		}

		this.player = videojs(this.refs.video,{
			controls:true,
			width: width16by9,
			height: height16by9,
			plugins: {
		        record: {
		            audio: true,
		            maxLength: p.maxDuration || 10,
		            debug: true,
		            video: {
		                // video constraints: set resolution of camera
		                mandatory: {
		                    minWidth: 1280,
		                    minHeight: 720,
		                },
		            },
		        }
		    },
		});

		this.player.on('deviceError', function()
		{
		    console.log('device error:', _this.player.deviceErrorCode);
		});
		this.player.on('error', function(error)
		{
		    console.log('error:', error);
		});
		// user clicked the record button and started recording
		this.player.on('startRecord', function()
		{
		    console.log('started recording!');
		});

		// user completed recording and stream is available
		this.player.on('finishRecord', function()
		{

		    // the recordedData object contains the stream data that
		    // can be downloaded by the user, stored on server etc.
			_this.uploadVideo(_this.player.recordedData);
		});

		this.player.recorder.getDevice();
	},
	player:null,
	uploadVideo: function(blob){
		this.props.onRecordComplete(blob.video);
	},
	render() {
		let p = this.props;

		return (
			<div
				id={p.id+"recorderContainer"}
				className={[
					styles.videoRecorder,
					this.state.landscapeOnlyMsg ? styles.recorderLandscapeOnly:'',
					this.state.resizedMsg ? styles.recorderResized:'',
				].join(' ')}
			>
				<video
					ref="video"
					id={p.id}
					className="video-js vjs-default-skin"
				>
				</video>
			</div>
		);
	}
});

module.exports = VideoRecorder;
