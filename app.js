const game = {

  getFieldSize() {
    const size = parseInt(prompt('Please enter a number: '));
    return size;
  },
  
  createField(size) {
    let field = new Array(size);
    for (let i = 0; i < size; i++) {
      field[i] = new Array(size);
    }
    return field;
  },
  
  getRandomPosition(fieldSize){
    const randX = Math.floor(Math.random() * fieldSize);
    const randY = Math.floor(Math.random() * fieldSize);
    return {
      x: randX,
      y: randY
    }
  },

  fillField(field, bombsCount) {
    let bombsPlaced = 0;
    while(bombsPlaced < bombsCount)
    {
      let pos = game.getRandomPosition(field.length);

      if(!field[pos.x][pos.y])
      {
        field[pos.x][pos.y] = true;
        bombsPlaced++;
      }
    }
    return field;
  },
};
  
const render = {
  renderField(state) {
      for (let i = 0; i < state.field.length; i++) {
      console.log(state.field[i]);
      }
  }
};
  
const state = {
  fieldSize: 5,
  field: game.fillField(game.createField(5), 10),
  bombsCount: 10,
};
  
function main(){
    // const size = game.getFieldSize();
    // state.fieldSize = size;
    // state.field = game.fillField(game.createField(size));
    render.renderField(state);

}

main();
