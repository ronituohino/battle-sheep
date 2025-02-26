# Project structure

`/src` contains all the source code of the project.

`/src/index.tsx` initializes the React app.  
`/src/components/` has all the React components used for the UI.  
`/src/game/` has core logic files implemented as functions:

- `game.ts` helps control the game board.
- `ai.ts` simulates the AI for the game.

`/src/levels.ts` contains the game level definitions.  
`/src/types.ts` contains TypeScript types used throughout the project.

`/src/utils` has small utility functions used here and there.

### Other stuff

`/__tests__` contains all unit and performance tests in their respective folders.  
`/docs` contains all project documentation.  
`/public` contains all files that are available as a GET request in the deployed web project. Contains the tab icon for example.  
`/index.html` the root HTML file that is fetched the the page is accessed.

Rest of the inidividual files in the root are mainly configuration files for linting, deployment, git, building...

### Ignored files

`/node_modules` contains all the third party libraries needed to run the project, these are downloaded during `npm install`.  
`/coverage` contains unit test coverage files, deployed to it's own web server during publish.  
`/dist` contains the built web application ready for deployment.  

# AI Performance

The AI is implemented with a minimax algorithm, optimized with alpha-beta pruning and move ordering.

For an alpha-beta algorithm the time complexity is O(b<sup>d</sup>), where b is the branching factor, and d is the search depth. The branching factor is the average amount of branches any node has in the game tree.

The best-case performance is O(√(b<sup>d</sup>)).

In this case the branching factor b, is quite large, since the amount of moves could be at most 5 \* 15 = 75 (5 directions, since 1 is always blocked, maximum of 15 different amounts of sheep to move from a stack of 16 sheep). When the 16 sheep are split up to separate stacks, I think the possible moves can't exceed 75.

With this in mind, I would guess the average b = ~15, since the game tree has a lot fewer branches as the game progresses.

If we assume b = 15 and set d = 7, in the worst case we would have to compute around 171 million board states, which would take a lot of time. In the best-case scenario though we would only have to compute around 14 thousand board states, which should be doable in a few seconds or less.

Here are some test results from my performance testing:

| Level | Depth | Test       | Average time |
| ----- | ----- | ---------- | ------------ |
| Mixed | 4     | First move | 81ms         |
| Mixed | 4     | 3 moves    | 78ms         |
| Mixed | 5     | First move | 450ms        |
| Mixed | 5     | 3 moves    | 717ms        |
| Mixed | 6     | First move | 2.32s        |
| Mixed | 6     | 3 moves    | 3.96s        |
| Mixed | 7     | First move | 20.32s       |
| Mixed | 7     | 3 moves    | 29.19s       |
| Open  | 4     | First move | 101ms        |
| Open  | 4     | 3 moves    | 261ms        |
| Open  | 5     | First move | 594ms        |
| Open  | 5     | 3 moves    | 1.06s        |
| Open  | 6     | First move | 4.28s        |
| Open  | 6     | 3 moves    | 13.11s       |
| Open  | 7     | First move | 21.95s       |
| Open  | 7     | 3 moves    | 1min 14s     |

From this we can see that there is still room for optimization.  
[more info in the testing doc](./testing.md)

I couldn't find much on the space-complexity of alpha-beta, but I believe it's somewhere around O(bdn), where b is branching factor, d is depth, and n is the size of the game board. This is because the algorithm has to store the game board state at each depth, and at each branching node. From the visited nodes, good board states are returned upwards the game tree, and bad ones are discarded.

However, I'm happy with the results since the AI can play quite well even with d=5.

# Flaws & improvements

### Behaviour

The AI would be way better with a heuristic for selecting the starting tile.

Sometimes the AI blocks it's own sheep in single-cell-hallways. This can sometimes be seen on the "web" level.

### Optimization

The AI could be optimized with [Iterative Deepening](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

The AI search algorithm could be multi-threaded, even on the web, using the [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

# Sources

- Hexagonal Grids: https://www.redblobgames.com/grids/hexagons/
- Minimax: https://en.wikipedia.org/wiki/Minimax
- Alpha-beta pruning: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
- Iterative Deepening: https://www.chessprogramming.org/Iterative_Deepening
- Web Workers API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
