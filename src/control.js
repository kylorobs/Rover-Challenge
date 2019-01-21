module.exports = class Control {
  constructor(){
    this.data = {
      gridCoordinates : {
        x: null,
        y: null
      },
      robotStartPosition : {
        x: null,
        y: null,
        orientation: null
      },
      validStartPosition : null,
      robotHasCollided : null,
      existingRobots : [],
      robotWrecks: [],
      lostRobots : []
    }
  }


  set gridCoordinates(xyString){
    const xyArray = xyString.split(' ');
    const inputX = Number(xyArray[0]);
    const inputY = Number(xyArray[1]);

    if (!isNaN(inputX) && !isNaN(inputY)){
      this.checkgridCoordinates(inputX, inputY)
    }
    else {
      return;
    }
  }

  get gridCoordinates(){
    return this.gridCoordinates;
  }

  checkgridCoordinates(inputX, inputY){
    if (inputX > 50) inputX = 50;
    if (inputY > 50) inputY = 50;

    this.data.gridCoordinates = {
      x: inputX,
      y: inputY
    }
  }

  set robotStartPosition(robotXY){
    const xyArray = robotXY.split(' ');
    const x = Number(xyArray[0]);
    const y = Number(xyArray[1]);
    const o = xyArray[2].toLowerCase();

    this.checkGridBoundaries(x, y, o);
  }

  checkGridBoundaries(x, y, o){
    const gridCoords = this.data.gridCoordinates;
    this.data.robotHasCollided = false;
    this.validStartPosition = false;

    if (this.data.existingRobots.length >= 1){
      this.data.existingRobots.forEach(rover => { //CHECK IF ROVER IS BEING PLACED ONTOP OF AN EXISTING ROBOT
        if (x === rover[0] && y === rover[1]){
          this.data.robotHasCollided = true;
        }
    })
  }

    if (x > gridCoords.x || y > gridCoords.y) {
      this.data.validStartPosition = false;
    }

    else {
      this.data.validStartPosition = true;
      let robotPosition = this.data.robotStartPosition;
      robotPosition.x = x;
      robotPosition.y = y;
      robotPosition.orientation = o;
      return;
    }
  }


  get robotStartPosition(){
    return this.robotStartPosition;
  }

  checkRobotStillInGrid(x, y){
    let outerX = this.data.gridCoordinates.x;
    let outerY = this.data.gridCoordinates.y;

    if (x > outerX || x < 0){
      if (x <= 0) outerX = 0;

      this.data.lostRobots.push([outerX, y]);
      return false;
    }

    else if ( y > outerY || y < 0){
      if (y <= 0) outerY = 0;
      this.data.lostRobots.push([x, outerY]);
      return false;
    }

    else {
      return true;
    }
  }

  crashedIntoExistingRobot(x, y){
    this.data.robotHasCollided = false;
    let existingRobots = [...this.data.existingRobots];
    let robotX = x;
    let robotY = y;
    let wreckedRobotIndex = null;

    if (existingRobots.length > 0) {
      existingRobots.forEach((robot, i) => {
         if (x == robot[0] && y == robot[1]){
           this.data.robotHasCollided = true;
           wreckedRobotIndex = i;
         }
      })
    }

    !this.data.robotHasCollided ? this.data.existingRobots.push([ x , y ]) : this.createRobotWreck(robotX, robotY, wreckedRobotIndex);

  }


  createRobotWreck(x, y, index){
    let existingRobots = [...this.data.existingRobots];
    this.data.robotWrecks.push([ x , y ]);           //PUSH WRECK COORDINATES TO DATABASE
    existingRobots.splice(index, 1);  //REMOVE WRECKED ROBOT FROM EXISTING ROBOTS
    this.data.existingRobots = existingRobots; // CHANGE DATA TO NEW ARRAY
  }

}
