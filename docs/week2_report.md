# Week 2

**Project hours this week: 20**

This week was mostly spent on figuring out the project structure and essential UI.

I configured ESLint for code quality checking, and Vitest for unit testing.
I made unit tests for the [game.ts](../src/game.ts) and [ai.ts](../src/ai.ts) utility files, and the ability to create a coverage report.

I added documentation with JSDoc.
I also refactored the existing code a bit to make the project cleaner.

I also added a site for the test coverage at https://battle-sheep-coverage.web.app/

### What I learned this week

Project architecture/structure is difficult, even in a relatively small scale. I tried to separate the game logic from the UI, but the React framework really likes to tie these things together. The project feels a bit messy right now, but I think I can do some more cleanup later.

I moved from using null to undefined: I feel like undefined is better because it reduces the amount of code. The JS community [has divided opinions](https://stackoverflow.com/questions/6604749/what-reason-is-there-to-use-null-instead-of-undefined-in-javascript) on this topic, and some interesting ways to [try and describe the difference](https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript#answer-57249968).

I also learned about the Vitest library.

### Next up

The fun part: implementing AI logic.
