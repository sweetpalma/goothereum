/* Goothereum Test by SweetPalma, 2018. All rights reserved. */
const {Transaction, Block, State, CONFIG} = require('../goothereum');
const assert = require('assert');

/* Test #1: State must consume transactions: */
{
	let state = new State({wallets: {
		one: {value: 150, nonce: 0},
	}});
	state = state.with(new Transaction({from: 'one', to: 'two', value: 50}));
	state = state.with(new Transaction({from: 'one', to: 'two', value: 15}));
	assert(state.wallets.one.value === 85, 'Balance of the sender must deplete.');
	assert(state.wallets.two.value === 65, 'Balance of the target must raise.');
}

/* Test #2: State must consume block mining rewards: */
{
	let state = new State();
	state = state.with(new Block({miner: 'miner'}));
	state = state.with(new Block({miner: 'miner'}));
	assert(state.wallets.miner.value === CONFIG.BLOCK_REWARD * 2, 'Balance of the miner must raise.');
}

/* Test #3: State hash must remain the same no matter how wallets are ordered: */
{
	const stateOneHash = new State({
		wallets: {
			'one': {value: 15, nonce: 0},
			'two': {value: 0, nonce: 15},
		},
	}).hash();
	const stateTwoHash = new State({
		wallets: {
			'two': {value: 0, nonce: 15},
			'one': {value: 15, nonce: 0},
		},
	}).hash();
	assert(stateOneHash === stateTwoHash, 'State hash must ignore wallet order.');
}
