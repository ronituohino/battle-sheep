# Week 4

**Project hours this week: 5**

This week I focused more on the AI. I fixed the minimax algorithm which is optimized with alpha-beta pruning.
I limited the game only for 2 players to make writing the minimax simpler, and give more computing power to the AI.

### What I learned this week

I learned how minimax & alpha-beta pruning works.

### Next up

Fixing some bugs I discovered:

- The AI can 'overwrite' a start tile that a previous player selected
- Non-highlighted tiles can be selected during the starting round, breaking the game

Heuristic for selecting the starting tile.

Optimizing and improving the AI. I can see from the coverage report that some lines of code have been ran nearly a million times.

Optimize.
Move order is important: Select sheep amount first (use heuristic? favor free space), then loop through possible moves.
