function update_player_position(player) {
  selectPlayer = document.querySelector(player);
  td_active = selectPlayer.querySelector(".active");
  td_active_next = td_active.nextElementSibling
  if ( td_active_next !== null ) {
    td_active.nextElementSibling.className = "active";
    td_active.className = "";
  } else {

    winner(player);
  }
}


function on_key_press(e) {
  // z
  if (e.keyCode === 90) {
    update_player_position('#player1');
    // m 
  } else if (e.keyCode === 77) {
    update_player_position('#player2');
  }
}

function winner(player) {
  alert(player + " Wins!");
  // var strip = document.querySelector(player)
  // var tdActive = document.querySelector('.active')
  // var start = strip.children[0]
  // tdActive.className = " "
  // start.className = "active"
 var strip1= document.getElementById("player1")
 var strip2= document.getElementById("player2")
 var active1= strip1.querySelector('.active')
 var active2= strip2.querySelector('.active')
var start1 = strip1.children[0]
var start2 = strip2.children[0]
active1.className = ''
active2.className = ''
start1.className = 'active'
start2.className = 'active'


}

window.onload = function() {
  // on keyup ,execute on_key_press function 
  document.addEventListener('keyup', on_key_press, false);
}