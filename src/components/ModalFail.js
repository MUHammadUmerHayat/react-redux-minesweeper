import React, { Component } from 'react';
import { Modal } from 'antd';
import Echarts from 'echarts';
import ReactDOM from 'react-dom';
import store from 'store';

class ModalFail extends Component {
  state = {
    visible: true
  }

  componentDidMount() {
    setTimeout(this.createChart.bind(this), 150);
  }
  
  createChart() {
    const colorMap = {
      'fail': 'red',
      'win': '#00FF00'
    };
    const myChart = Echarts.init(ReactDOM.findDOMNode(this.chartContainer));
    const gameRecords = store.get('gameRecords');
    const xAxisData = gameRecords.map(record => record.date);
    const option = {
      title: {
        text: 'Your Game Records',
        left: 'center'
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
            show: false
        }
      },
      yAxis: {
        name: 'Duration/sec'
      },
      series: [{
        type: 'bar',
        barMaxWidth: 30,
        data: gameRecords.map(record => ({
          value: record.duration,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: colorMap[record.status]
            }
          }
        })),
        animationDelay: function (idx) {
          return idx * 10;
        }
      }],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
    myChart.setOption(option);
  }

  handleOk = () => {
    this.setState({
      visible: false
    });
    store.set('gameRecords', []);
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <Modal
        title="Game Over"
        visible={this.state.visible}
        onOk={this.handleOk}
        okText="Clear History"
        onCancel={this.handleCancel}
      >
        <div 
          style={{height: 400}} 
          ref={(chartContainer) => this.chartContainer = chartContainer}
        >
        </div>
      </Modal>
    )
  }
}

export default ModalFail;