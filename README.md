# tiralabra - Battle Sheep

Battle Sheep board game website for
[Data Structures Lab](https://tiralabra.github.io/2022_p1/en/) course at
University of Helsinki.

This project is (or was at some point) live at
https://battle-sheep-game.web.app/

### Documentation

[Design document](./docs/design.md) (Määrittelydokumentti)  
[Manual](./docs/manual.md) (Käyttöohje)  
[Performance report](./docs/performance.md) (Toteutusdokumentti)  
[Testing report](./docs/testing.md) (Testausdokumentti)

### Weekly reports

[Week 1](./docs/week1_report.md)  
[Week 2](./docs/week2_report.md)  
[Week 3](./docs/week3_report.md)  
[Week 4](./docs/week4_report.md)

### Test coverage

https://battle-sheep-coverage.web.app/

## Setting up

Install Node:

#### Linux

Install [nvm](https://github.com/nvm-sh/nvm) using the installation instructions.

#### Windows

Navigate to the [installer website](https://nodejs.org/en/) and run Node LTS installer.

### Project dependencies

To install the project dependencies, run in the project root:

```
npm install
```

## Commands

All commands are listed in [package.json](./package.json) under scripts and they are executable with:

```
npm run <script>
```

Here are some important ones:  
Start up local development environment:

```
npm run dev
```

Run ESLint:

```
npm run lint
```

Run unit tests:

```
npm run test
```

Run performance tests:

```
npm run performance
```

Generate unit test coverage report:

```
npm run coverage
```
