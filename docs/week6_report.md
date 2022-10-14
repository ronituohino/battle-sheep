# Week 4

**Project hours this week: 10**

I started off with reviewing the AI code to find some obvious places to improve on. I cut down my performance eval time quite a bit.
I studied if simply storing evaluated board states in a hash map would improve performance:
For Battle Sheep there are around 10% collisions (board state found in hashMap) when depth=4, but this method does not improve performance, because computing all of the board states into hashes costs about the same.

I reorganized how the moves are handled in alphabeta. Now the iteration is really optimal:

- Take first possible move, and around half the max sheep, compute
- Take second possible move, and around half the max sheep, compute
- ...
- Take first possible move, around half max sheep -1, compute
- ...

This method made alpha-beta pruning take over really quickly and I got down to depth=6 in the web version. Going to keep it at depth=5, to minimize latency in the web browser.

I tried to use hash tables to reorganize the moves list, but I feel like I'm either doing it wrong, or the gains are too small.

I think I'm actually not going to implement a heuristic for the starting tile:

- The game could become boring if the AI would always choose the same tile(s) as the starting spot
- We can't effectively use the alphabeta algorithm because the game tree would be massive
- I'm lazy

### What I learned this week

I read more about JS data structures, specifically hash maps.

I managed to optimize the AI quite a bit with a new move organizing algorithm.

### Next up

More levels for unit and performance testing.
More unit tests on some obvious cases in ai.
More performance tests on different levels.

Clean the UI.
