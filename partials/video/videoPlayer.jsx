const React        = require('react');

require('!style-loader!css-loader!video.js/dist/video-js.min.css');
require('!style-loader!css-loader!../../style/videoPlayer.css');
import videojs from 'video.js';

import ArrowBackSVG from 'material-ui/svg-icons/navigation/arrow-back';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const VideoPlayer = React.createClass({
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
				if(p.stopped)
			    	p.stopped();
			    if(p.ended)
					p.ended(player.duration());
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
	/*get_type: function(src) {
		if(this.props.fromBlob)
			return "video/webm";

		var file_ext = src.toLowerCase().split('.').pop();
		switch(file_ext)
		{
			case "webm":
				return "video/webm";
				break;
			case "mp4":
				return "video/mp4";
				break;
		}

		return null;
	},*/
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
				    <source src={p.fromBlob ? window.URL.createObjectURL(p.src) : p.src} type="video/webm" />
				    {!p.fromBlob ?
				    	<source src={p.src.replace('.webm','.mp4')} type="video/mp4" />
			    	:null}
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