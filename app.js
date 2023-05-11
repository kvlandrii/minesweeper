const logic = 
{
  init()
  {
    state.fieldSize = 5;
    state.field = logic.createField(state.fieldSize);
    state.bombsCount = 7;
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

  handleTurns()
  {
    while(!state.lose)
    {
      if(state.openedSquares != (state.fieldSize**2 - state.bombsCount))
      {
        let pos = logic.getOpenPosition();
        if(!state.field[pos.x][pos.y] && state.field[pos.x][pos.y] != 0)
        {
          logic.open(pos);
          render.field(state.field);
        }
        else
        {
          render.alreadyOpened();
        }
      }
      else
      {
        render.winner();
        return;
      }
    }
    render.loser();
  },
  
  getOpenPosition()
  {
    let retry = true;
    while(retry)
    {
      retry = false;
      let input = prompt(render.openRequestMsg());
      var x = parseInt(input[0]);
      var y = parseInt(input[1]);
      if(x >= state.fieldSize || y >= state.fieldSize)
      {
        retry = true;
        render.wrongInput();
      }
    }

    return {
      x: x,
      y: y
    }
  },
  
  openedCell()
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
  
  addClickOnCells()
  {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell) => {
      cell.addEventListener('click', logic.handleClick);
    });
  },
  
  open(pos)
  {
    if(state.bombsPosition[pos[0]][pos[1]])
    {
      state.lose = true;
      render.bomb();
    }
    else
    {
      state.openedSquares++;
      render.empty();
    }

  },

  handleClick() {
    let cellPosition = event.target.classList[1];
    logic.open(cellPosition);
    event.target.removeEventListener('click', logic.handleClick);
  },
  
  startGame()
  {
    logic.init();
    render.grid();
    logic.addClickOnCells();
    render.field(state.bombsPosition);
    //logic.handleTurns();
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

  openRequestMsg()
  {
    return `Enter square coordinates:`;
  },

  winner()
  {
    console.log(`Winner!`);
  },
  
  loser()
  {
    console.log(`Loser!`);
  },

  wrongInput()
  {
    console.log(`Wrong input! Choose another coordinates!`);
  },

  alreadyOpened()
  {
    console.log(`This square has already been used!`);
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
  
  bomb()
  {
    event.target.classList.add(`bomb`);
  },

  empty()
  {
    let number = logic.openedCell();
    event.target.classList.add(`number`);
    event.target.classList.add(`number-${number}`)
    event.target.textContent = number;
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