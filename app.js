const logic = 
{
  init()
  {
    state.fieldSize = 10;
    state.field = logic.createField(state.fieldSize);
    state.bombsCount = 10;
    state.bombsPosition = logic.createBombs();
    state.numbersField = logic.createField(state.fieldSize + 2);
    state.openedSquares = 0;
    state.lose = false;
    state.root = document.documentElement;
    state.root.style.setProperty('--fieldSize', state.fieldSize);
    state.grid = document.querySelector('.grid-container');
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
  
  bombsNear()
  {
    let biggerField = logic.createField(state.fieldSize + 2);
    biggerField = logic.copyForBiggerField(state.bombsPosition, biggerField);
    let bombsNear = 0;
    let x = parseInt(event.target.classList[1][0]) + 1;
    let y = parseInt(event.target.classList[1][1]) + 1;
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

  open(pos)
  {
    if(state.bombsPosition[pos[0]][pos[1]])
    {
      state.lose = true;
      render.redBomb();
      render.loser();
    }
    else
    {
      state.openedSquares++;
      event.target.removeEventListener(`contextmenu`, logic.handleRightClick);
      render.empty();
    }
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
  
  addClickOnCells()
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

  removeContextMenu()
  {
    document.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    });
  },

  handleLeftClick() {
    if(!logic.isLoser())
    {
      let cellPosition = event.target.classList[1];
      logic.open(cellPosition);
  
      if(logic.isWinner())
      {
        logic.removeAllClicks();
        render.winner();
      }

      event.target.removeEventListener('click', logic.handleLeftClick);
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
      if (logic.isFlaged())
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

  isFlaged()
  {
    return event.target.classList.contains(`flag`);
  },

  isOpened()
  {
    return event.target.classList.contains(`number`);
  },

  isWinner()
  {
    return (state.openedSquares == (state.fieldSize**2 - state.bombsCount))
  },

  showBomb()
  {
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell) => {
      let x = cell.classList[1][0];
      let y = cell.classList[1][1];
      if(state.bombsPosition[x][y])
      {
        if(!cell.classList.contains(`redBomb`))
        {
          render.bomb(cell);
        }
      }
    });
  },

  startGame()
  {
    logic.init();
    render.grid();
    logic.addClickOnCells();
    logic.removeContextMenu();
    render.field(state.bombsPosition);
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

  winner()
  {
    console.log(`Winner!`);
    document.querySelector(`.playground`).style.backgroundColor = `#d1ffb7`;
  },
  
  loser()
  {
    console.log(`Loser!`);
    document.querySelector(`.playground`).style.backgroundColor = `#ffb7b7`;
    logic.showBomb();
  },

  grid()
  {
    for (let i = 0; i < state.fieldSize; i++) 
    {
      for (let j = 0; j < state.fieldSize; j++) 
      {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add(`${i}${j}`);
        state.grid.appendChild(cell);
      }
    }

  },
  
  redBomb()
  {
    event.target.classList.add(`redBomb`);
  },

  bomb(cell)
  {
    cell.classList.add(`bomb`);
  },

  empty()
  {
    let number = logic.bombsNear();
    event.target.classList.add(`number`);
    event.target.classList.add(`number-${number}`)
    event.target.textContent = number;
  },

  flag()
  {
    event.target.classList.add(`flag`);
  },

  unFlag()
  {
    event.target.classList.remove(`flag`);
  },

};
  
const state = 
{
  fieldSize: null,
  field: null,
  bombsCount: null,
  bombsPosition: null,
  numbersField: null,
  openedSquares: null,
  lose: null,
  root: null,
  grid: null,
};


logic.startGame();