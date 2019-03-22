import React, { Component } from 'react';
import { Modal } from 'antd';
import { createParticleAnimate } from '../utility/particle';

class ModalWin extends Component {
  state = {
    visible: true
  }
    
  componentDidMount() {
    setTimeout(()=> {
      createParticleAnimate('fireworks');
    }, 0);
  }

  handleOk = () => {
    this.setState({
      visible: false
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <Modal
        className="modal-win"
        title="You Win"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      > 
        <div className="congrats-text">Congrats!</div>
        <canvas id="fireworks"></canvas>
      </Modal>
    )
  }
}

export default ModalWin;