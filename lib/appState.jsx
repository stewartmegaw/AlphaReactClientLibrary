var AppState = {
    // Returns state property if it exists
    // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    getProp: function(s, fallbackValue) {
    	var _state = Object.assign({}, appState || {});

    	try {
	    	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		    s = s.replace(/^\./, '');           // strip a leading dot
		    var a = s.split('.');
		    for (var i = 0, n = a.length; i < n; ++i) {
		        var k = a[i];
		        if (k in _state) {
		            _state = _state[k];
		        } else {
		            return fallbackValue;
		        }
		    }
		    return _state;
    	} catch(e) {
    		return fallbackValue
    	}
    }

};

module.exports = AppState;