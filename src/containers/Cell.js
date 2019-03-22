import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bomb from '../imgs/bomb.svg';
import flag from '../imgs/flag.svg';
import classNames from 'classnames';

class Cell extends Component {
  
  static propTypes = {
    cell: PropTypes.object,
    openMine: PropTypes.func,
    toggleFlag: PropTypes.func,
    digMine: PropTypes.bool,
    winGame: PropTypes.bool
  }

  handleGridClick = () => {
    const { cell, openMine, digMine, winGame } = this.props;
    if (!digMine && !winGame) {
      openMine && openMine({x:cell.x, y:cell.y});
    }
  }

  handleFlagClick = (evt) => {
    evt.preventDefault();
    const { cell, toggleFlag } = this.props;
    toggleFlag && toggleFlag({x:cell.x, y:cell.y});
  }

  render() {
    const { cell } = this.props;
    const isBombCls = cell.opened && cell.isMine;
    const isZeroMineCls = cell.opened && !cell.isMine && cell.aroundMines===0;
    return (
      <div 
        className={
          classNames("cell", {
            "opened": cell.opened, 
            "unopened": !cell.opened, 
            "bomb": isBombCls, 
            "zero-mine": isZeroMineCls
          })
        }
        onClick={this.handleGridClick}
        onContextMenu={this.handleFlagClick}
      > 
        <img 
          src={flag} 
          alt="flag" 
          className={classNames({"hide": !cell.flaged, "animated bounce": cell.flaged})}
        />
        <div className={classNames({"hide": !cell.opened, 'animated bounceIn': cell.opened&&!cell.isMine})}>
          {cell.isMine ? 
            <img 
              className={classNames({"animated shake": cell.opened})} 
              src={bomb} alt="bomb"
            /> :
            <span 
              className={`countNum color${cell.aroundMines}`}
            >
              {cell.aroundMines ? cell.aroundMines : null}
            </span>
          }
        </div>
      </div>
    )
  }
}

export default Cell;