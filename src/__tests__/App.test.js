import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from '../App';
import minesReducer, * as actions from '../reducers/minesReducer';
import ConnectMinesweeper, { Minesweeper } from '../containers/Minesweeper'
import { Panel } from '../containers/Panel';
import { Timer } from '../containers/Timer';

configure({ adapter: new Adapter() });

describe('<App /> ---- Init state', () => {
  let store, wrapper;
  beforeEach(() => {
    store = createStore(minesReducer);
    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  it('Init state is correctly', () => {
    let grid = wrapper.find(Minesweeper).prop('grid');
    expect(grid.length).toBe(9);
    expect(grid[0].length).toBe(9);
    expect(wrapper.find(Panel).prop('mineNum')).toBe(10);
    expect(wrapper.find(Timer).find('.info-num').html()).toEqual('<span class="info-num">0</span>');
  });
});

describe('<App /> ---- Change Level', () => {
  let store, wrapper;
  store = createStore(minesReducer);
  store.dispatch(actions.changeGameLevelAction({size: 12, mineNum: 15}));
  store.dispatch(actions.reStartAction());
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })
  it('Switch medium levle', () => {
    expect(wrapper.find(Minesweeper).prop('grid').length).toBe(12);
    expect(wrapper.find(Panel).prop('mineNum')).toBe(15);
  });
});

describe('Test reducers', () => {
  /*
    init 3*3 grid
    0 0 0
    2 2 1
    * * 1
  */
  let grid = [[
    {id: 1, aroundMines: 0, isMine: false, x: 0, y: 0, opened: false, flaged: false},
    {id: 2, aroundMines: 0, isMine: false, x: 1, y: 0, opened: false, flaged: false},
    {id: 3, aroundMines: 0, isMine: false, x: 2, y: 0, opened: false, flaged: false}
  ],[
    {id: 4, aroundMines: 2, isMine: false, x: 0, y: 1, opened: false, flaged: false},
    {id: 5, aroundMines: 2, isMine: false, x: 1, y: 1, opened: false, flaged: false},
    {id: 6, aroundMines: 1, isMine: false, x: 2, y: 1, opened: false, flaged: false}
  ],[
    {id: 7, aroundMines: 0, isMine: true, x: 0, y: 2, opened: false, flaged: false},
    {id: 8, aroundMines: 0, isMine: true, x: 1, y: 2, opened: false, flaged: false},
    {id: 9, aroundMines: 1, isMine: false, x: 2, y: 2, opened: false, flaged: false}
  ]];
  let initState = {
    grid,
    size: 3,
    mineNum: 2,
    digMine: false,
    winGame: false,
    gameStart: false,
    toggleTimerCount: false
  }

  it('click row 0, col 0', () => {
    let store = createStore(minesReducer, JSON.parse(JSON.stringify(initState)));
    store.dispatch(actions.openMineAction({x: 0, y: 0}));
    let grid = store.getState().grid;
    expect(grid[0][0].opened).toBe(true);
    expect(grid[0][1].opened).toBe(true);
    expect(grid[0][2].opened).toBe(true);
    expect(grid[1][0].opened).toBe(true);
    expect(grid[1][1].opened).toBe(true);
    expect(grid[1][2].opened).toBe(true);
    expect(grid[2][0].opened).toBe(false);
    expect(grid[2][1].opened).toBe(false);
    expect(grid[2][2].opened).toBe(false);

    store.dispatch(actions.openMineAction({x: 2, y: 2}));
    expect(store.getState().winGame).toBe(true);
  });

  it('click row 2, col 0', () => {
    let store = createStore(minesReducer, JSON.parse(JSON.stringify(initState)));
    store.dispatch(actions.openMineAction({x: 2, y: 0}));
    let grid = store.getState().grid;
    expect(grid[0][0].opened).toBe(false);
    expect(grid[0][1].opened).toBe(false);
    expect(grid[0][2].opened).toBe(false);
    expect(grid[1][0].opened).toBe(false);
    expect(grid[1][1].opened).toBe(false);
    expect(grid[1][2].opened).toBe(false);
    expect(grid[2][0].opened).toBe(true);
    expect(grid[2][1].opened).toBe(false);
    expect(grid[2][2].opened).toBe(false);
    expect(store.getState().digMine).toBe(true);
  });
});