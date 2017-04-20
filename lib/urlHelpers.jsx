var React = require('react');

var UrlHelpers = {

    //returns clean value with only alpha numeric characters and hyphens
    clean: function(value) {
        var cleanedValue = value.replace(/[\W_]+/g, "-");
        return cleanedValue;
    }

};

module.exports = UrlHelpers;
