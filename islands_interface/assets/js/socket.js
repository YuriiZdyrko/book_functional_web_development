// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {
  Socket
} from "phoenix"

window.socket = new Socket("/socket", {
  params: {
    token: window.userToken
  }
})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// var new_channel = socket.channel("topic:subtopic", {some_key: "some_value"})

window.new_channel = function(subtopic, screen_name) {
  return socket.channel("game:" + subtopic, {
    screen_name: screen_name
  });
}
window.join = function(channel) {
  channel.join()
    .receive("ok", response => {
      console.log("Joined successfully!", response)
    })
    .receive("error", response => {
      console.log("Unable to join", response)
    })
}

window.leave = function(channel) {
  channel.leave()
    .receive("ok", response => {
      console.log("Left successfully", response)
    })
    .receive("error", response => {
      console.log("Unable to leave", response)
    })
}

window.say_hello = function(channel, greeting) {
  channel.push("hello", {
      "message": greeting
    })
    .receive("ok", response => {
      console.log("Hello", response.message)
    })
    .receive("error", response => {
      console.log("Unable to say hello to the channel.", response.message)
    })
}

window.new_game = function(channel) {
  channel.push("new_game")
    .receive("ok", response => {
      console.log("New Game!", response)
    })
    .receive("error", response => {
      console.log("Unable to start a new game.", response)
    })
}

window.add_player = function(channel, player) {
  channel.push("add_player", player)
    .receive("error", response => {
      console.log("Unable to add new player: " + player, response)
    })
}

window.position_island = function(channel, player, island, row, col) {
  var params = {
    "player": player,
    "island": island,
    "row": row,
    "col": col
  }
  channel.push("position_island", params)
    .receive("ok", response => {
      console.log("Island positioned!", response)
    })
    .receive("error", response => {
      console.log("Unable to position island.", response)
    })
}

window.set_islands = function(channel, player) {
  channel.push("set_islands", player)
    .receive("ok", response => {
      console.log("Here is the board:");
      console.dir(response.board);
    })
    .receive("error", response => {
      console.log("Unable to set islands for: " + player, response)
    })
}

window.guess_coordinate = function(channel, player, row, col) {
  var params = {
    "player": player,
    "row": row,
    "col": col
  }
  channel.push("guess_coordinate", params)
    .receive("error", response => {
      console.log("Unable to guess a coordinate: " + player, response)
    })
}

/**
 * Paste into browser console:
 * 
var game_channel = new_channel("moon", "moon")
join(game_channel)
// setTimeout(() => leave(game_channel), 1000)
say_hello(game_channel, "yo man!")

// Handle Pushes and Broadcasts
game_channel.on(
  "said_hello", 
  response => console.log("Returned Greeting:", response.message)
)
**/

/**
 * Paste into browser console #1:
 * 
var game_channel = new_channel("moon", "moon")
join(game_channel)

new_game(game_channel)

game_channel.on(
  "player_added", 
  response => console.log("Player Added", response)
)
game_channel.on(
  "player_set_islands", 
  response => console.log("Player Set Islands", response)
)
game_channel.on(
  "player_guessed_coordinate", 
  response => console.log("Player Guessed Coordinate: ", response.result)
)
game_channel.on(
  "subscribers", 
  response => console.log("These players have joined: ", response)
)

position_island(game_channel, "player1", "dot", 1, 1)

// When Rules in state: :player1_turn
guess_coordinate(game_channel, "player1", 10, 1)

// try running new_game(game_channel) repeatedly, to cause :already_started, 
// and observe channel crashing and rejoining.
**/

/**
 * Paste into browser console #2:
 * 
var game_channel = new_channel("moon", "diva")
join(game_channel)

add_player(game_channel, "diva")

game_channel.on(
  "player_set_islands", 
  response => console.log("Player Set Islands", response)
)
game_channel.on(
  "player_guessed_coordinate", 
  response => console.log("Player Guessed Coordinate: ", response.result)
)
game_channel.on(
  "subscribers", 
  response => console.log("These players have joined: ", response)
)

position_island(game_channel, "player2", "atoll", 1, 1)
position_island(game_channel, "player2", "dot", 1, 5)
position_island(game_channel, "player2", "l_shape", 1, 7)
position_island(game_channel, "player2", "s_shape", 5, 1)
position_island(game_channel, "player2", "square", 5, 5)

set_islands(game_channel, "player2")

// Demonstrate that Presence works
game_channel.push("show_subscribers")
**/

// Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

export default socket