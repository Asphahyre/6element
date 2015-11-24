'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');
var L = require('leaflet');
var addIconPulse = require('./js/addIconPulse');
addIconPulse(L);

var Tokens = require('../Tokens.json');
var googleMapsApi = require( 'google-maps-api' )( Tokens.google_token, ['places']);

var Layout =  require('./views/layout.js');

var props = require('../common/layoutData');
props.leaflet = L;
props.googleMapsApi = googleMapsApi;

document.addEventListener('DOMContentLoaded', function(){
    React.render( 
        React.createElement(Layout, props),
        document.body
    );
})
