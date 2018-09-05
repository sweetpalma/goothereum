==========
Goothereum
==========

    Copyright 2018 SweetPalma <sweet.palma@yandex.ru>

Own Blockchain in 160 lines of JavaScript - repository for Medium article code: https://medium.com/@sweetpalma/goothereum-blockchain-in-160-lines-of-javascript-8052ca448857

Introduction
============
Ethereum was released three years ago — and it quickly became a de facto standard of decentralized trust management by introducing a powerful smart contracting platform. Together with its spiritual predecessor Bitcoin it also changed how the financial world works — by introducing a completely new way of sharing funds.

But despite of popularity, the way how blockchain works under the hood is still a mystery for many developers. From my standpoint blockchain solutions seem to be pretty interesting and I want to share my modest knowledge with others — that’s why this repository exists.

Installation & Usage
====================
This is a standalone version of Goothereum - it can be installed with NPM:

.. code-block:: 
    
    npm install sweetpalma/goothereum

And used just as a regular JavaScript library:

.. code-block:: javascript

    const {Wallet, Transaction, Block, Blockchain} = require('goothereum');

Now you can write some simple blockchain interactions:

.. code-block:: javascript

    // Create wallets:
    const alice = Wallet.create();
    const bob   = Wallet.create();

    // Create blockchain and mine first empty reward block:
    const chain = new Blockchain();
    chain.mine(bob.publicKey);

    // Check balance (must be Bob: 50 and Alice: 0):
    console.log('Bob:',   chain.baln(bob  .publicKey));
    console.log('Alice:', chain.baln(alice.publicKey));

    // Mine new block with transaction to Alice:
    chain.mine(bob.publicKey, [
        new Transaction({
            from:  bob  .publicKey,
            to:    alice.publicKey,
            value: 15,
            nonce: 0,
        }).sign(bob.privateKey),
    ]);

    // Check balance again (must be Bob: 85 and Alice: 15):
    console.log('Bob:',   chain.baln(bob  .publicKey));
    console.log('Alice:', chain.baln(alice.publicKey));

Keep in mind that Goothereum was made to demonstrate basic blockchain principles and is not even near to be any kind of production-ready product. Use it for educational purposes only.

License
=======
Goothereum is licensed under the MIT License, what allows you to use it for basically anything absolutely for free. It would be great if somebody will find it useful.
