import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clock from '../imgs/passage-of-time.svg';
import store from 'store';

export class Timer extends Component {
  
  static propTypes = {
    gameStart: PropTypes.bool,
    winGame: PropTypes.bool,
    digMine: PropTypes.bool,
    toggleTimerCount: PropTypes.bool
  }

  state = {
    timer: null,
    counter: 0
  }
  
  componentWillReceiveProps(nextPops) {
    if (nextPops.gameStart && !nextPops.digMine && !nextPops.winGame) {
      const timer = setInterval(this.tick.bind(this), 1000);
      this.setState({ timer });
    }

    if (nextPops.digMine || nextPops.winGame) {
      const gameRecords = store.get('gameRecords') || [];
      const date = new Date();
      const dateStr = date.getMonth() +'/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      const record = {date: dateStr, duration: this.state.counter || 1};
      if (nextPops.digMine) {
        gameRecords.push({status: 'fail', ...record});
      }
      if (nextPops.winGame) {
        gameRecords.push({status: 'win', ...record});
      }
      store.set('gameRecords', gameRecords);
      clearInterval(this.state.timer);
    }

    if (this.props.toggleTimerCount!==nextPops.toggleTimerCount) {
      clearInterval(this.state.timer);
      this.setState({ counter: 0});
    }
  }

  componentWillMount() {
    clearInterval(this.state.timer);
  }

  tick() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <span className="info-span">
        <img style={{width: 30}} src={clock} alt="clock"/>
        <span className="info-num">{this.state.counter}</span>
      </span>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gameStart: state.gameStart,
    winGame: state.winGame,
    digMine: state.digMine,
    toggleTimerCount: state.toggleTimerCount
  }
}

export default connect(
  mapStateToProps
)(Timer)