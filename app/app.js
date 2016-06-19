'use strict';
require('./app.css');
const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
const React = require('react');
var      cx = require('classnames');
import assert                                    from 'assert';
import {CellState, CellCoord}                    from './cell.js';
import {CELL_SIZE, UNICODE_NON_BREAKING_SPACE}   from './constants.js';
import GameInfo                                  from './game-info.js';
import MinefieldDumb                             from './minefield-dumb.js';
import GameState                                 from './game-state.js';
import GameEndMsg                                from './game-end-message.js';
import TwoLiner                                  from './two-liner.js';


function initialLayOfLand(H, W) {
   const rv = [];
    for (let i =0 ; i < H ; i++) {
        let row = [];
        for (let j = 0 ; j < W ; j++) {
            row.push(CellState.UNKNOWN);
        }
        rv.push(row);
    }
    return rv;
}


function plantMines (H, W, coverage) {
    const rv = [];
    for (let i =0 ; i < H ; i++) {
        let row = [];
        for (let j = 0 ; j < W ; j++) {
            let r = Math.random();
            row.push(Math.random()<=coverage
                     ?true
                     :false);
        }
        rv.push(row);
    }
    return rv;
}

    

function clone2DArr(arr) {
    return arr.map( (x)=> x.slice() );
}

function minesNearby(mines, where) {
    const cellsAround = where.cellsAround(mines.length, mines[0].length);
    let rv = 0;
    for (let i = 0 ; i < cellsAround.length ; i++) {
        if (mines[cellsAround[i].i][cellsAround[i].j])
            rv++;
    }
    return rv;
}

const App = React.createClass({
    propTypes: {
        width : React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        mineCoverage: React.PropTypes.number.isRequired
    },
    getInitialState() {
        return {
            mines: plantMines(this.props.height, this.props.width, this.props.mineCoverage),
            land: initialLayOfLand(this.props.height, this.props.width),
            gameState: GameState.RUNNING
        };
    },
    coordsThatCanBeSafelyDug(land, where) {
        const that = this;
        function rec(land, where, cellsAlreadyVisited, accum, firstCall) {
            if (!firstCall)
                accum.push(where);
            cellsAlreadyVisited.push(where);
            const numOfMinesNearby = minesNearby(that.state.mines, where);
            if (numOfMinesNearby===0) {
                const cellsAround = where.cellsAround(land.length, land[0].length);
                for (let i = 0 ; i < cellsAround.length ; i++) {
                    if (!_.some(cellsAlreadyVisited, (x)=>( (x.i===cellsAround[i].i) &&
                                                            (x.j===cellsAround[i].j) ))) {
                        rec(land, cellsAround[i], cellsAlreadyVisited, accum, false);
                    }
                }
            }
        }
        const accum = [];
        rec(land, where, [], accum, true);
        return accum;
    },
    presentSolution(fatalityWhere) {
        const lastStateOnTheGround = clone2DArr(this.state.land);
        if (fatalityWhere)
            lastStateOnTheGround[fatalityWhere.i][fatalityWhere.j] = CellState.BOMB_FATALITY;
        const newLand = clone2DArr(this.state.land);
        for (let i = 0 ; i < newLand.length ; i ++) {
            for (let j = 0 ; j < newLand[0].length ; j++) {
                assert(newLand[i][j]!=CellState.BOMB_UNCOVERED);
                assert(newLand[i][j]!=CellState.BOMB_WRONGPLACE);
                if ((fatalityWhere!=null) && (i===fatalityWhere.i) && (j===fatalityWhere.j)) {
                    newLand[i][j]=CellState.BOMB_FATALITY;
                } else {
                    
                    if (!newLand[i][j].dug) {
                        if (newLand[i][j]===CellState.FLAG) {
                            if (this.state.mines[i][j])
                                newLand[i][j]=CellState.BOMB;
                            else
                                newLand[i][j]=CellState.BOMB_WRONGPLACE;
                        } else {
                            if (newLand[i][j]===CellState.UNKNOWN) {
                                if (this.state.mines[i][j])
                                    newLand[i][j]=CellState.BOMB_UNCOVERED;
                                else
                                    newLand[i][j]=CellState.CLEAR;
                            }
                        }
                    }
                }
            }
        }
        this.setState({lastStateOnTheGround: lastStateOnTheGround,
                       land: newLand,
                       gameState: GameState.RESULTS,
                       fatality: fatalityWhere!=null});

    },
    newGame() {
        this.setState(this.getInitialState());
    },
    dig(where) {
        const newLand = clone2DArr(this.state.land);
        if (this.state.mines[where.i][where.j]) {
            this.presentSolution(where);
        } else {
            const numOfMinesNearby = minesNearby(this.state.mines, where);
            newLand[where.i][where.j]=CellState.forProximity(numOfMinesNearby);
            const additionalCellCoords = this.coordsThatCanBeSafelyDug(newLand, where);

            if (false)
                console.log(`Digging on ${JSON.stringify(where)} these ${additionalCellCoords.length} additional cells: ${JSON.stringify(additionalCellCoords)} maybe safely discovered`);
            for (let i = 0; i < additionalCellCoords.length ; i++) {
                const di = additionalCellCoords[i].i;
                const dj = additionalCellCoords[i].j;
                assert(this.state.mines[di][dj]===false);
                const numOfMinesNearby2 = minesNearby(this.state.mines, additionalCellCoords[i]);
                newLand[di][dj]=CellState.forProximity(numOfMinesNearby2);
            }
            this.setState({land: newLand});
        }
    },
    toggleFlag(where) {
        const newLand = clone2DArr(this.state.land);
        if (newLand[where.i][where.j]===CellState.UNKNOWN)
            newLand[where.i][where.j]=CellState.FLAG;
        else if (newLand[where.i][where.j]===CellState.FLAG)
            newLand[where.i][where.j]=CellState.UNKNOWN;
        else
            console.log('you cant flag here'); // this has to be recorded at a message
        this.setState({land: newLand});
    },
    minesLeft() {
        const numOfMines        = _.filter([].concat.apply([], this.state.mines), (x)=>x).length;
        const numOfMinesFlagged = _.filter([].concat.apply([], this.state.land), (x)=>x===CellState.FLAG).length;
        return numOfMines - numOfMinesFlagged;
    },
    done() {
        this.presentSolution();
    },
    timeOver() {
        this.presentSolution();
    },
    showLastState() {
        assert(this.state.lastStateOnTheGround);
        assert(this.state.gameState===GameState.RESULTS);
        this.setState({gameState: GameState.REVEAL_LAST,
                       land: this.state.lastStateOnTheGround,
                       lastStateOnTheGround: this.state.land});
    },
    revertLastState() {
        assert(this.state.lastStateOnTheGround);
        assert(this.state.gameState===GameState.REVEAL_LAST);
        this.setState({
            gameState: GameState.RESULTS,
            land: this.state.lastStateOnTheGround,
            lastStateOnTheGround: this.state.land});        
    },
    render: function() {
        const gameInfo = (()=>{
            switch (this.state.gameState) {
                case GameState.RUNNING:
                return (
                        <GameInfo
                            minesLeft={this.minesLeft()}
                            secsAllowed={120}
                            timeOver={this.timeOver}
                        />
                );
            case GameState.RESULTS:
                return (
                        <GameEndMsg
                            land={this.state.land}
                        />
                );
            case GameState.REVEAL_LAST:                
                return (
                    <TwoLiner
                        lineA = {UNICODE_NON_BREAKING_SPACE}
                        lineB = {UNICODE_NON_BREAKING_SPACE}
                    />
                );
            default:
                throw new Error();
            }
        })();
        const button = (()=>{
            switch (this.state.gameState) {
            case GameState.RUNNING:
                return (<button id='btn-done-ng' onClick={this.done}>I'm done!</button>);
            case GameState.RESULTS:
            case GameState.REVEAL_LAST:
                return (<button id='btn-done-ng' onClick={this.newGame}>New game</button>);
            default:
            throw new Error();
            }
        })();
        const toggleLastStateButton = (()=>{
        switch (this.state.gameState) {
            case GameState.RESULTS:
            case GameState.REVEAL_LAST:
                return (
                    <button id='btn-toggle' onMouseDown={this.showLastState} onMouseUp={this.revertLastState}>
                        reveal last state
                    </button>
                );
                default:
                    return null;
            }
        })();
        return (
                <div>
                {gameInfo}
                <MinefieldDumb
                    land       = {this.state.land}
                    dig        = {this.dig}
                    toggleFlag = {this.toggleFlag}
                />
                {button}{toggleLastStateButton}
                </div>                
        );
    }
});

export default App;

