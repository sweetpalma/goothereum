/* Goothereum Test by SweetPalma, 2018. All rights reserved. */
const {Wallet, Transaction} = require('../goothereum');
const assert = require('assert');

/* Data: Two wallets: */
const bob   = Wallet.create();
const alice = Wallet.create();

/* Data: Dummy transaction: */
const dummyTransaction = {
	from:  bob.publicKey,
	to:    alice.publicKey,
	value: 1,
	nonce: 0,
};

/* Test #1: Transaction .test() must return true for properly signed TX: */
{
	const signed = new Transaction({...dummyTransaction}).sign(bob.privateKey);
	assert(signed.test() === true, 'Transaction must be valid.');
}

/* Test #2: Transaction .test() must return false for  unsigned TX: */
{
	const signed = new Transaction({...dummyTransaction});
	assert(signed.test() === false, 'Transaction must not be valid.');
}

/* Test #3: Transaction .test() must return false for TX signed with another key: */
{
	const signed = new Transaction({...dummyTransaction}).sign(alice.privateKey);
	assert(signed.test() === false, 'Transaction must not be valid.');
}
