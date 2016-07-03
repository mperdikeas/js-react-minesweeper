require('./game-info.css');
const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
const React = require('react');
var      cx = require('classnames');
import assert from 'assert';


const GameInfo = React.createClass({
    propTypes: {
        minesLeft  : React.PropTypes.number.isRequired,
        secsLeft: React.PropTypes.number.isRequired
    },
    render: function() {
        return (
                <div>
                <span id='ml' >Mines left: </span>
                <span id='mld'>{this.props.minesLeft}</span>
                <br/>
                <span id='tl' >Time left: </span>
                <span id='tld'>{this.props.secsLeft}</span>
                </div>
        );
    }
});


export default GameInfo;

