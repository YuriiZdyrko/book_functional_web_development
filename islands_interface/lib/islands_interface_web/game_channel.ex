defmodule IslandsInterfaceWeb.GameChannel do
  use IslandsInterfaceWeb, :channel
  alias IslandsEngine.{Game, GameSupervisor}

  def join("game:" <> _player, _payload, socket) do
    {:ok, socket}
  end

  @doc """
  To test this, use socket.js file snippets in browser console,
  each section can be uncommented and tested without stopping Phoenix server,
  using: iex> r IslandsInterfaceWeb.GameChannel
  """
  def handle_in("hello", payload, socket) do
    # Reply via push/3 (separate "said_hello" event, unlike :reply)
    payload = update_in(payload, ["message"], &(&1 <> " - PUSHED"))
    push(socket, "said_hello", payload)
    {:noreply, socket}

    # OR reply via :reply
    # payload = update_in(payload, ["message"], &(&1 <> " - REPLIED"))
    # {:reply, {:ok, payload}, socket}

    # OR reply to all users on channel (separate "said_hello" event, unlike :reply)
    # payload = update_in(payload, ["message"], &(&1 <> " - BROADCASTED"))
    # broadcast! socket, "said_hello", payload
    # {:noreply, socket}

    # OR
    # error example: {:reply, {:error, "some payload"}, socket}
  end
end
