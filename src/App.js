import React, { Component } from 'react';
import Minesweeper from './containers/Minesweeper';
import Panel from './containers/Panel';
import './App.css';
import 'animate.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Panel />       
        <Minesweeper/>
      </div>
    );
  }
}

export default App;
