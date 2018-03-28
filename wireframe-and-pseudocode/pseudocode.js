/***--->make board<---***/
//beginner, intermediate, expert, or custom
    //width, height, mines (based on player's selection or default to beginner)
    /*var height = 9;
    var width = 9;
    var positionsArray = [];
    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++){
        positionsArray.push([r, c]);
        //call class with r, c in the class r, c are going to go in the position property
        }
    }
    */
//class that makes tiles
    //each has to have:
    //a position (column, row)
    //visible/hidden default to hidden
    //contains: mine or number of adjacent mines
    //names of adjacent mines
    //reveal method if value: 0
        //if visible make all adjacent tiles visible
    //reveal method if value: mine
        //if visible make all mines visible
//adjacent tile finder
    /*tvar ul = [r-1, c-1];
var um = [r-1, c];
var ur = [r-1, c+1];
var l = [r, c-1];
var r = [r, c+1];
var dl = [r+1, c-1];
var dm = [r+1, c];
var dr = [r+1, c+1];

if (r === 0 && c===0) {
    adjacent = [r, dm, dr]
}else if (r === 0 && c !== width) {
    adjacent = [l, r, dl, dm, dr]
}else if (r === 0 && c === width) {
    adjacent = [l, dl, dm]
}else if (r !== height && c === 0) {
    adjacent = [um, ur, r, dm, dr]
}else if (r === height && c === 0) {
    adjacent = [um, ur, r]
}else if (r === height && c !== width) {
    adjacent = [ul, um, ur, l, r]
}else if (r === height && c === width) {
    adjacent = [ul, um, l]
}else if (r !== height && c === width) {
    adjacent = [ul, um, l, dl, dm]
}
*/
//random mine placer
    //places a given number of mines in random tiles
//adjacent mine finder
    //tells all the tiles how many mines they're adjacent to

/***--->render<---***/
    //tiles at positions
    //tiles reflect visible/hidden values
    //tiles reflect contains values
    //win/lose screens

/***--->click<---***/
    //make clicked tile's visible/hidden value visible
    //win logic
    //render

/***--->win logic<---***/
    //any tile with contains:mine && visible/hidden:visible
        //player loses
    //all tiles with value !== mine visible
        //player wins
        //timer stops
        //look up timer value
        //render

/***--->timer<---***/
    //starts when player reveals first tile
    //stops when player reveals last tile or a mine