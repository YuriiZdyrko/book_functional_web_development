defmodule Chapter5Test do
  alias IslandsEngine.{Game, GameSupervisor}

  def run do
    IO.puts("GameSupervisor.start_game(\"Cassatt\")")
    {:ok, game} = GameSupervisor.start_game("Cassatt") |> print()

    IO.puts("\nGame.via_tuple(\"Cassatt\")")
    via = Game.via_tuple("Cassatt") |> print()

    IO.puts("\nGame.add_player(via, \"Hockney\")")
    Game.add_player(via, "Hockney") |> print()

    IO.inspect("\n:sys.get_state(via)")
    :sys.get_state(via) |> IO.inspect()

    IO.puts("\nSupervisor.count_children(GameSupervisor)")
    Supervisor.count_children(GameSupervisor) |> print()

    IO.puts("\nSupervisor.which_children(GameSupervisor)")
    Supervisor.which_children(GameSupervisor) |> print()

    IO.puts("\nGameSupervisor.stop_game(\"Cassatt\")")
    GameSupervisor.stop_game("Cassatt") |> print()

    # Game's pid is not alive
    IO.puts("\nProcess.alive?(game)")
    Process.alive?(game) |> print()

    # Game is removed from Registry
    IO.puts("\nGenServer.whereis(via)")
    GenServer.whereis(via) |> print()
  end

  def test_game_timeout do
    {:ok, game} = GameSupervisor.start_game("Cassatt") |> IO.inspect()
    :timer.apply_interval(1000, __MODULE__, :ping_game, [game])
  end

  def test_ets do
    {:ok, game} = GameSupervisor.start_game("Cassatt")
    Game.add_player(game, "Player 2")

    # Force GameSupervisor to restart "Cassatt" game
    GenServer.stop(Game.via_tuple("Cassatt"), :error_in_a_game)
    # or GenServer.stop(game, :error_in_a_game)
    # or Process.exit(game, :error_in_a_game)

    # Wait for a restart & :ets restore
    Process.sleep(1000)

    # Observe "Player 2" still there
    :sys.get_state(Game.via_tuple("Cassatt"))
  end

  def ping_game(game) do
    Process.alive?(game) |> IO.inspect()
  end

  def print(v) do
    Process.sleep(5000)
    IO.inspect(v)
  end
end
