# Testing report

Testing on this project consists of manual testing, unit testing and performance testing.

## Manual testing

Lots of manual testing has been completed with the existing levels by playing against the AI.

## Unit testing

Run unit tests with:

```
npm run test
```

Vitest also offers a browser to examine unit tests:

```
npm run test-ui
```

Unit tests cover most of the functions in the core logic `game.ts`.

Unit tests also cover basic functionality of the AI in `ai.ts`.

## Unit test coverage

The latest public coverage report can be found at https://battle-sheep-coverage.web.app/

Produce a coverage report with:

```
npm run coverage
```

This report is in the `/coverage` folder and can be examined by opening the `/coverage/index.html` file.

## Performance

Run performance tests with:

```
npm run performance
```

The performance tests measure how long it takes for the AI to select a starting tile, make the first move, and 3 first moves.
The test level and depth can be configured in `/__tests__/performace/ai.test.ts`.

Here are some results:  
Since the starting tile is just selected randomly, I excluded their results.

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

From the results we can see that open maps have generally longer compute times, because the game tree grows larger when there are more possible moves from each tile. We can also see that the first move usually takes most of the time to compute, since that's when the game tree grows largest. My implementation can compute down to depth 7 in a reasonable time, but to make gameplay smooth, I stick with depth 5 in the web build.

I'm really happy with the results!
