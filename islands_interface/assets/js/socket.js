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

// Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

export default socket