/* Goothereum Test by SweetPalma, 2018. All rights reserved. */
const {Wallet} = require('../goothereum');
const {createSign, createVerify} = require('crypto');
const assert = require('assert');

/* Data: Two wallets: */
const bob   = Wallet.create();
const alice = Wallet.create();

/* Test #1: crypto.createVerify should return true for properly signed data: */
{
	const dataToSign = 'some data to sign';
	const privateKey = Wallet.getNodePrivateKey(bob.publicKey, bob.privateKey);
	const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');

	const publicKey = Wallet.getNodePublicKey(bob.publicKey);
	const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
	assert(isValid, 'crypto.createVerify should return true for properly signed data.');
}

/* Test #2: crypto.createVerify should return false for fraud signature: */
{
	const dataToSign = 'some data to sign';
	const privateKey = Wallet.getNodePrivateKey(bob.publicKey, alice.privateKey);
	const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');

	const publicKey = Wallet.getNodePublicKey(bob.publicKey);
	const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
	assert(!isValid, 'crypto.createVerify should return false for fraud signature.');
}
