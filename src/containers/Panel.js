import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shortid from 'shortid';
import { Button, Select } from 'antd';
import smile from '../imgs/smile.svg';
import confused from '../imgs/confused.svg';
import { 
  reStartAction,
  changeGameLevelAction
} from '../reducers/minesReducer';
import Timer from './Timer';
import MinesInfo from '../components/MinesInfo';
import ModalWin from '../components/ModalWin';
import ModalFail from '../components/ModalFail';

const Option = Select.Option;

export class Panel extends Component {
  static propTypes = {
    mineNum: PropTypes.number,
    digMine: PropTypes.bool,
    winGame: PropTypes.bool,
    reStartGame: PropTypes.func
  }

  componentWillReceiveProps(nextPops) {
    if (nextPops.winGame) {
      setTimeout(this.showWinModal.bind(this), 300);
    }
    if (nextPops.digMine) {
      setTimeout(this.showFailModal.bind(this), 1200);
    }
  }

  handleLevelChange = (value) => {
    const levleMap = {
      'easy': {size: 8, mineNum: 10},
      'medium': {size: 12, mineNum: 15},
      'hard': {size: 15, mineNum: 30}
    };
    this.props.changeGameLevel && this.props.changeGameLevel(levleMap[value]); 
  }
  
  showWinModal() {
    ReactDOM.render(
      <ModalWin
        key={shortid.generate()}
      />,
      ReactDOM.findDOMNode(this.modalContainer)
    );
  }

  showFailModal() {
    ReactDOM.render(
      <ModalFail
        key={shortid.generate()}
      />,
      ReactDOM.findDOMNode(this.modalContainer)
    );
  }

  render() {
    const { mineNum, reStartGame, digMine } = this.props;
    return (
      <div style={{marginTop: 30}}>
        <Select defaultValue="easy" style={{ width: 270 }} onChange={this.handleLevelChange}>
          <Option value="easy">Easy - Grid (8 x 8), Mines (10)</Option>
          <Option value="medium">Medium - Grid (12 x 12), Mines (15)</Option>
          <Option value="hard">Hard - Grid (15 x 15),  Mines (30)</Option>
        </Select>
        <p style={{marginTop: 15}}>
          <MinesInfo mineNum={mineNum}/>
          <Button onClick={reStartGame} size="large">
            <img 
              className={classNames({"hide": digMine, "animated rotateIn": !digMine})} 
              style={{width: 30}} src={smile} alt="smile"
            />
            <img 
              className={classNames({"hide": !digMine, "animated rotateIn": digMine})} 
              style={{width: 30}} src={confused} alt="confused"
            />
          </Button>
          <Timer />
        </p>
        <div ref={(modalContainer) => this.modalContainer = modalContainer}></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mineNum: state.mineNum,
    digMine: state.digMine,
    winGame: state.winGame
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reStartGame: () => {
      dispatch(reStartAction());
    },
    changeGameLevel: (level) => {
      dispatch(changeGameLevelAction(level));
      dispatch(reStartAction());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);