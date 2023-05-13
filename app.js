const logic = 
{
  init()
  {
    state.fieldSize = 10;
    state.bombsCount = 15;
    state.bombsPosition = logic.createBombs();
    state.openedCells = 0;
    state.lose = false;
    state.root = document.documentElement;
    state.root.style.setProperty('--fieldSize', state.fieldSize);
    state.grid = logic.createField(state.fieldSize);
    render.createGrid();
    state.field = logic.createOpenedField();
  },
  
  createField(fieldSize) 
  {
    let field = new Array(fieldSize);
    for (let i = 0; i < fieldSize; i++) 
    {
      field[i] = new Array(fieldSize);
    }
    return field;
  },
  
  getRandomPosition()
  {
    let randX = Math.floor(Math.random() * state.fieldSize);
    let randY = Math.floor(Math.random() * state.fieldSize);
    return {
      x: randX,
      y: randY
    }
  },

  createBombs() 
  {
    let bombsPosition = logic.createField(state.fieldSize);
    let bombsPlaced = 0;
    while(bombsPlaced < state.bombsCount)
    {
      let pos = logic.getRandomPosition();

      if(!bombsPosition[pos.x][pos.y])
      {
        bombsPosition[pos.x][pos.y] = true;
        bombsPlaced++;
      }
    }
    return bombsPosition;
  },
  
  bombsNear(cell)
  {
    let biggerField = logic.createField(state.fieldSize + 2);
    biggerField = logic.copyForBiggerField(state.bombsPosition, biggerField);
    let bombsNear = 0;
    let pos = logic.getCellPosition(cell);
    let x = pos.x + 1;
    let y = pos.y + 1;

    if(!biggerField[x][y])
    {
      if(biggerField[x - 1][y - 1]) bombsNear++;
      if(biggerField[x - 1][y]) bombsNear++;
      if(biggerField[x - 1][y + 1]) bombsNear++;
      if(biggerField[x][y - 1]) bombsNear++;
      if(biggerField[x][y + 1]) bombsNear++;
      if(biggerField[x + 1][y - 1]) bombsNear++;
      if(biggerField[x + 1][y]) bombsNear++;
      if(biggerField[x + 1][y + 1]) bombsNear++;
    }
    else
    {
      return `bomb`;
    }
    return bombsNear;
  },
  
  copyForBiggerField(from, to)
  {
    for (let i = 0; i < from.length; i++) {
      for (let j = 0; j < from.length; j++) {
        if(from[i][j])
        {
          to[i + 1][j + 1] = true;
        }
      }
    }
    return to;
  },
  
  mark()
  {
    render.flag();
    event.target.removeEventListener(`click`, logic.handleLeftClick);
  },
  
  unMark()
  {
    render.unFlag();
    event.target.addEventListener(`click`, logic.handleLeftClick);
  },
  
  addAllClicks()
  {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell) => {
      cell.addEventListener('click', logic.handleLeftClick);
    });
    
    cells.forEach((cell) => {
      cell.addEventListener('contextmenu', logic.handleRightClick);
    });
  },
  
  removeAllClicks()
  {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell) => {
      cell.removeEventListener('click', logic.handleLeftClick);
    });
    
    cells.forEach((cell) => {
      cell.removeEventListener('contextmenu', logic.handleRightClick);
    });
  },

  removeClicks(cell)
  {
    cell.removeEventListener('click', logic.handleLeftClick);
    cell.removeEventListener(`contextmenu`, logic.handleRightClick);
  },
  
  removeContextMenu()
  {
    document.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    });
  },

  getCellPosition(cell)
  {
    return {
      x: parseInt(cell.classList[1][0]),
      y: parseInt(cell.classList[1][1]),
    }
  },

  isBomb(x, y)
  {
    return state.bombsPosition[x][y];
  },

  addScore()
  {
    state.openedCells++;
  },
  
  open(cell)
  {
    let pos = logic.getCellPosition(cell);
    let x = pos.x;
    let y = pos.y;

    if(!logic.isOpened(state.grid[x][y]) && !logic.isFlaged(state.grid[x][y]))
    {
      if(logic.isBomb(x, y))
      {
        state.lose = true;
        render.openedBomb(cell);
        render.loser();
      }
      else
      {
        render.openedNumber(cell);
        logic.addScore();
        logic.removeClicks(cell);
        if(state.field[x][y] == `0`)
        {
          if(x != `0` && y != `0`)
          {
            logic.open(state.grid[x - 1][y - 1]);
          }

          if(x != `0`)
          {
            logic.open(state.grid[x - 1][y]);
          }

          if(x != `0` && y != (state.fieldSize - 1))
          {
            logic.open(state.grid[x - 1][y + 1]);
          }

          if(y != `0`)
          {
            logic.open(state.grid[x][y - 1]);
          }

          if(y != (state.fieldSize - 1))
          {
            logic.open(state.grid[x][y + 1]);
          }

          if(x != (state.fieldSize - 1) && y != `0`)
          {
            logic.open(state.grid[x + 1][y - 1]);
          }

          if(x != (state.fieldSize - 1))
          {
            logic.open(state.grid[x + 1][y]);
          }

          if(x != (state.fieldSize - 1) && y != (state.fieldSize - 1))
          {
            logic.open(state.grid[x + 1][y + 1]);
          }          
        }
      }
    }
  },

  handleLeftClick() {
    if(!logic.isLoser())
    {
      logic.open(event.target);

      if(logic.isWinner())
      {
        logic.removeAllClicks();
        render.winner();
      }
    }
    else
    {
      logic.removeAllClicks();
    }
  },
  
  handleRightClick()
  {
    event.preventDefault();
    if(!logic.isLoser())
    {
      if (logic.isFlaged(event.target))
      {
        logic.unMark();
      }
      else
      {
        logic.mark();
      }
    }
  },

  isLoser()
  {
    return state.lose;
  },

  isFlaged(cell)
  {
    return cell.classList.contains(`flag`);
  },

  isOpened(cell)
  {
    return cell.classList.contains(`opened`);
  },

  isWinner()
  {
    return (state.openedCells == (state.fieldSize**2 - state.bombsCount));
  },

  createOpenedField()
  {
    let field = logic.createField(state.fieldSize);
    for (let i = 0; i < state.fieldSize; i++) 
    {
      for (let j = 0; j < state.fieldSize; j++) 
      {
        field[i][j] = logic.bombsNear(state.grid[i][j]);
      }
    }
    return field;
  },

  startGame()
  {
    logic.init();
    render.field(state.field);
    logic.removeContextMenu();
    logic.addAllClicks();
  },

};
  
const render = 
{
  field(field) 
  {
    for (let i = 0; i < field.length; i++) 
    {
      console.log(field[i]);
    }
    console.log(``);
  },

  openedNumber(cell)
  {
    cell.querySelector(`.num`).style.zIndex = `0`;
    cell.style.backgroundColor = `white`;
    cell.classList.add(`opened`);
  },

  openedBomb(cell)
  {
    cell.querySelector(`.vis`).style.zIndex = `0`;
    cell.style.backgroundColor = `red`;
  },

  winner()
  {
    document.querySelector(`.playground`).style.backgroundColor = `#d1ffb7`;
  },
  
  loser()
  {
    document.querySelector(`.playground`).style.backgroundColor = `#ffb7b7`;
    render.showBomb();
  },

  showBomb()
  {
    for (let i = 0; i < state.fieldSize; i++) 
    {
      for (let j = 0; j < state.fieldSize; j++) 
      {
        if(logic.isBomb(i, j))
        {
          if(!logic.isFlaged(state.grid[i][j]))
          {
            state.grid[i][j].querySelector(`.vis`).style.zIndex = `0`;
          }
          else
          {
            render.trueFlag(state.grid[i][j]);
          }
        }
        
        if(logic.isFlaged(state.grid[i][j]) && !logic.isBomb(i, j))
        {
          render.cross(state.grid[i][j]);
        }
      }  
    }
  },

  createGrid()
  {
    const grid = document.querySelector('.grid-container');
    for (let i = 0; i < state.fieldSize; i++) 
    {
      for (let j = 0; j < state.fieldSize; j++) 
      {
        const cell = document.createElement('div');
        cell.classList.add('cell', `${i}${j}`);
        render.cell(cell);
        grid.appendChild(cell);
        state.grid[i][j] = cell;
      }
    }
  },

  cell(cell)
  {
    let number = logic.bombsNear(cell);
    const content = document.createElement(`div`);
    
    if(number != `bomb`)
    {
      cell.classList.add(`number`);
      content.innerHTML = number;
      content.classList.add(`num`,`number-${number}`);
      cell.appendChild(content)
    }
    else
    {
      cell.classList.add(`bomb`);
      content.classList.add(`vis`);
      cell.appendChild(content);
    }
  },

  flag()
  {
    event.target.classList.add(`flag`);
  },

  unFlag()
  {
    event.target.classList.remove(`flag`);
  },

  cross(cell)
  {
    cell.classList.add(`crossFlag`);
  },

  trueFlag(cell)
  {
    cell.classList.add(`trueFlag`);
  },

};
  
const state = 
{
  fieldSize: null,
  field: null,
  bombsCount: null,
  bombsPosition: null,
  openedCells: null,
  lose: null,
  root: null,
  grid: null,
};

logic.startGame();