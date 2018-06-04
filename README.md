sweeper
=======

**Minesweeper RPG!**

Instead of just *finding* all the mines in a board, now you have to *fight* them. This time the classic Minesweeper land mines have brought all their explodey friends from the littlest bubbles to the biggest bombs, so get out there and clear that minefield, soldier!

Uncovering a mine invokes the combat mechanics: You and the mine take turns attacking each other, dealing damage equal to your own level. Whoever runs out of HP first is the loser. Thus it is safe to attack a mine of your own level or lower. Attacking a higher-level mine is not always a game-over, but be careful. Gain levels by defeating mines. Win the game by clearing the entire board.

Point at a square on the board and flag it by pressing a number key to indicate the level of the mine you believe is contained within ('0' clears). If a square is flagged higher than your current level it is protected from clicks.

Board dimensions, max. monster level, monster count, and initial player HP are configurable. Level-up is exponential, first-level XP and XP ratio are configurable for now.

**Sweeper is live, [Play It Here](http://geofrey.github.io/sweeper/sweeper.html).**

Obvious bugs
---

* Sometimes the game is not winnable. Still pondering how to do the monster-level distribution.
* Losing the last fight on the board shows the 'win' and 'lose' messages at the same time.
