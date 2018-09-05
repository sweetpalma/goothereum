/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const {Wallet, Block, Transaction} = require('../goothereum');

// Example wallets:
const bob   = Wallet.create();
const alice = Wallet.create();

// Dummy chain:
const blockchain = [];

// Pushing genesis (first) block into the chain:
blockchain.push(
    new Block({
        parentHash:   null,
        stateHash:    null,
        miner:        bob.publicKey,
        transactions: [],
    }).mine(),
);

// Block hash must start from two zeroes:
console.log(blockchain[0].hash());

// Pushing second block into the chain, linked with the previous one:
blockchain.push(
    new Block({
        parentHash:   blockchain[blockchain.length - 1].hash(),
        stateHash:    null,
        miner:        bob.publicKey,
        transactions: [
            new Transaction({
                from:  bob  .publicKey,
                to:    alice.publicKey,
                value: 15,
                nonce: 0,
            }).sign(bob.privateKey),
        ],
    }).mine(),
);

// Block hash must start from two zeroes:
console.log(blockchain[1].hash());
