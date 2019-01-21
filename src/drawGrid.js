var colors = require('colors');

module.exports = function drawGrid(gridX, gridY, rovers, wrecks, lostRovers){
    // CREATE ONE LONG ARRAY, WHICH WILL TURN INTO ONE CONSOLE STATEMENT. WHEN GRIDY CHANGES, PUSH '\r'. REPLACE ARRAY ITEMS IF IN WRECKED/LOST ARRAYS
    let grid=[];
    let row = [];
    let rows = [];


    for (let y = 0; y <= gridX; y++){
      for (let x = 0; x<= gridY; x++){
        let z = ' # ';

        if (wrecks.length >= 1){
        wrecks.forEach(point => {
          if (x === point[0] && y === point[1]){
            z = ' C '.red.bold;
          }
        })}

        if (rovers.length >= 1){
        rovers.forEach(rover => {
          if (x === rover[0] && y === rover[1]){
            z = ' R '.green.bold;
          }
        })
      }

        if (lostRovers.length >= 1){
        lostRovers.forEach(rover => {
          if (x === rover[0] && y === rover[1]){
            z = ' L '.yellow.bold;
          }
        })
      }

      row.push(z);

        if (x === gridY){
          row.push('\n');
          if (rows.length <= 0) row.unshift(0 + ' ');
          else if (rows.length === gridY) row.unshift(gridY + ' ');
          else  row.unshift('  ');
          row = row.join('');
          rows.push(row);
          row = [];
        }
      }
    }

    grid = rows.reverse().join('');

    console.log("\n MAP OF THE SURFACE OF MARS \n".bgWhite.black);
    console.log(" R = Rover".green)
    console.log(" L = Lost Rover".yellow)
    console.log(" C = Rover Collission  \n".red)
    console.log(grid)

}
