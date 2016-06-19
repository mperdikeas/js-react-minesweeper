'use strict';
const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
const React = require('react');
var      cx = require('classnames');

import {CELL_SIZE} from './constants.js';

class CellCoord {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
    cellsAround(height, width) {
        const rv = [];
        const i = this.i;
        const j = this.j;
        if (i>0)                         rv.push(new CellCoord(this.i-1, this.j  ));
        if (i<height-1)                  rv.push(new CellCoord(this.i+1, this.j  ));
        if (j>0)                         rv.push(new CellCoord(this.i  , this.j-1));
        if (j<width-1)                   rv.push(new CellCoord(this.i  , this.j+1));
        if ((i>0) && (j>0))              rv.push(new CellCoord(this.i-1, this.j-1));
        if ((i>0) && (j<width-1))        rv.push(new CellCoord(this.i-1, this.j+1));
        if ((i<height-1) && (j>0))       rv.push(new CellCoord(this.i+1, this.j-1));
        if ((i<height-1) && (j<width-1)) rv.push(new CellCoord(this.i+1, this.j+1));
        return rv;
    }
}

class CellState {
    constructor(dug, v, color, imgSrc) {
        this.dug = dug;
        this.v = v;
        this.color = color;
        this.imgSrc = imgSrc;
    }
}
CellState.CLEAR           = new CellState(true  , '' , 'black'  , 'clear.png');
CellState.PROXIMITY1      = new CellState(true  , '1', 'lime'   , 'clear.png');
CellState.PROXIMITY2      = new CellState(true  , '2', 'yellow' , 'clear.png');
CellState.PROXIMITY3      = new CellState(true  , '3', 'fuchsia', 'clear.png');
CellState.PROXIMITY4      = new CellState(true  , '4', 'red'    , 'clear.png');
CellState.PROXIMITY5      = new CellState(true  , '5', 'red'    , 'clear.png');
CellState.PROXIMITY6      = new CellState(true  , '6', 'red'    , 'clear.png');
CellState.PROXIMITY7      = new CellState(true  , '7', 'red'    , 'clear.png');
CellState.PROXIMITY8      = new CellState(true  , '8', 'red'    , 'clear.png');
CellState.UNKNOWN         = new CellState(false , null, null    , 'undug.png');
CellState.BOMB            = new CellState(false , null, null    , 'mine.png');
CellState.BOMB_FATALITY   = new CellState(false , null, null    , 'mine-fatality.png');
CellState.FLAG            = new CellState(false , null, null    , 'flag.png');
CellState.BOMB_UNCOVERED  = new CellState(false , null, null    , 'mine-uncovered.png');
CellState.BOMB_WRONGPLACE = new CellState(false , null, null    , 'mine-wrong-position.png');
CellState.forProximity = function(n) {
    switch (n) {
    case 0: return CellState.CLEAR;
    case 1: return CellState.PROXIMITY1;
    case 2: return CellState.PROXIMITY2;
    case 3: return CellState.PROXIMITY3;
    case 4: return CellState.PROXIMITY4;
    case 5: return CellState.PROXIMITY5;
    case 6: return CellState.PROXIMITY6;
    case 7: return CellState.PROXIMITY7;
    case 8: return CellState.PROXIMITY8;
    default:
        throw new Error(n);
    }
};

const Cell=React.createClass({

    propTypes: {
        gridKey   : React.PropTypes.instanceOf(CellCoord).isRequired,
        x         : React.PropTypes.number.isRequired,
        y         : React.PropTypes.number.isRequired,
        cellState : React.PropTypes.instanceOf(CellState).isRequired,
        dig       : React.PropTypes.func.isRequired,
        toggleFlag: React.PropTypes.func.isRequired
    },
    dig: function () {
        this.props.dig(this.props.gridKey);
    },
    toggleFlag: function(e) {
        console.log(e.type);
        e.preventDefault();
        this.props.toggleFlag(this.props.gridKey);
    },
    render: function () {
        // position of clipped code
        const style = {position: 'absolute',
                        top: this.props.y,
                        left: this.props.x,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        border: '1px solid black',
                        color: 'black',
                        background: 'transparent',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '160%',
                        verticalAlign: 'middle',
                        lineHeight: `${CELL_SIZE}px`
                      };
        const mark = (()=>{
            if (this.props.cellState.dug) {
                const spanStyle={position: 'absolute',
                                 top: 2,
                                 left: 12,
                                 color: this.props.cellState.color
                                };
                return (
                        <span style={spanStyle}>{this.props.cellState.v}</span>       
                );
            } else
                return null;
        })();
        return (
                <div style={style}
                     onClick={this.dig}
                     onContextMenu={this.toggleFlag}>
                {mark}
                <img width={CELL_SIZE} height={CELL_SIZE} src={require(`./assets/${this.props.cellState.imgSrc}`)}/>
                </div>
        );
    }

});

module.exports = {Cell      : Cell,
                  CellState : CellState,
                  CellCoord : CellCoord
                 };


/*        
        const style = {position: 'absolute',
                       top: this.props.y,
                       left: this.props.x,
                       width: CELL_SIZE,
                       height: CELL_SIZE,
                       border: '1px solid black',
                       color: this.props.cellState.color,
                       background: this.props.cellState.background,
                       textAlign: 'center',
                       fontWeight: 'bold',
                       fontSize: '160%',
                       verticalAlign: 'middle',
                       lineHeight: `${CELL_SIZE}px`
                      };
        const old = (
                <div style={style}
                     onClick={this.dig}
                     onContextMenu={this.toggleFlag}
                >
                {this.props.cellState.v}
                </div>
        );
        const old2 = (
                <img style={style2} width={CELL_SIZE} height={CELL_SIZE} src={require('./assets/clear.png')}/>
        );
            const style2 = {position: 'absolute',
                       top: this.props.y,
                       left: this.props.x,
                       width: CELL_SIZE,
                       height: CELL_SIZE,
                       border: '1px solid black',
                            color: 'black',
                            background: 'transparent',
                       textAlign: 'center',
                       fontWeight: 'bold',
                       fontSize: '160%',
                       verticalAlign: 'middle',
                            lineHeight: `${CELL_SIZE}px`,
                            backgroundImage2: "url(https://avatars3.githubusercontent.com/u/1309179?v=3&s=200)",
                            backgroundImage: "url(assets/mine.png)"
                           };
        */
