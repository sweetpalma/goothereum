/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const {Wallet} = require('../goothereum');
const {createSign, createVerify} = require('crypto');

// Method that returns data signature:
const sign = (data, publicKey, privateKey) => {
    const cert = Wallet.getNodePrivateKey(publicKey, privateKey);
    return createSign('SHA256').update(data).sign(cert, 'hex');
};

// Method that verifies signature:
const verify = (data, publicKey, signature) => {
    const cert = Wallet.getNodePublicKey(publicKey);
    return createVerify('SHA256').update(data).verify(cert, signature, 'hex');
};

// Example wallets:
const bob   = Wallet.create();
const alice = Wallet.create();

// Case #1: Order that has a valid signature:
const orderOne = 'send ten bucks from bob to alice';
const orderOneIssuer = bob.publicKey;
const orderOneSignature = sign(orderOne, orderOneIssuer, bob.privateKey);

// Case #2: Order that has a fraud signature from another person:
const orderTwo = 'send thousand bucks from bob to alice';
const orderTwoIssuer = bob.publicKey;
const orderTwoSignature = sign(orderTwo, orderOneIssuer, alice.privateKey);
 
// Verification:
console.log('Order #1 status:', verify(orderOne, orderOneIssuer, orderOneSignature));
console.log('Order #2 status:', verify(orderTwo, orderTwoIssuer, orderTwoSignature));
// Expected results: true, false
