import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';

var CodeMirror = require('react-codemirror');
var beautify = require('js-beautify').js_beautify;

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/display/fullscreen');

if(!serverSide)
{
  var $ = require("jquery");
}


var StdCodeMirror = React.createClass({

  getInitialState: function() {
    return {
      code: this.props.state.data[this.props.name],
    };
  },

  componentDidMount: function() {
    var beautifiedCode = this.props.state.data[this.props.name] ? beautify(this.props.state.data[this.props.name], { indent_size: 2 }) : null;
    this.setState({code: beautifiedCode});
  },

  onChange: function(value) {

    var _this = this;
    var s = this.props.state;
    var p = this.props;

    var _s = Object.assign({},s);
    _s.data[p.name] = value;

    // There is currently an error so validate onChange
    if(s.error_msgs[p.name])
    {
      // Only validate this field
      var fieldVals = {};
      fieldVals[p.name] = value.trim();
      var constraints = {};
      constraints[field] = s.constraints[p.name];
      var errors = validate(fieldVals, constraints);
      _s.error_msgs = errors || {};
    }

    $('#textarea-' + p.name).text(value);
    _this.setState({code: value});
    this.props.updated(_s);
  },

  render: function() {

    var s = this.props.state;
    var p = this.props;
    var _s = this.state;

    //Codemirror Options
    var cmOptions = {
      lineNumbers: true,
      lineWrapping: true,
      mode: {name: "javascript", json: true, globalVars: true},
      extraKeys: {
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
    };

    return (
      <div style={{'marginTop':'10px','marginBottom':'10px'}}>
        <p style={{'fontSize':'14px','color':'rgba(0,0,0,0.54)'}}>
          {p.label + ' (Please enter the code in editor below)'}
        </p>
        <CodeMirror
          ref={p.name}
          name={p.name}
          value={s.data[p.name]}
          onChange={this.onChange}
          options={cmOptions}
          />
        <textarea
          name={p.name}
          id={'textarea-' + p.name}
          style={{'display':'none'}}
          >
          {_s.code}
        </textarea>
      </div>
    );
  }

});

module.exports = StdCodeMirror;
