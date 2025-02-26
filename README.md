# tiralabra - Battle Sheep

Battle Sheep board game website for
[Data Structures Lab](https://tiralabra.github.io/2022_p1/en/) course at
University of Helsinki.

This project is (or was at some point) live at
https://battle-sheep.vercel.app/

### Documentation

[Design document](./docs/design.md) (Määrittelydokumentti)  
[Manual](./docs/manual.md) (Käyttöohje)  
[Testing report](./docs/testing.md) (Testausdokumentti)  
[Implementation report](./docs/implementation.md) (Toteutusdokumentti)

### Weekly reports

[Week 1](./docs/week1_report.md)  
[Week 2](./docs/week2_report.md)  
[Week 3](./docs/week3_report.md)  
[Week 4](./docs/week4_report.md)  
[Week 5](./docs/week5_report.md)  
[Week 6](./docs/week6_report.md)

### Test coverage

https://battle-sheep-coverage.web.app/

## Setting up

Install Node:

#### Linux

Install with [nvm](https://github.com/nvm-sh/nvm) using the installation instructions.

#### Windows

Navigate to the [installer website](https://nodejs.org/en/) and run Node LTS installer.

### Project dependencies

To install the project dependencies, run in the project root:

```
npm install
```

### Start up!

```
npm run dev
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
