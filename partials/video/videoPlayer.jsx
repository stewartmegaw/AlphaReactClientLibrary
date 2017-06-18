const React        = require('react');

require('!style-loader!css-loader!video.js/dist/video-js.min.css');
require('!style-loader!css-loader!../../style/videoPlayer.css');
import videojs from 'video.js';

import ArrowBackSVG from 'material-ui/svg-icons/navigation/arrow-back';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const VideoPlayer = React.createClass({
	getInitialState(){
		return {
			duration:null
		}
	},
	componentDidMount:function() {
		var _this = this;
		var p = this.props;

		var player = videojs(this.refs.video,{
			controls:true,
			preload:"metadata",
			autoplay:p.autoplay || false,
			width:p.width,
			fluid:p.fluid,
			// src: p.fromBlob ? window.URL.createObjectURL(p.src) : p.src,
			// format: p.format || this.get_type(p.src)
		}, function(){
			player.on('ended', function() {
				player.currentTime(0);
				player.bigPlayButton.el().style.display = 'block';
    			player.controlBar.hide();

				// Video duration can reliably set
				var duration = player.duration();
				if(!_this.state.duration)
				{
	    			_this.setState({duration:duration});
	    			if(p.getDuration)
	    				p.getDuration(duration);
				}

				if(p.stopped)
			    	p.stopped();
			    if(p.ended)
					p.ended(duration);
			});	

			player.on('loadedmetadata', function(){
				// Not always reliable
				var duration = player.duration();
			    if(!_this.state.duration)
			    {	
			    	console.log(duration);
				    if(duration && duration != "undefined" && duration != "Infinity" && isNaN(duration) == false)
				    {	
	    				_this.setState({duration:duration});
	    				if(p.getDuration)
	    					p.getDuration(duration);
				    }
			    }
			});

			player.on('play', function(){
				player.bigPlayButton.el().style.display = 'none';
				player.controlBar.show();
                if(p.playing)
			    	p.playing();
			    
            });
		});
	},
	restart:function(){
		videojs(this.refs.video).play();
	},
	get_type: function(src) {
		if(this.props.fromBlob)
			return src.type;

		var file_ext = src.toLowerCase().split('.').pop();
		switch(file_ext)
		{
			case "mov":
				return "video/quicktime";
				break;
			default:
				return "video/"+file_ext;
				break;
		}
	},
	render() {
		var _this = this;
		var s = this.state;
		var p = this.props;

		
		return(
			<div>
				<video
					ref="video"
					className="video-js vjs-default-skin"
				>
					{/* Place mp4 on top and add #t=0.1 which seems to help iOS load the first frame image*/}
					{p.src.sort((a,b)=>{
						if((_this.get_type(a) == 'video/mp4' || _this.get_type(a) == 'video/quicktime')
							&& !(_this.get_type(b) == 'video/mp4' || _this.get_type(b) == 'video/quicktime'))
							return 1;
						else
							return 0;
					}).map((src, i)=>{
			    		return (
			    			<source key={i} src={p.fromBlob ? window.URL.createObjectURL(src) : src+"#t=0.1"} type={_this.get_type(src)} />
		    			);
					})}
				    {/*!p.fromBlob ?
				    	<source src={p.src.replace('.webm','.mp4')+'#t=0.1'} type="video/mp4" />
			    	:null*/}
				    <p className="vjs-no-js">
						To view this video please enable JavaScript, and consider upgrading to a web browser that
						<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
				    </p>
				</video>
				<FloatingActionButton
					onClick={()=>{
						var player = videojs(_this.refs.video);
						player.pause();
            			player.bigPlayButton.el().style.display = 'block';
            			player.controlBar.hide();
						if(p.stopped)
							p.stopped();
					}}
					style={Object.assign({position:'absolute',top:10,left:10},!p.showBackBtn?{display:'none'}:{})}
					mini={true}
				>
			    	<ArrowBackSVG/>
			    </FloatingActionButton>
			</div>
		);
	}
});

module.exports = VideoPlayer;