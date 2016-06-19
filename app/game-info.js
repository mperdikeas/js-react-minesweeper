require('./game-info.css');
const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
const React = require('react');
var      cx = require('classnames');
import assert from 'assert';
import TimerMixin    from 'react-timer-mixin';

const GameInfo = React.createClass({
    propTypes: {
        minesLeft  : React.PropTypes.number.isRequired,
        secsAllowed: React.PropTypes.number.isRequired,
        timeOver   : React.PropTypes.func  .isRequired
    },
    mixins: [TimerMixin],
    componentDidMount() {
        const intervalId = this.setInterval(
            () => {
                if (this.state.secsLeft>0)
                    this.setState({secsLeft: this.state.secsLeft-1});
                else {
                    this.props.timeOver();
                    clearInterval(this.state.intervalId);
                }
            }
            ,1000
        );
        this.setState({intervalId: intervalId});
    },
    getInitialState() {
        return {secsLeft: this.props.secsAllowed, intervalId: null};
    },
    render: function() {
        return (
                <div>
                <span id='ml' >Mines left: </span>
                <span id='mld'>{this.props.minesLeft}</span>
                <span id='tl' >Time left: </span>
                <span id='tld'>{this.state.secsLeft}</span>
                </div>
        );
    }
});


export default GameInfo;

