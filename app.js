var Control = require('./src/control.js');
var Robot = require('./src/robot.js');
var prompt = require('prompt');
var drawGrid = require('./src/drawGrid.js');
var colors = require('colors');


//SCHEMAS FOR DIFFERERENT PROMPTS WHICH WILL BE CALLED
var Grid_Schema = {
    name: "input",
    description: "X and Y digits:",
    pattern: / ?^\d{1,9}\s\d{1,9} ?/g,
    message: "Make sure there is a space between each digit",
    required: true
};

var Rover_Request_Schema = {
    name: "request",
    description: "Deploy another Rover? y/n".yellow,
    pattern: /[yn] ?/gi,
    message: "Either (y)es or (n)o",
    required: true
};

var Rover_Coords_Schema = {
    name: "coordinates",
    description: "Place your robot on Mars. \n x coordinate, y coordinate, orientation eg 2 2 N \n Place Rover: ".yellow,
    pattern: / ?^\d{1,9}\s\d{1,9}\s[nesw] ?/gi,
    message: "Two digits followed by either N, S, W, E",
    required: true
};

var Rover_Instructions_Schema = {
    name: "instructions",
    description: "Command your Rover.\n L for Left, R for Right, F for Forward eg LLFRRFF. \n  Commands: ".yellow,
    pattern: /[LFR] ?/gi,
    message: "Either L, R, or F",
    required: true
};

prompt.start();
const mission = new Control();

function defineGrid(){
  console.log("\n                 LET'S SEND ROVERS TO MARS                \n ".red.underline)
  console.log("Enter an X and Y digit to define your Mars surface grid".yellow)
  prompt.get(Grid_Schema, (err, result) => {
    if (result){
      console.log(result.input)
      mission.gridCoordinates = result.input;
      placeRover();
    }
    else {
      console.log(err.message)
      defineGrid();
    }
  })
}

  function requestRover(){
    prompt.get(Rover_Request_Schema, (err, result) => {
      if (result) {
        console.log(result.request)
        if (result.request === 'y'){
         placeRover();}

        else if (result.request === 'n'){
            console.log("goodbye".yellow)
            return;
         }

        else {
          requestRover();
        }
      }
      else {
        console.log(err.message)
        requestRover();
      }
    })

  }


  function placeRover(){
    prompt.get(Rover_Coords_Schema, (err, result) => {
      if (result) mission.robotStartPosition = result.coordinates;
        validateStartPosition();
    })

    function validateStartPosition(){
      if (mission.data.validStartPosition && !mission.data.robotHasCollided){
        const robot = new Robot();
        robot.data.currentCoordinates.x = mission.data.robotStartPosition.x;
        robot.data.currentCoordinates.y = mission.data.robotStartPosition.y;
        robot.data.currentCoordinates.orientation = mission.data.robotStartPosition.orientation

        giveInstructions(robot);
      }

      else if (!mission.data.validStartPosition) {
        console.log("Your coordinates are outside the boundaries of Mars. Please try again".red);
        requestRover();
      }
      else if (mission.data.robotHasCollided){
        console.log("There is already a rover in that position! Try again".red);
        requestRover();
      }
      else {
        console.log("something went horribly wrong.".red)
      }
    }
  }

  function giveInstructions(robot){
    prompt.get(Rover_Instructions_Schema, (err, result) => {
      if (result) robot.instructions = result.instructions;
        checkRobotStillInGrid(robot.data.currentCoordinates.x, robot.data.currentCoordinates.y);
    })
  }

  function checkRobotStillInGrid(x, y){
    if (mission.checkRobotStillInGrid(x, y) ){
      checkforCollisions(x, y);
    }
    else {
      console.log("\n Your Rover has fallen off the edge of Mars!!! \n".red)
      console.log("The last known position is: ".blue + mission.data.lostRobots[mission.data.lostRobots.length -1] + "\n");
      requestRover();
    }
  }

  function checkforCollisions(x, y){
    mission.crashedIntoExistingRobot(x, y);
    let data = mission.data;
    let crashed = mission.data.robotHasCollided;

    if (!crashed){
      console.log(" \n The Rover is safely within the grid and has not crashed into another.\n ".green);
      console.log(" Find your Rover at x = ".blue + x + " and y = ".blue + y)
      drawGrid(data.gridCoordinates.x, data.gridCoordinates.y, data.existingRobots, data.robotWrecks, data.lostRobots);
      requestRover();
    }
    else if (crashed){
      console.log("\n Your Rover has crashed!!! \n".red)
      console.log("The coordinates of the collission wreckage are: ".blue + mission.data.robotWrecks[mission.data.robotWrecks.length -1] + "\n");
      drawGrid(data.gridCoordinates.x, data.gridCoordinates.y, data.existingRobots, data.robotWrecks, data.lostRobots);
      requestRover();
    }
    else {
      console.log("Problem checking for collision function. Let's try again.".red)
      drawGrid(data.gridCoordinates.x, data.gridCoordinates.y, data.existingRobots, data.robotWrecks, data.lostRobots);
      requestRover();
    }
  }


defineGrid();
