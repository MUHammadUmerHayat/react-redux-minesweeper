const initialState = {
  grid: [],
  size: 9,
  mineNum: 10,
  digMine: false,
  winGame: false,
  gameStart: false,
  toggleTimerCount: false
};


const minesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_MINE': {
      const { grid, digMine, winGame } = openMine(state.grid, action.coord, state.mineNum);
      return {
        ...state,
        grid,
        digMine,
        winGame
      }
    }
    case 'TOGGLE_FLAG': {
      const grid = toggleFlag(state.grid, action.coord);
      return {
        ...state,
        grid
      }
    }
    case 'RESTART': {
      const grid = createGrid(state.size, state.mineNum);
      return {
        ...state,
        grid,
        gameStart: false,
        digMine: false,
        winGame: false,
        toggleTimerCount: !state.toggleTimerCount
      }
    }
    case 'CHANGE_GAME_LEVEL': {
      return {
        ...state,
        size: action.size,
        mineNum: action.mineNum
      }
    }
    case 'TRIGGER_GAME_START': {
      return {
        ...state,
        gameStart: true
      }
    }
    default:
      return state;
  }
}

const createGrid = (size, mineNum) => {
  const grid = [];
  for (let i=0; i<size; i++) {
    grid[i] = [];
    for(let j=0; j<size; j++) {
      grid[i][j] = {
        id: (i+1)*(j+1),
        aroundMines: 0,
        isMine: false,
        x: i,
        y: j,
        opened: false,
        flaged: false
      };
    }
  }
  layMines(grid, mineNum)
  setNumber(grid);
  return grid;
}

const layMines = (grid, num) => {
  const size = grid.length;
  while(num>0) {
    let row = Math.floor(Math.random()*size);
    let col = Math.floor(Math.random()*size);
    // console.log('try row,col', row+','+col);
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      // console.log('mine row,col------------------', row+','+col);
      num--;
    }
  }
}

const setNumber = (grid) => {
  const size = grid.length;
  for (let i=0; i<size; i++) {
    for (let j=0; j<size; j++) {
      if (grid[i][j].isMine) {
        continue;
      } else {
        const resultObj = { count: 0 };
        const boundaries = [
          [i-1, j-1],
          [i,   j-1],
          [i+1, j-1],
          [i-1, j, ],
          [i+1, j, ],
          [i-1, j+1],
          [i,   j+1],
          [i+1, j+1]
        ];
        boundaries.forEach(coord => {
          boundaryDetect(grid, coord[0], coord[1], resultObj);
        });
        grid[i][j].aroundMines = resultObj.count;
      }
    }
  }
}

const boundaryDetect = (grid,i,j, resultObj) => {
  const size = grid.length;
  if (i>=0 && j>=0 && i<size && j<size && grid[i][j].isMine) {
    resultObj.count++;
  }
}

const openMine = (oldgrid, {x, y}, mineNum) => {
  const grid = [...oldgrid];
  let digMine = false;
  let winGame = false;
  if (!grid[x][y].opened && !grid[x][y].flaged) {
    grid[x][y].opened = true;
    if (grid[x][y].isMine) {
      console.log('find mine, game over!');
      digMine = true;
    }
    if (grid[x][y].aroundMines===0&&!grid[x][y].isMine) {
      openZeroMine(grid, x, y);
    }
  }
  if (checkUnopenedGrid(grid)===mineNum) {
    console.log('you wine !!!!!!!!!!');
    winGame = true;
  }
  return { grid, winGame, digMine };
}

const openZeroMine = (grid, x, y) => {
  grid[x][y].zeroVisited = true;
  const boundaries = [
    [x-1, y-1],
    [x,   y-1],
    [x+1, y-1],
    [x-1, y],
    [x+1, y],
    [x-1, y+1],
    [x,   y+1],
    [x+1, y+1]
  ].filter(coord => !isOutBoundary(grid, coord[0], coord[1]));

  boundaries.forEach(coord => {
    if (!grid[coord[0]][coord[1]].opened && !grid[coord[0]][coord[1]].flaged) {
      grid[coord[0]][coord[1]].opened = true;
    }
  });
  
  boundaries.forEach(coord => {
    const gridItem = grid[coord[0]][coord[1]];
    if (gridItem.aroundMines===0 && !gridItem.zeroVisited) {
      openZeroMine(grid, coord[0], coord[1]);
    }
  });

}

const checkUnopenedGrid = (grid) => {
  const size = grid.length;
  let count = 0;
  for (let i=0; i<size; i++) {
    for (let j=0; j<size; j++) {
      if (!grid[i][j].opened) count++
    }
  }
  return count;
}

const isOutBoundary = (grid, x, y) => {
  const size = grid.length;
  if (x>=0 && y>=0 && x<size && y<size) {
    return false;
  } else {
    return true;
  }
}

const toggleFlag = (oldgrid, {x, y}) => {
  const grid = [...oldgrid];
  if (!grid[x][y].opened) {
    grid[x][y].flaged = !grid[x][y].flaged;
  }
  return grid;
} 

export default minesReducer;

export const reStartAction = () => {
  return {type: 'RESTART'}
}

export const openMineAction = (coord) => {
  return {type: 'OPEN_MINE', coord}
}

export const toggleFlagAction = (coord) => {
  return {type: 'TOGGLE_FLAG', coord}
}

export const changeGameLevelAction = ({size, mineNum}) => {
  return {type: 'CHANGE_GAME_LEVEL', size, mineNum}
}

export const beforeGameStartAction = () => {
  return function (dispatch, getState) {
    if (getState().gameStart) {
      return
    } else {
      dispatch(triggerGameStartAction());
    }
  }
}

export const triggerGameStartAction = () => {
  return {type: 'TRIGGER_GAME_START'}
}