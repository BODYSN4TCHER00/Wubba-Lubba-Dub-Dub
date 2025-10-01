# Testing Instructions

## Test Scenarios

### 1. Run with 3 boxes and ClassicMorty (3 rounds and result table)
node index.js 3 ClassicMorty

### 2. Run with 3 boxes and LazyMorty (3 rounds and result table)
node index.js 3 LazyMorty.

### 3. Run with incorrect parameters

#### No arguments
node index.js
Expected: Error message about missing arguments.

#### Only one argument equal to 1
node index.js 1
Expected: Error message about missing Morty class argument.

#### Non-existgitent Morty class
node index.js 3 NonExistentMorty
Expected: Error message about invalid Morty class.