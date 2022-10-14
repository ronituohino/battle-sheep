# Project structure

`/src` contains all the source code of the project.

`/src/index.tsx` initializes the React app.  
`/src/components` has all the React components used for the UI.  
`/src/game` has core logic files implemented as functions:

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
`/.firebase` has some temporary firebase files idk.

# AI Performance

# Flaws & improvements
