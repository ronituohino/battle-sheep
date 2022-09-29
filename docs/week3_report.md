# Week 3

**Project hours this week: 11**

This week I focused on getting the AI to work on the game board using a minimax.

I also added unit tests for the new functions
I also added a small notification for when the game ends and a function to check who won the game.

### What I learned this week

Writing AI is not easy, and it is really difficult to test. (Hard to evaluate what behaviour is 'good')

### Troubles

I had quite a bit of trouble with the minimax function. I am not sure if it really works..?  
Also I am not that confident with the heuristic function that I came up with.

### Next up

Fixing some bugs I discovered:

- The AI can 'overwrite' a start tile that a previous player selected
- Non-highlighted tiles can be selected during the starting round, breaking the game

Optimizing and improving the AI. I can see from the coverage report that some lines of code have been ran nearly a million times.
