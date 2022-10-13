# Week 4

**Project hours this week: 4**

I started off with reviewing the AI code to find some obvious places to improve on. I cut down my performance eval time quite a bit.
I studied if simply storing evaluated board states in a hash map would improve performance:
For Battle Sheep there are around 10% collisions (board state found in hashMap) when depth=4, but this method does not improve performance, because computing all of the board states into hashes costs about the same.

### What I learned this week

I read more about JS data structures, specifically hash maps.

### Next up

Optimizing and improving the AI... (transposition tables)
Heuristic for selecting the starting tile.
More unit tests on some specific functions in game/ai.
Update documentation.
Clean the UI.
