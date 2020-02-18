defmodule Chapter4Test do
  alias IslandsEngine.{Game, Rules}

  def run do
    {:ok, game} = Game.start_link("Player 1")

    Game.add_player(game, "Player 2")

    Game.position_island(game, :player1, :atoll, 1, 1)
    Game.position_island(game, :player1, :dot, 1, 4)
    Game.position_island(game, :player1, :l_shape, 1, 5)
    Game.position_island(game, :player1, :s_shape, 5, 1)
    Game.position_island(game, :player1, :square, 5, 5)

    # Game.position_island(game, :player2, :atoll, 1, 1)
    Game.position_island(game, :player2, :dot, 1, 4)
    # Game.position_island(game, :player2, :l_shape, 1, 5)
    # Game.position_island(game, :player2, :s_shape, 5, 1)
    # Game.position_island(game, :player2, :square, 5, 5)

    # Game.set_islands(game, :player1)
    :sys.get_state(game) |> IO.inspect()

    # Workaround to avoid filling all 5 islands, and guessing all coords:
    :sys.replace_state(
      game,
      &%{&1 | rules: %Rules{state: :player1_turn}}
    )

    # No win - bad guess
    Game.guess_coordinate(game, :player1, 1, 1) |> IO.inspect()

    # A hack to avoid filling all 5 islands, and guessing all coords:
    :sys.replace_state(
      game,
      &%{&1 | rules: %Rules{state: :player1_turn}}
    )

    # Win!
    Game.guess_coordinate(game, :player1, 1, 4) |> IO.inspect()
  end

  def registry do
    via = Game.via_tuple("Lena")
    GenServer.start_link(Game, "Lena", name: via)
    :sys.get_state(via) |> IO.inspect()

    {:error, {:already_started, _pid}} =
        GenServer.start_link(Game, "Lena", name: via)
  end
end
