/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const {Block, Transaction, State} = require('../goothereum');

// Initial state reference:
let state = new State();

// Step #1: Imitate mining:
state = state.with(new Block({miner: 'bob'}));

// Step #2: Send some money from Bob to Alice:
state = state.with(new Transaction({from: 'bob', to: 'alice', value: 15, nonce: 0}));

// Check status:
console.log(state);
// Expected result:
// Bob:   {value: 35, nonce: 1}
// Alice: {value: 15, nonce: 0}
