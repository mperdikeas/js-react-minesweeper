const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.js';

$(document).ready(doStuff);


function doStuff() {
    ReactDOM.render(<App
                    width ={8}
                    height={8}
                    mineCoverage={0.08}
                    secsAllowed={60}
                    />
                    , $('#app')[0]);

}
