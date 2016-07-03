const React = require('react');
import assert from 'assert';
import {CellState} from './cell.js';
import TwoLiner from './two-liner.js';
import {UNICODE_NON_BREAKING_SPACE} from './constants.js';

const GameEndMsg = function (props) {

    let lineA, lineB = UNICODE_NON_BREAKING_SPACE;
    if (_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length>0) {
        assert(_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length==1);
        lineA = 'Your remains are not pleasant to look at';
        lineB = '... but you died painlessly.';
    } else {
        const uncoveredMines   = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_UNCOVERED ).length;
        const wrongPlacedMines = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_WRONGPLACE).length;
        if ((uncoveredMines===0) && (wrongPlacedMines===0))
            lineA =  'you succesfully cleared the field!';
        else {
            if (uncoveredMines>0)
                lineA = `${uncoveredMines} mines were left unmarked`;
            if (wrongPlacedMines>0)
                lineB = `${wrongPlacedMines} flags were wrongly placed`;
            if (lineA == null) {
                lineA = lineB;
                lineB = 'Your are considered overly cautious';
            }
        }
    }
    return (
            <TwoLiner
                lineA = {lineA}
                lineB = {lineB}
            />
    );
};


export default GameEndMsg;

