module.exports = class Robot {
  constructor(){
    this.data = {
      currentCoordinates : {
        x: null,
        y: null,
        orientation: null
      },
      instructions : null, //string
      newCoordinates : {
        x: null,
        y: null,
        orientation: null
      },
      lost : false
    }
  }

  get instructions(){
    return this.data.instructions;
  }

  set instructions(string){

    const instructionsArray = string.split('').forEach(i => { //BEGIN LOOP THROUGH COMMANDS
      i.toUpperCase();
      if (i === 'L' || i === 'R' || i === 'F') this.executeInstructions(i)
      else console.log("Invalid Command detected. Robot will accept all instructions up until invalid command")
    })
  }

  executeInstructions(i){
    const compass = ['n', 'e', 's', 'w'];
    let currentIndex = null;
    let currentOrientation = null;

    getCurrentIndex(this.data.currentCoordinates.orientation);

    function getCurrentIndex(orientation){
      currentIndex  = compass.indexOf(orientation);
      currentOrientation = orientation;
    }

    let newIndex = null;

      switch(i){
        case 'L':
          if (currentIndex===0) currentIndex = 4;
          newIndex = currentIndex - 1;
          this.data.currentCoordinates.orientation = compass[newIndex];
          currentIndex = newIndex;
        break;
        case 'R':
          if (currentIndex===3) currentIndex = 0 - 1;
          newIndex = currentIndex + 1;
          this.data.currentCoordinates.orientation = compass[newIndex];
          currentIndex = newIndex;
        break;
        case 'F':
          this.moveRobot(currentOrientation);
        break;
        default :
        console.log("move error")
      }
  }

  moveRobot(direction){
    let newX = Number(this.data.currentCoordinates.x);
    let newY = Number(this.data.currentCoordinates.y);
    let newO= direction;

    switch(newO){
      case 'n':
        newY++;
      break;
      case 'e':
        newX++;
      break;
      case 's':
        newY--;
      break;
      case 'w':
        newX--;
      break;
      default:
        console.log("Set new coordinate error")
    }

    this.data.newCoordinates.x = newX;
    this.data.currentCoordinates.x = newX;
    this.data.newCoordinates.y = newY;
    this.data.currentCoordinates.y = newY;
    this.data.newCoordinates.orientation = newO;
    this.data.currentCoordinates.orientation = newO;
    // console.log("Your Robot Has Moved To: " + newX + newY + newO);
    // console.log(newX)
    // console.log(newY)
    // console.log(newO)
  }

}
