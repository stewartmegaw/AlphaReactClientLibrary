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
		var p = this.props;

		return {
			// Filename available after the video is uploaded or from form data
			videoFilename: p.state.data[p.name] ? p.state.data[p.name].file : null,
			recorder:0,
			video:null,
			uploading:null,
			preview:null,
			// Currently the video duration is not reliably returned after recording.
			// In order to confirm the video is not under minLength we play the entire video
			// after which html5 seems able to correctly return the duration. Otherwise 'previewWatched'
			// would not be required
			previewWatched:null,
		}
	},
	componentDidMount(){
		// Trigger a form update/validation
		this.props.updated(this.props.state);
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
				},
				success:function(r)
				{
					//For processing the form
					_this.setState({
						videoFilename: file.newname,
						totalSize: null,
						uploading: null,
						recorder:0,
						preview:null,
						previewWatched:null
					});
					// Trigger a form update/validation
					_this.props.updated(_this.props.state);
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
					    		ended={(duration)=>{
					    			if(s.preview && !s.previewWatched)
					    			{
					    				console.log('duration::'+duration);
					    				if(duration < p.minDuration)
				    						emitter.emit('info_msg','Video length is under '+p.minDuration+' seconds. Please record again.');
					    				else
					    					_this.setState({previewWatched:1});

					    			}	
					    		}}
					    		autoplay={s.preview ? true : false}
							/>

						:null}
						{!s.recorder ?
							<div>
								{s.preview && !s.previewWatched ?
									<div style={{marginTop:10,color:'#666'}}>Watch your recording before saving...</div>
								:null}
								{s.preview ?
									<span>
										{s.videoFilename ?
											<FlatButton
												label="Back"
												onClick={()=>{
													var videoFilename = s.videoFilename;
													this.setState({preview:null,previewWatched:null,videoFilename:null}, function(){
														// This forces <VideoPlayer inline to false therefore causing it to reload
														// with s.videoVideo (if it exists)
														_this.setState({videoFilename:videoFilename});
													})
												}}
											/>
										:null}
										<FlatButton
											disabled={!s.previewWatched}
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
									onClick={()=>this.setState({recorder:1,preview:null,previewWatched:null})}
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
							onRecordComplete={(file)=>this.setState({preview: file,recorder:0,previewWatched:p.minDuration ? null : 1})}
							maxDuration={p.maxDuration}
							/>
						{p.minDuration && p.maxDuration?
							<div style={{marginTop:10,color:'#666'}}>Between {p.minDuration} and {p.maxDuration} seconds please!</div>
						:null}
						{s.videoFilename ?
							<FlatButton
								style={{top:10}}
								label="Back"
								onClick={()=>this.setState({recorder:0,preview:null,previewWatched:null})}
							/>
						:null}
					</div>
				:null}
				{/*This field is purely used for validation*/}
				<input type="hidden" name={p.name} value={s.videoFilename || ''} />
			</div>
		);
	}
});

module.exports = StdVideoCapture;
