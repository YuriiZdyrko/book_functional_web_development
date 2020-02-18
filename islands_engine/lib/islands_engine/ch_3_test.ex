defmodule Chapter3Test do
  alias IslandsEngine.Rules

  def run do
    r_initialized = Rules.new()
    {:ok, r_players_added} = Rules.check(r_initialized, :add_player)
    {:ok, r_positioned_islands} = Rules.check(r_players_added, {:position_islands, :player1})
    {:ok, r_set_islands_player_1} = Rules.check(r_positioned_islands, {:set_islands, :player1})
    {:ok, r_player1_turn} = Rules.check(r_set_islands_player_1, {:set_islands, :player2})
    {:ok, r_player2_turn} = Rules.check(r_player1_turn, {:guess_coordinate, :player1})
    {:ok, r_player1_turn} = Rules.check(r_player2_turn, {:guess_coordinate, :player2})
    {:ok, r_game_over} = Rules.check(r_player2_turn, {:win_check, :win})
  end
end
