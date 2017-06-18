const React = require('react');

const VideoRecorder = require('alpha-client-lib/partials/video/videoRecorder');
const VideoPlayer = require('alpha-client-lib/partials/video/videoPlayer');
const FileUtils = require('alpha-client-lib/lib/fileUtils');

const Loading = require('alpha-client-lib/partials/helpers/loading');


import FlatButton from 'material-ui/FlatButton';
import VideoSVG from 'material-ui/svg-icons/av/videocam';
import SaveSVG from 'material-ui/svg-icons/file/file-upload';
const styles = require('../../style/videoCapture.css');

// Test for MediaRecorder API enabled
var mediaRecorderSupported = 0;
try {
	mediaRecorderSupported = MediaRecorder ? 1 : 0;
}
catch(err){}
// Only allow recording browser if Chome >= 49 or Firefox >= 29
var uaParser = require('ua-parser-js');
if(mediaRecorderSupported)
{
	var ua = new uaParser();
	ua = ua.getResult();
	var major = ua.browser.major;
	if(ua.browser.name == "Chrome" && major && Number(major) < 49)
		mediaRecorderSupported = 0;
	else if(ua.browser.name == "Firefox" && major && Number(major) < 29)
		mediaRecorderSupported = 0;
}

const StdVideoCapture = React.createClass({
	getInitialState() {
		var p = this.props;

		var videoFilename = p.state.data[p.name] ? p.state.data[p.name].file : null;

		return {
			// Filename available after the video is uploaded or from form data
			videoFilename: videoFilename,
			recorder:videoFilename ? 0 : 1,
			video:null,
			uploading:null,
			preview:null,
			durationOk:null,
		}
	},
	componentDidMount(){
		// Trigger a form update/validation
		this.props.updated(this.props.state);
	},
	saveVideo: function() {
		var _this = this;
		var file = this.state.preview;
		
		_this.setState({uploading: '...',totalSize:'...'},()=>{
			var elm = document.getElementById(_this.props.id+"progress");
			if(elm)
      			elm.scrollIntoView({behavior: "smooth"});
		});
		
		// Create a unique name to file for uploading to cloud
		file.newname = 'weestay-'+ FileUtils.guid() + '.webm';

		FileUtils.save(
			file,
			this.props.fieldId,
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
						durationOk:null
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
	getDuration(duration){
		if(this.state.preview)
		{
			if(duration < this.props.minDuration || duration > this.props.maxDuration)
				emitter.emit('info_msg','Video length must be between '+this.props.minDuration+' and '+this.props.maxDuration+' seconds. Please record again.');
			else
				this.setState({durationOk:1});

		}
	},
	render: function() {
		var _this = this;

		var s = this.state;
		var p = this.props;

		var alternativeRecording = function(){
			return (
				<input
					 ref="fileInput"
					 type="file"
					 accept="video/*"
					 capture={true}
					 onChange={()=>{
					 	var f = _this.refs.fileInput.files[0];
					 	if(f)
					 	{
					 		if(f.type != 'video/mp4' && f.type != 'video/quicktime' && f.type != 'video/webm')
						 		emitter.emit('info_msg', 'Only the following formats are supported: mp4, mov, webm');
						 	else
					 			_this.setState({preview:f,recorder:0,durationOk:p.minDuration || p.maxDuration ? null : 1});
				 		}
					 }}
			 	/>
			);
		};

		return (
			<div style={Object.assign({marginTop:16},p.style)} id={p.id}>
				<div style={{marginBottom:10}} dangerouslySetInnerHTML={{__html:p.label}}/>

				<div className="clearFix">
					<div className={[styles.player, s.uploading === null ? '' : styles.playerWhileUploading].join(' ')}>
						{(s.videoFilename || s.preview) && !s.recorder ?
							<VideoPlayer
								width={340}
					    		src={s.preview ? [s.preview] : ["https://storage.googleapis.com/weestay-cloud-storage/"+s.videoFilename]}
					    		fromBlob={s.preview ? true : false}
					    		getDuration={this.getDuration}
					    		autoplay={s.preview ? true : false}
							/>

						:null}
						{!s.recorder ?
							<div>
								{s.preview && !s.durationOk ?
									<div style={{marginTop:10,color:'#666'}}>Watch your recording before saving...</div>
								:null}
								{s.preview ?
									<span>
										{s.videoFilename ?
											<FlatButton
												label="Back"
												onClick={()=>{
													var videoFilename = s.videoFilename;
													this.setState({preview:null,durationOk:null,videoFilename:null}, function(){
														// This forces <VideoPlayer inline to false therefore causing it to reload
														// with s.videoVideo (if it exists)
														_this.setState({videoFilename:videoFilename});
													})
												}}
											/>
										:null}
										<FlatButton
											disabled={!s.durationOk}
											secondary={true}
											icon={<SaveSVG/>}
											label="Save"
											onClick={this.saveVideo}
										/>
									</span>
								:null}
								<FlatButton
									label="Try Again"
									icon={<VideoSVG />}
									onClick={()=>this.setState({recorder:1,preview:null,durationOk:null})}
								/>
							</div>
						:null}
					</div>

					{s.uploading !== null ?
						<div className={styles.uploading} id={p.id+"progress"}>
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
						{mediaRecorderSupported ?
							<VideoRecorder
								id={p.id+'Recorder'}
								width={p.style && p.style.maxWidth ? p.style.maxWidth : 340}
								onRecordComplete={(file)=>this.setState({preview: file,recorder:0,durationOk:p.minDuration || p.maxDuration ? null : 1})}
								maxDuration={p.maxDuration}
							/>
						: 
							<div>
								{!s.enableAlternativeRecording ? 
									<div className={styles.uploadFromDevice} onClick={()=>this.setState({enableAlternativeRecording:1})}>
										<VideoSVG style={{width:70,height:70}}/>
										<br/>
										<span style={{fontWeight:500,fontSize:'14px'}}>UPLOAD RECORDING</span>
									</div>
								:alternativeRecording()}
							</div>
						}
						{p.minDuration && p.maxDuration?
							<div style={{marginTop:10}}>Between {p.minDuration} and {p.maxDuration} seconds please!</div>
						:null}
						{s.videoFilename ?
							<FlatButton
								style={{top:10}}
								label="Back"
								onClick={()=>this.setState({recorder:0,preview:null,durationOk:null})}
							/>
						:
							null
						}
						{mediaRecorderSupported ?
							<div style={{marginTop:16,color:'#666'}}>
								{!s.enableAlternativeRecording ?
									<span>Alternatively you can <span className="blueLink" onClick={()=>this.setState({enableAlternativeRecording:1})}>upload a recording</span> from your device</span>
								:
									alternativeRecording()
							 	}
							</div>
						:null}
					</div>
				:null}

				
				<input type="hidden" name={p.name} value={s.videoFilename || ''} />
			</div>
		);
	}
});

module.exports = StdVideoCapture;
