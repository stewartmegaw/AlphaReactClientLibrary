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

  onChange: function(value) {

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
        <input
          type="hidden"
          name={p.name}
          id={'textarea-' + p.name}
          value={s.data[p.name] ? beautify(s.data[p.name],{indent_size:2}) : null}
          />
      </div>
    );
  }

});

module.exports = StdCodeMirror;

