defmodule IslandsEngine.GameSupervisor do
  use DynamicSupervisor

  import IEx

  alias IslandsEngine.Game

  def start_link(_options),
    do: DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)

  @impl true
  def init(:ok) do
    DynamicSupervisor.init(
      strategy: :one_for_one,
      extra_arguments: []
    )
  end

  def start_game(name) do
    # def start_game(foo, bar, baz) do
    # If MyWorker is not using the new child specs, we need to pass a map:
    # spec = %{id: MyWorker, start: {MyWorker, :start_link, [foo, bar, baz]}}

    # Another important point:
    # [foo, bar, baz] will not be lost if Game is restarted,
    # As an example of utilizing this, name is used in Game as
    # a key in :ets.
    spec = %{id: Game, start: {Game, :start_link, [name]}}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  def stop_game(name) do
    :ets.delete(:game_state, name)
    DynamicSupervisor.terminate_child(__MODULE__, pid_from_name(name))
  end

  defp pid_from_name(name) do
    name
    |> Game.via_tuple()
    |> GenServer.whereis()
  end
end
