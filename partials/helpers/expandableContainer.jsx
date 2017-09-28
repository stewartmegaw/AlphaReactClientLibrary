/*
Still TODOs
1. Use javascript to animate when requried
2. Automatically work out if fade div is required when expanded
*/

const React = require('react');

const Styles = require('../../style/helpers/expandableContainer.css');


const ExpandableContainer = React.createClass({
	getInitialState(){
		return {
			expanded:false
		}
	},
	expand(){
		this.setState({expanded:!this.state.expanded});
	},
	render: function() {
		var s = this.state;
		var p = this.props;

		var showMoreBtn = p.getShowMoreBtn ? p.getShowMoreBtn(s.expanded) : null;

		return (
			<div style={p.style || {}}>
				
				<div className={Styles.container}>
	            
	                <div
	                	style={p.initialHeight && !s.expanded ? {minHeight:p.initialHeight} :{}}
	               		className={[p.finalHeight == 'auto' ? Styles.expandEntirely : null, Styles.scrollContainer, s.expanded ? Styles.scrollContainerExpand : Styles.scrollContainerNotExpand].join(' ')}
            		>
	                    {p.getChildren(s.expanded)}
	                </div>
	                {(p.showFaderInitially && !s.expanded) || (s.expanded && p.finalHeight != 'auto') ? 
	                    <div className={[Styles.fadeBottom, p.faderStyle || null].join(' ')} />
	                :null}

	                {!p.showMorePosition && showMoreBtn ?
	            		showMoreBtn
	        		:null}

	            </div>

	            {p.showMorePosition == 'outsideBottomCenter' && showMoreBtn ?
	            	showMoreBtn
	        	:null}
            </div>
	);}
});

module.exports = ExpandableContainer;
