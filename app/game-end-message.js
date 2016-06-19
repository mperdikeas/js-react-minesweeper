const React = require('react');
import assert from 'assert';
import {CellState} from './cell.js';



const GameEndMsg = function (props) {
    let msg;
    if (_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length>0) {
        assert(_.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_FATALITY).length==1);
        msg = 'You leave a hideous corpse but you otherwise die painlessly';
    } else {
        const uncoveredMines   = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_UNCOVERED ).length;
        const wrongPlacedMines = _.filter([].concat.apply([], props.land), (x)=>x===CellState.BOMB_WRONGPLACE).length;
        if ((uncoveredMines===0) && (wrongPlacedMines===0))
            msg =  'you succesfully cleared the field';
        else {
            const failMsgs = [];
            if (uncoveredMines>0)
                failMsgs.push(`${uncoveredMines} mines were left uncovered`);
            if (wrongPlacedMines>0)
                failMsgs.push(`${wrongPlacedMines} flags were wrongly placed`);
            msg = failMsgs.join(', ');
        }
    }
    return (<div>{msg}</div>);    
};


export default GameEndMsg;

