# Implementation document

## Project structure

`/src` contains all the source code of the project.
`/src/components` has all the React components used for the UI.
`/src/`

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
