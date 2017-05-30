import 'whatwg-fetch';

var AppState = {
    // Returns state property if it exists
    // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    getProp: function(s, fallbackValue, options) {
    	/*
			Key was not found in state.
			Either return the fallbackValue or 
			make a server request for the data 
    	*/
	    function handleNotFound() {
	    	if(options && options.request && !serverSide)
	    	{
	    		fetch(options.request, {
		            headers: {
		                'X-Requested-With': 'XMLHttpRequest'
		            },
		          method:'GET',
		          credentials: 'include',
		          }).then(function(response) {
		            if(response.ok)
		            	return response.json();
		            else
		              throw new Error('Network response error');
		        }).then(function(r) {
		            options.then(r);
		        }).catch(function(err) {
		            console.log(err);
		            throw new Error('Network response error');
		        });
	    	}
	    	
	    	return fallbackValue;
	    }


	    /*
		    Check the appState for nested key
		    Example s:
		    string s = "parentKey.child1Key.child2Key"
		    if parentKey or child1Key key do not exist
		    then the fallbackValue is returned instead
		    of an error
	    */
	    if(!s)
	    	return handleNotFound();
	    
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
		            return handleNotFound();
		        }
		    }
		    return _state;
    	} catch(e) {
    		return handleNotFound()
    	}
    }
};

module.exports = AppState;