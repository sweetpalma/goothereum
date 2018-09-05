/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const {Wallet, Transaction} = require('../goothereum');

// Example wallets:
const bob   = Wallet.create();
const alice = Wallet.create();

// Making a valid transaction:
const transactionOne = new Transaction({
    from:  bob  .publicKey,
    to:    alice.publicKey,
    nonce: 0,
    value: 15,
}).sign(bob.privateKey);

// Making an invalid transaction without a signature:
const transactionTwo = new Transaction({
    from:  bob  .publicKey,
    to:    alice.publicKey,
    nonce: 0,
    value: 15,
});

// Making an invalid transaction with a fraud signature:
const transactionThree = new Transaction({
    from:  bob  .publicKey,
    to:    alice.publicKey,
    nonce: 0,
    value: 15,
}).sign(alice.privateKey);

// Checking status:
console.log('Transaction #1 status:', transactionOne.test());
console.log('Transaction #2 status:', transactionTwo.test());
console.log('Transaction #3 status:', transactionThree.test());
// Expected results: true, false, false
