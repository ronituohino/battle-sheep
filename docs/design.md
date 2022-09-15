# Battle Sheep

The aim of this project is to create a web page where the user can play a
somewhat-known
[Battle Sheep](https://www.blueorangegames.com/index.php/games/battle-sheep)
board game against AI, or watch AI play against eachother.

This is a project for
[Tiralabra 2022 period 1](https://tiralabra.github.io/2022_p1/index) course at
University of Helsinki.

## Implementation

### General

**All documentation, code and comments will be in English.**

**Most of the project code will be in
[TypeScript](https://www.typescriptlang.org/).**

The rules of the board game are explained very well in a video embedded in the
[Battle Sheep official site](https://www.blueorangegames.com/index.php/games/battle-sheep).

My implementation will ignore the building-phase and will instead offer some
ready-built boards to choose from, and possibly a sandbox where the user can
build their own board to play on.

My implementation will support 1-4 AI playing on the same board. However,
depending on the performance of the algorithm this might be reduced to just 1-2
AI.

### Development

I will use the [React](https://reactjs.org/) framework, with
[Vite](https://vitejs.dev/) as the module bundler. I might also use a UI
framework to speed up development. The app will be a single-page-app (SPA).

I will use [Vitest](https://vitest.dev/) for unit
testing. I might also use [Cypress](https://www.cypress.io/) for integration
testing.

The website will be deployed to [Firebase](https://firebase.google.com/).

I will try to detach the TypeScript code as much as possible from the rest of
the web page code to make it easier to review.

### Algorithms

I want the algorithms to be as performant as possible so I want to avoid
reference types, and instead represent stuff with value types.

Firstly, we need a data structure to represent the state of the game. Let's
store the game board in a 2d array mapped to the hex grid with
[Axial Coordinates](https://www.redblobgames.com/grids/hexagons/#coordinates-axial).

The actual state of a tile can be represented with a null value or an integer:

- null means a missing tile in the map.
- 0 means an empty tile in the map. (Tile with no sheep on it)
- Player 1 sheep are mapped from 001-016. (Tile with 1-16 sheep, player 1)
- Player 2 sheep are mapped from 101-116. (Tile with 1-16 sheep, player 2)
- ...

I need to implement a heuristic to evaluate a "value" for a given tile in a
certain state of a game. **Implementation details are still unclear.**

Then I need to make a [minimax algorithm](https://en.wikipedia.org/wiki/Minimax)
to make the AI work. This could then be optimized with
[alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning).  
**Implementation details are still unclear.**

The aim is for the algorithm to take less than a few seconds to compute the move
for the AI. This is generally less than what it takes a human player to make
their move, which makes the gameplay smooth and much more enjoyable. This time
constraint is quite arbitrary ("a few seconds"), because the algorithm
completion time could vary significantly based on the scale of the board, the
amount of players, and the state of the game.

### UI

The web page UI has 2 essential screens, and 2 optional screens:

- Essential (on the right)
  - Game configuration
  - Game screen
- Optional (on the left)
  - Level builder
  - Main menu

![](/docs/images/ui.png)

## Info for course

I am completing a Bachelor's degree in Computer Science
(Tietojenkäsittelytieteen kandidaatti).

I am able to appraise other people's works made in TypeScript, JavaScript,
Python, and C#.

## References

- Battle Sheep: https://www.blueorangegames.com/index.php/games/battle-sheep
- Hexagonal Grids: https://www.redblobgames.com/grids/hexagons/
- Minimax: https://en.wikipedia.org/wiki/Minimax
- Alpha-beta pruning: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
