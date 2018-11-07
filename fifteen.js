//extras
 //Animations and/or transitions
// End-of-game notification
// Game time

window.onload = main;


var layout = ["300px", "300px"];
var start = false;
var moves = 0;
var stime = 0;
var timer;
var t_time = 0;
var best_time = 0;
var best_moves = 0;

//Maze piece Initialization function and returns initial maze state
function start_state() {
    var puzzle_area = document.getElementById("puzzlearea").childNodes;
    var initial_state = [];

    var x = 0,
        y = 0,
        top = 0,
        left = 0,
        piece_counter = 1;

    for (let i = 0; i < puzzle_area.length; i++) {
        if (puzzle_area[i].nodeName == "DIV") {
            initial_state.push([top.toString() + "px", left.toString() + "px"]);
            puzzle_area[i].className += "puzzlepiece";
            puzzle_area[i].setAttribute("style", `background-position: ${x}px ${y}px; top: ${top}px; left: ${left}px;`);
            x -= 100;
            left += 100;

            if (piece_counter % 4 == 0) {
                y -= 100;
                top += 100;
                left = 0
            }
            piece_counter += 1;

        }
    }

    return initial_state
}


function is_movable(piece) {
    return parseInt(piece.style.top) + 100 === parseInt(layout[0]) & parseInt(piece.style.left) === parseInt(layout[1]) | parseInt(piece.style.top) - 100 === parseInt(layout[0]) & parseInt(piece.style.left) === parseInt(layout[1]) | parseInt(piece.style.top) === parseInt(layout[0]) & parseInt(piece.style.left) - 100 === parseInt(layout[1]) | parseInt(piece.style.top) === parseInt(layout[0]) & parseInt(piece.style.left) + 100 === parseInt(layout[1])
}


function check_for_win(winning_state, pieces) {
    if (start) {
        for (var i = 0; i < pieces.length; i++) {
            if ((winning_state[i][0] !== pieces[i].style.top) | (winning_state[i][1] !== pieces[i].style.left)) {
                return false;
            }
        }
        clearInterval(timer);
        return true;
    }
    return false;
}

//switches piece with layout space
function move_piece(piece, animate) {
    layout_top = piece.style.top;
    layout_left = piece.style.left;

    if (animate) {
        var winning_state = arguments[2];
        var pieces = arguments[3];
        $(piece).animate({ "top": layout[0], "left": layout[1] }, "slow", "linear", function() {
            if (check_for_win(winning_state, pieces)) {
                if (best_time < t_time) {
                    best_time = t_time;
                }
                if (best_moves < moves) {
                    best_moves = moves
                }
                var win_string = `You Win\nTotal Time: ${seconds_to_time(t_time)} Number of moves: ${moves}\nBest Time: ${seconds_to_time(best_time)} Best Number of Moves: ${best_moves}`;
                $(".explanation")[0].innerText = win_string;
                $(".explanation")[0].style.textAlign = "Center";
            }
        });

    } else {
        piece.style.top = layout[0];
        piece.style.left = layout[1];
    }
    layout = [layout_top, layout_left];
}


function random_shuffle(pieces) {
    var pieceLength = pieces.length;
    var piece;
    var rand;

    for (var index = 0; index < pieceLength; index++) {
        rand = Math.floor(Math.random() * pieces.length);
        piece = pieces.splice(rand, 1);
        move_piece(piece[0], false);
    }
}


function get_pieces() {
    return $(".puzzlepiece");
}


function seconds_to_time(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}


function update_time() {
    var current_date = new Date();
    var current_time = (current_date.getHours() * 60 * 60) + (current_date.getMinutes() * 60) + current_date.getSeconds();
    t_time = current_time - stime;
    return seconds_to_time(t_time);
}

//Adds game time and moves made to DOM
function update_stats() {
    $(".explanation")[0].innerHTML = `Time: ${update_time()} Moves: ${moves}`;
}

function add_background_seletor() {
    var background_form = "<form align='Center'>\
    </form>";

    $("#overall").before(background_form);

}



function shuffle_image(){
    var value = Math.floor(Math.random()*4)
    if(value === 0){
        value = "";
    }
  //  change_bg(value);
}

function main() {
    var winning_state = start_state();
    var p_pieces = get_pieces();
    add_background_seletor();
    var bg_form_items = $("form")[0].elements;

    for (var i = 0; i < bg_form_items.length; i++) {
        bg_form_items[i].addEventListener("click", function(){
            change_bg(this.value)
        });
    }

    document.getElementById("shufflebutton").onclick = function() {
        random_shuffle(p_pieces);
        shuffle_image();
        start = true;
        moves = 0;
        p_pieces = get_pieces();
        var start_date = new Date();
        stime = (start_date.getHours() * 60 * 60) + (start_date.getMinutes() * 60) + start_date.getSeconds();
        timer = setInterval(update_stats, 1000);
    }

    for (var i = 0; i < p_pieces.length; i++) {
        p_pieces[i].addEventListener("mouseover", function() {
            if (is_movable(this)) {
                this.className = "puzzlepiece movablepiece";
            }
        });

        p_pieces[i].addEventListener("mouseleave", function() {
            this.className = "puzzlepiece";
        });

        p_pieces[i].addEventListener("click", function() {
            if (this.className.includes("movablepiece")) {
                move_piece(this, true, winning_state, p_pieces);
                moves++;
            }
        });
    }
}
