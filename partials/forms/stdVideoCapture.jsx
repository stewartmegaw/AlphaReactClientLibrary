const React = require('react');

const VideoRecorder = require('alpha-client-lib/partials/video/videoRecorder');
const VideoPlayer = require('alpha-client-lib/partials/video/videoPlayer');
const FileUtils = require('alpha-client-lib/lib/fileUtils');

const Loading = require('alpha-client-lib/partials/helpers/loading');


import FlatButton from 'material-ui/FlatButton';
import VideoSVG from 'material-ui/svg-icons/av/videocam';
import SaveSVG from 'material-ui/svg-icons/file/file-upload';
// import UploadSVG from 'material-ui/svg-icons/file/file-upload';
const styles = require('../../style/videoCapture.css');

const StdVideoCapture = React.createClass({

	getInitialState() {
		return {
			//this will be filename available after the video is uploaded
			videoFilename: null,
			recorder:0,
			video:null,
			uploading:null,
			preview:null,
		}
	},
	saveVideo: function() {
		var _this = this;
		var file = this.state.preview;
		
		_this.setState({uploading: '...',totalSize:'...'});
		
		// Create a unique name to file for uploading to cloud
		file.newname = 'weestay-'+ FileUtils.guid() + '.webm';

		FileUtils.save(
			file,
			{
				progress: function(percent, totalSize, uploading)
				{
					_this.setState({totalSize: totalSize, uploading: uploading});
					console.log('progress', percent, totalSize, uploading);
				},
				success:function(r)
				{
					//For processing the form
					_this.setState({
						videoFilename: file.newname,
						totalSize: null,
						uploading: null,
						recorder:0,
						preview:null
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
				<div style={{marginBottom:10}}>{p.label}</div>

				<div className="clearFix">
					<div  className={[styles.player, s.uploading === null ? '' : styles.playerWhileUploading].join(' ')}>
						{(s.videoFilename || s.preview) && !s.recorder ?
							<VideoPlayer
								width={340}
					    		src={s.preview || "https://storage.googleapis.com/weestay-cloud-storage/"+s.videoFilename}
					    		fromBlob={s.preview ? true : false}
							/>

						:null}
						{!s.recorder ?
							<div>
								{s.preview ?
									<span>
										{s.videoFilename ?
											<FlatButton
												label="Back"
												onClick={()=>this.setState({preview:null})}
											/>
										:null}
										<FlatButton
											secondary={true}
											icon={<SaveSVG/>}
											label="Save"
											onClick={this.saveVideo}
										/>
									</span>
								:null}
								<FlatButton
									label={s.videoFilename || s.preview ? "Record Again" : "Record"}
									icon={<VideoSVG />}
									onClick={()=>this.setState({recorder:1})}
								/>
							</div>
						:null}
					</div>

					{s.uploading !== null ?
						<div className={styles.uploading}>
							<Loading size={0.5} />
								<div>Uploading<br />This may take a moment!</div>
				          <div>
				            {s.uploading} / {s.totalSize}
				          </div>
						</div>
					:null}
				</div>
				
				{s.recorder ?
					<div>
						<VideoRecorder
							id={p.id}
							width={p.style && p.style.maxWidth ? p.style.maxWidth : 300}
							onRecordComplete={(file)=>this.setState({preview: file,recorder:0})}
							/>
						{s.videoFilename ?
							<FlatButton
								style={{top:10}}
								label="Back"
								onClick={()=>this.setState({recorder:0})}
							/>
						:null}
					</div>
				:null}
				
			</div>
		);
	}
});

module.exports = StdVideoCapture;
