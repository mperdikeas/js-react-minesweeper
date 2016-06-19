const     _ = require('lodash');
const utils = require('./scripts/util.js');
const     $ = require('jquery');
const React = require('react');
var      cx = require('classnames');
import assert from 'assert';
import {Cell, CellCoord} from './cell.js';
import {CELL_SIZE}  from './constants.js';



const MinefieldDumb = React.createClass({
    propTypes: {
        land       : React.PropTypes.array.isRequired,
        dig        : React.PropTypes.func.isRequired,
        toggleFlag : React.PropTypes.func.isRequired
    },
    render: function() {
        const cells = [];
        for (let i = 0 ; i < this.props.land.length ; i++) {
            for (let j = 0; j < this.props.land[0].length ; j++) {
                const GRID_KEY = new CellCoord(i, j);
                cells.push(
                        <Cell
                           key     = {`${i}-${j}`}
                           gridKey = {GRID_KEY}
                           cellState = {this.props.land[i][j]}
                           x= {j*CELL_SIZE}
                           y={i*CELL_SIZE}
                           dig={this.props.dig}
                           toggleFlag={this.props.toggleFlag}
                        />
                          );
            }
        }
        const containerStyle = {position: 'relative',
                                width: this.props.land[0].length*CELL_SIZE,
                                height: this.props.land.length*CELL_SIZE
                               };
        return (
            <div style={containerStyle}>
                {cells}
            </div>
        );
    }


});

export default MinefieldDumb;

