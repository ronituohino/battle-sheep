# Testing report

Testing has been implemented with automatic unit tests.

### Unit testing

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

### Unit test coverage

The latest public coverage report can be found at https://battle-sheep-coverage.web.app/

Produce a coverage report with:

```
npm run coverage
```

This report is in the `/coverage` folder and can be examined by opening the `/coverage/index.html` file.

### Performance

Run performance tests with:

```
npm run performance
```

The performance tests measure how long it takes for the AI to select a starting tile, make the first move, and then make the 3 moves after.
