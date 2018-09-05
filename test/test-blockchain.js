/* Goothereum Test by SweetPalma, 2018. All rights reserved. */
const {Wallet, Block, Blockchain, Transaction, CONFIG} = require('../goothereum');
const assert = require('assert');

/* Data: Two wallets: */
const bob   = Wallet.create();
const alice = Wallet.create();

/* Data: Dummy transaction: */
const dummyTransaction = {
    from:  bob.publicKey,
    to:    alice.publicKey,
    value: 5,
    nonce: 0,
};

/* Data Factory: Generate valid block data using blockchain reference: */
const createDummyBlock = (bc) => ({
    parentHash:   bc.blocks[bc.blocks.length - 1].hash(),
    stateHash:    bc.state.hash(),
    miner:        bob.publicKey,
    transactions: [
        new Transaction({...dummyTransaction, nonce: 0}).sign(bob.privateKey),
        new Transaction({...dummyTransaction, nonce: 1}).sign(bob.privateKey),
    ],
});

/* Test #1: Mining must reward miner: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    bc.mine(bob.publicKey);
    assert(bc.baln(bob.publicKey) === CONFIG.BLOCK_REWARD * 2, 'Mining should work.');
}

/* Test #2: Blockchain must accept valid block: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    bc.push(new Block({...createDummyBlock(bc)}).mine());
    assert(bc.baln(bob  .publicKey) == CONFIG.BLOCK_REWARD * 2 - dummyTransaction.value * 2);
    assert(bc.baln(alice.publicKey) == dummyTransaction.value * 2);
}

/* Test #3: Blockchain must throw error if block is not mined: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc)}));
    assert.throws(wrapper, 'Blockchain must throw error if block is not mined.');
}

/* Test #4: Blockchain must throw error if block has invalid parentHash: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), parentHash: null}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if block has invalid parentHash.');
}

/* Test #5: Blockchain must throw error if block has invalid stateHash: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), stateHash: null}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if block has invalid stateHash.');
}

/* Test #6: Blockchain must throw error if block has invalid transaction order: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), transactions: [
        new Transaction({...dummyTransaction, nonce: 9999}).sign(bob.privateKey),
        new Transaction({...dummyTransaction, nonce: 0000}).sign(bob.privateKey),
    ]}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if block has invalid transaction order.');
}

/* Test #7: Blockchain must throw error if block has unsigned transactions: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), transactions: [
        new Transaction({...dummyTransaction, nonce: 0}),
        new Transaction({...dummyTransaction, nonce: 1}).sign(bob.privateKey),
    ]}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if block has unsigned transactions.');
}

/* Test #8: Blockchain must throw error if wallet has insufficient funds: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), transactions: [
        new Transaction({...dummyTransaction, nonce: 0, value: 9000}).sign(bob.privateKey),
        new Transaction({...dummyTransaction, nonce: 1}).sign(bob.privateKey),
    ]}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if wallet has insufficient funds.');
}

/* Test #9: Blockchain must throw error if wallet has invalid nonce: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), transactions: [
        new Transaction({...dummyTransaction, nonce: 0}).sign(bob.privateKey),
        new Transaction({...dummyTransaction, nonce: 0}).sign(bob.privateKey),
    ]}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if wallet has invalid nonce.');
}

/* Test #10: Blockchain must throw error if transaction is signed using wrong key: */
{
    const bc = new Blockchain();
    bc.mine(bob.publicKey);
    const wrapper = () => bc.push(new Block({...createDummyBlock(bc), transactions: [
        new Transaction({...dummyTransaction, nonce: 0}).sign(alice.privateKey),
        new Transaction({...dummyTransaction, nonce: 1}).sign(bob.privateKey),
    ]}).mine());
    assert.throws(wrapper, 'Blockchain must throw error if transaction is signed using wrong key.');
}
