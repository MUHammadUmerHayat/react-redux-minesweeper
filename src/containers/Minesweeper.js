import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cell from './Cell';
import QueueAnim from 'rc-queue-anim';
import { 
  reStartAction,
  openMineAction,
  toggleFlagAction,
  beforeGameStartAction,
} from '../reducers/minesReducer';

export class Minesweeper extends Component {

  static propTypes = {
    grid: PropTypes.array,
    initGrid: PropTypes.func,
    openMine: PropTypes.func,
    digMine: PropTypes.bool,
    winGame: PropTypes.bool,
    toggleFlag: PropTypes.func
  }

  componentDidMount() {
    this.props.initGrid();
  }

  render() {
    const { grid, openMine, toggleFlag, digMine, winGame } = this.props;
    return (
      <div className="mines-container">
        <QueueAnim interval={120} duration={1000}>
          {grid.map((row, index) => (
            <div key={index} className="mine-row">
              {row.map(cell => (
                <Cell 
                  key={cell.id} 
                  openMine={openMine}
                  digMine={digMine}
                  winGame={winGame}
                  toggleFlag={toggleFlag}
                  cell={cell} 
                />
              ))}
            </div>
          ))}
        </QueueAnim>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    grid: state.grid,
    digMine: state.digMine,
    winGame: state.winGame
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initGrid: () => {
      dispatch(reStartAction());
    },
    openMine: (coord) => {
      dispatch(beforeGameStartAction());
      dispatch(openMineAction(coord));
    },
    toggleFlag: (coord) => {
      dispatch(toggleFlagAction(coord))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Minesweeper);