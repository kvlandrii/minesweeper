const logic = 
{
  init()
  {
    state.fieldSize = 2;
    state.field = logic.createField();
    state.bombsCount = 1;
    state.bombsPosition = logic.createBombs();
    state.openedSquares = 0;
    state.lose = false;
  },
  
  createField() 
  {
    let field = new Array(state.fieldSize);
    for (let i = 0; i < state.fieldSize; i++) 
    {
      field[i] = new Array(state.fieldSize);
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
    let bombsPosition = logic.createField();
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

  handleShots()
  {
    while(!state.lose)
    {
      if(state.openedSquares != (state.fieldSize**2 - state.bombsCount))
      {
        let pos = logic.getUserShot();
        logic.doShot(pos);
        render.field(state.field);
      }
      else
      {
        render.winner();
        return;
      }
    }
    render.loser();
  },
  
  getUserShot()
  {
    let input = prompt(render.shotRequestMsg());
    return {
      x: input[0],
      y: input[1]
    }
  },
  
  doShot(pos)
  {
    if(state.bombsPosition[pos.x][pos.y])
    {
      state.field[pos.x][pos.y] = true;
      state.lose = true;
    }
    else
    {
      state.field[pos.x][pos.y] = false;
      state.openedSquares++;
    }
  },
  
  startGame()
  {
    logic.init();
    render.field(state.field);
    render.field(state.bombsPosition);
    logic.handleShots();
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

  shotRequestMsg()
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
  }

};
  
const state = 
{
  fieldSize: null,
  field: null,
  bombsCount: null,
  bombsPosition: null,
  openedSquares: null,
  lose: null,
};
  
logic.startGame();