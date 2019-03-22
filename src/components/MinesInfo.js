import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bomb from '../imgs/bomb.svg';

export class MinesInfo extends Component {
  static propTypes = {
    mineNum: PropTypes.number
  }

  render() {
    const { mineNum } = this.props;
    return (
      <span className="info-span">
        <img style={{width: 30}} src={bomb} alt="bomb"/>
        <span className="info-num">{mineNum}</span>
      </span>
    )
  }
}

export default MinesInfo;