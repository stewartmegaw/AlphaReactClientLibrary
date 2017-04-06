const React = require('react');

const VideoRecorder = require('alpha-client-lib/partials/video/videoRecorder');
const VideoUtils = require('alpha-client-lib/partials/helpers/videoUtils');
const Loading = require('alpha-client-lib/partials/helpers/loading');


import FlatButton from 'material-ui/FlatButton';
import VideoSVG from 'material-ui/svg-icons/av/videocam';
import UploadSVG from 'material-ui/svg-icons/file/file-upload';

const StdVideoCapture = React.createClass({

	getInitialState() {
		return {
			//this will be filename available after the video is uploaded
			videoFileName: null,
			recorder:0,
			video:null,
		}
	},

	saveVideo: function(file) {

		var _this = this;
		_this.setState({uploading: 1});
		//add unique name to file for uploading to cloud
		file.newname = 'weestay-'+ VideoUtils.guid() + '.webm';

		VideoUtils.saveVideo(
			file,
			"/add-video-file",
			{
				//callbacks for ui or whatever we want to do with it
				progress: function(percent, totalSize, transfered)
				{
					_this.setState({totalSize: totalSize, transfered: transfered});
					console.log('progress', percent, totalSize, transfered);
				},
				processing:	function()
				{
					console.log('processing');
				},
				success:function(r)
				{
					//For processing the form
					_this.setState({
						videoFileName: file.newname,
						uploading: 0,
						totalSize: null,
						transfered: null,
					},
					()=>{console.log(_this.state.videoFileName)
					});
				},
				fail: function(r,s,x)
				{
					//Do something here when the upload fails
					//May be make a call to server to delete the AlphaFile
					console.log('Failed to Upload Video');
				}
			},
		);
	},

	render: function() {
		var _this = this;

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
							onRecordComplete={(blob)=>_this.saveVideo(blob)}
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
				{!s.uploading && !s.transfered ? null :
					<div style={{textAlign:'center',color:'#666'}}>
						<Loading size={0.5} />
							<div>Uploading<br />This may take a moment!</div>
			          <div>
			            {s.transfered} / {s.totalSize}
			          </div>
					</div>
				}
			</div>
		);
	}
});

module.exports = StdVideoCapture;
