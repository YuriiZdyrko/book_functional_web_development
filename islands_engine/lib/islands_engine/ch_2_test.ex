defmodule ChapterOneTest do

    alias IslandsEngine.{Board, Coordinate, Island}

    def run do
        board = Board.new() |> i()
        
        step "position1"
        {:ok, square_coordinate} = Coordinate.new(1, 1) |> i()
        {:ok, square} = Island.new(:square, square_coordinate) |> i()
        board = Board.position_island(board, :square, square) |> i()

        step "position fail"
        {:ok, dot_coordinate} = Coordinate.new(2, 2) |> i()
        {:ok, dot} = Island.new(:dot, dot_coordinate) |> i()
        Board.position_island(board, :dot, dot) |> i()

        step "position2"
        {:ok, new_dot_coordinate} = Coordinate.new(3, 3) |> i()
        {:ok, dot} = Island.new(:dot, new_dot_coordinate) |> i()
        board = Board.position_island(board, :dot, dot) |> i()

        step "guess => miss"
        {:ok, guess_coordinate} = Coordinate.new(10, 10) |> i()
        {:miss, :none, :no_win, board} = Board.guess(board, guess_coordinate) |> i()

        step "guess => hit"
        {:ok, hit_coordinate} = Coordinate.new(1, 1) |> i()
        {:hit, :none, :no_win, board} = Board.guess(board, hit_coordinate) |> i()

        step "guess => hit + win"
        square = %{square | hit_coordinates: square.coordinates} |> i()
        board = Board.position_island(board, :square, square) |> i()
        {:ok, win_coordinate} = Coordinate.new(3, 3) |> i()
        {:hit, :dot, :win, board} = Board.guess(board, win_coordinate) |> i()
    end

    defp i(term), do: IO.inspect(term)
    defp step(term), do: IO.puts("\n\n#{term}\n")
end