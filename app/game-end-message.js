const React = require('react');
import assert from 'assert';
import {CellState} from './cell.js';

const TwoLiner = (props) => {
    return (
        <div>
            {props.lineA}
            <br/>
            {props.lineB}            
        </div>
    );
};


const GameEndMsg = function (props) {
    const UNICODE_NON_BREAKING_SPACE = "\u00a0";
    let lineA, lineB = UNICODE_NON_BREAKING_SPACE;
    if (_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length>0) {
        assert(_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length==1);
        lineA = 'Your remains are not pleasant to look at';
        lineB = '... but you died painlessly';
    } else {
        const uncoveredMines   = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_UNCOVERED ).length;
        const wrongPlacedMines = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_WRONGPLACE).length;
        if ((uncoveredMines===0) && (wrongPlacedMines===0))
            lineA =  'you succesfully cleared the field';
        else {
            if (uncoveredMines>0)
                lineA = `${uncoveredMines} mines were left uncovered`;
            if (wrongPlacedMines>0)
                lineB = `${wrongPlacedMines} flags were wrongly placed`;
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

