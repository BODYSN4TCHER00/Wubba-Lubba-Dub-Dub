# Testing Instructions

## Test Scenarios

### 1. Run with 3 boxes and ClassicMorty (3 rounds and result table)
node index.js 3 ./src/morties/ClassicMorty.js ClassicMorty

### 2. Run with 3 boxes and LazyMorty (3 rounds and result table)
node index.js 3 ./src/morties/LazyMorty.js LazyMorty.

### 3. Run with incorrect parameters

#### No arguments
node index.js
Expected: Error message about incorrect number of arguments (expected 3).

#### Only one argument equal to 1
node index.js 1

#### Non-existent Morty class
node index.js 3 ./src/morties/NonExistentMorty.js NonExistentMorty
Expected: Error message about Morty implementation file not found.

#### Invalid box count (less than 3)
node index.js 2 ./src/morties/ClassicMorty.js ClassicMorty
