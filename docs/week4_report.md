# Week 4

**Project hours this week: 7**

This week I focused more on the AI. I fixed the minimax algorithm which is optimized with alpha-beta pruning.
I limited the game only for 2 players to make writing the minimax simpler, and give more computing power to the AI.

I added performance testing to the project.

I also optimized the AI by changing the sheep amount iteration from 1-maxSheep into:

- Start from s = maxSheep / 2
- next s+1
- next s-2
- ...

This makes alpha-beta pruning take action way earlier increasing performance by a multiple in some cases.

### What I learned this week

I learned how minimax & alpha-beta pruning works.

### Next up

Fixing some bugs I discovered:

- The AI can 'overwrite' a start tile that a previous player selected
- Non-highlighted tiles can be selected during the starting round, breaking the game

Heuristic for selecting the starting tile.

Optimizing and improving the AI...
