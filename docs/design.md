# Battle Sheep

This is a project for the
[Tiralabra 2022 period 1](https://tiralabra.github.io/2022_p1/index) course in
University of Helsinki.

The aim of this project is to create a web page where the user can play the
somewhat-known
[Battle Sheep](https://www.blueorangegames.com/index.php/games/battle-sheep)
boardgame against an AI, or watch AI play against eachother.

## Implementation

### General

Battle Sheep starts off with 2-4 players building a board using blocks of 4
hexagonal tiles connected to eachother in a diamond pattern.

My implementation will ignore the building-phase and will instead offer some
ready-built boards to choose from and possibly a sandbox where the user can
build any kind of board to play on. My implementation will support 1-4 AI
playing on the same board. However, depending on the performance of the
algorithm this might be reduced to just 1-2.

After the building-phase, players take turns choosing a hex-tile on the edge of
the board to place a stack of 16 sheep.

My implementation will always let the player choose first.

Then players take turns moving some number of sheep from the top of one of their
stacks to a tile on the edge on the board, or next to other sheep, in a straight
line. At least 1 sheep must be left behind on that stack. Sheep cannot move over
other sheep. This way the board gradually fills up. When no sheep can be moved
by any player, the game ends. The player that occupies the most tiles with their
own sheep, wins.

### Development

The project will be made following modern web development practices. I will use
the [React](https://reactjs.org/) framework, with [Vite](https://vitejs.dev/) as
the module bundler. I will use [TypeScript](https://www.typescriptlang.org/) as
the programming language.

I will try to detach the TypeScript code as much as possible from the rest of
the web page code to make it easier to review.

I am able to appraise other people's works made in Python, JavaScript,
TypeScript and C#.

### Algorithms

I want the algorithms to be as performant as possible so I want to avoid OOP,
and instead represent stuff with numbers and tables.

My general idea is to first implement some sort of data structure to represent
the state of the game.

Then I need to implement a heuristic to evaluate a "value" for each tile in a
certain state of a game, and then derive a value that represents who is winning
in the game.

Then I need to make a min-max algorithm to make the AI work. This could then be
optimized with alpha-beta pruning.
