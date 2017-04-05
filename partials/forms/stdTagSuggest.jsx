const React = require('react');

import 'whatwg-fetch';

import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

import SearchSVG from 'material-ui/svg-icons/action/search';
import AddSVG from 'material-ui/svg-icons/content/add';

const tagsStyle = require('../../style/tags.css');
const styleUtils = require('../../style/styleUtils.css');

const StdTagSuggest = React.createClass({
	getInitialState:function() {
		return {
			displayTags:this.props.displayTags||[],
			tagInputTxt:'',
			tagsSelected:[],
		};
	},
	getTag4AS:function(name){
		return (<MenuItem style={{minHeight:40,paddingTop:4}}><Chip style={{pointerEvents:'none'}}>{name}</Chip></MenuItem>);
	},
	getTagTimer:null,
	clear:function(){
		this.setState({tagInputTxt:'',tagSuggestions:[]});
	},
	focus:function(){
		this.refs.autocomplete.focus();
	},
	tagTextChanged:function(v){
		var _this = this;
		
		if(this.getTagTimer)
		{
			window.clearTimeout(this.getTagTimer);
			this.getTagTimer = null;			
		}

		this.getTagTimer = window.setTimeout(function(){
			var val = v.trim().toLowerCase();
			fetch('/tags/suggest?name='+val).then(function(response) {
				if(response.ok)
					return response.json();
				else
					throw new Error('Network response error');
			}).then(function(r) {
				console.log(r);
				var tagSuggestions = [];
            	var valFound = false;
            	for(var i = 0; i < r.results.length; i++)
            	{	
            		var tag = r.results[i];
            		
            		if(tag.name == val)
            			valFound = true;

            		if(!_this.props.unique || _this.state.tagsSelected.indexOf(tag.name)==-1)
            		{
	            		tagSuggestions.push({
	            			text:tag.name,
		            		value:_this.getTag4AS(tag.name)
	            		});
            		}
            	}

            	if(!valFound && _this.props.inputAsTag)
            		if(!_this.props.unique || _this.state.tagsSelected.indexOf(tag.name)==-1)
            		{
	            		tagSuggestions.unshift({
	            			text:val,
		            		value:_this.getTag4AS(val)
	            		});
	            	}

            	_this.setState({tagSuggestions:tagSuggestions, txtChangeFlag:0});
			}).catch(function(err) {
				console.log(err);
			});
	    }, 400);
	},
	tagSelectedDefault(name){
		var _this = this;
		var displayTags = this.state.displayTags.slice(0);
		(function(idx){	
	     	displayTags.push(<Chip
	     		onRequestDelete={()=>{
	     			var _displayTags = _this.state.displayTags.slice(0);
	     			_displayTags.splice(idx, 1);
	     			var _tagsSelected = _this.state.tagsSelected.slice(0);
	     			_tagsSelected.splice(idx, 1);
	     			_this.setState({displayTags:_displayTags, tagsSelected:_tagsSelected});
	     		}}
	            className={tagsStyle.tags}
	            style={{float:'left'}}>{name}</Chip>);
		})(displayTags.length)
    	this.setState({displayTags:displayTags});
		_this.clear();
		_this.focus();
	},
	render:function() {
		var s = this.state;
		var p = this.props;
		var _this = this;

		var displayTagsPosition = p.displayTagsPosition || "before";

		return (
			<span>
				{p.headerText?<br/>:null}
				<div className={[tagsStyle.suggestWrapper, p.wrapperClassName].join(' ')} style={p.style ||{}}>
					{p.headerText ? <div style={{marginTop:16}}>{p.headerText}</div>:null}
					{s.displayTags && displayTagsPosition == "before" ?
						<span>
							{s.displayTags.map((tag,i) =>
					        	<span key={i}>
						        	{tag}
						        	<input value={s.tagsSelected[i]} name={p.name} type="hidden"/>
						        	{p.displayTagsJoin ? <AddSVG style={{float:'left',width:20,height:20,marginRight:30,marginTop:12}}/> : null}
				        		</span>
			        		)}
	        			</span>
					:null}

					<div className={[tagsStyle.suggestSelect, p.suggestClassName].join(' ')} style={displayTagsPosition == "before" ? {float:'left'}:{}}>
						<AutoComplete
							id={p.id}
							ref="autocomplete"
							style={p.style || {}}
							hintText={<span style={p.hintTextStyle || {}}>{p.hintText}</span>}
							dataSource={s.tagSuggestions || []}
							filter={AutoComplete.noFilter}
							onUpdateInput={(val)=>{
								this.setState({
									tagInputTxt:val,
									tagSuggestions: val.length < s.tagInputTxt.length ? [] : s.tagSuggestions,
									txtChangeFlag:1,
								});
								if(val.trim())
								{
									this.tagTextChanged(val);
								}
								else if(_this.getTagTimer)
								{
									window.clearTimeout(_this.getTagTimer);
									_this.getTagTimer = null;			
								}
							}}
							searchText={s.tagInputTxt}
							onNewRequest={(val) => {
								var value = val && val.text ? val.text : val;
								if(value && s.tagsSelected.indexOf(value) == -1)
								{
									var _tagsSelected = s.tagsSelected.slice(0);
									_tagsSelected.push(value);
									this.setState({txtChangeFlag:1,tagsSelected:_tagsSelected});

									if(p.tagSelected)
										p.tagSelected(value);
									else
										this.tagSelectedDefault(value);

									if(this.getTagTimer)
									{
										window.clearTimeout(this.getTagTimer);
										this.getTagTimer = null;			
									}
								}
							}}
							errorStyle={{position:'absolute',bottom:-8}}
							errorText={p.state && p.state.error_msgs && p.state.error_msgs[p.name] ? p.state.error_msgs[p.name][0] : null}
							inputStyle={{textTransform:'lowercase'}}
							openOnFocus={true}
							fullWidth={true}
				        />
				        {p.showSearchIcon === false ? null : <SearchSVG style={{position:'absolute',right:0,top:10,pointerEvents:'none'}} /> }
			        </div>

			        {displayTagsPosition == "before" ? <div className={styleUtils.clearFix}/> : null}

		        </div>
	        </span>
		);
	}
});	

module.exports = StdTagSuggest;