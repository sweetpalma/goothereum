/* Goothereum by SweetPalma, 2018. All rights reserved. */
const {createHash, createECDH, createSign, createVerify} = require('crypto');
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});

const Wallet = exports.Wallet = class Wallet {
    constructor(opts={}) {
        Object.assign(this, {
            publicKey: null, privateKey: null,
        }, opts);
    }

    static create() {
        const keypair = createECDH('secp256k1');
        keypair.generateKeys();
        return new Wallet({
            publicKey:  keypair.getPublicKey ('hex'),
            privateKey: keypair.getPrivateKey('hex'),
        });
    }

    static getNodePrivateKey(user, key) {
        const t = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';
        const k = Buffer.from(t + key + 'a144034200' + user, 'hex').toString('base64');
        return `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`;
    }

    static getNodePublicKey(user) {
        const t = '3056301006072a8648ce3d020106052b8104000a034200';
        const k = Buffer.from(t + user,  'hex').toString('base64');
        return `-----BEGIN PUBLIC KEY-----\n${k}\n-----END PUBLIC KEY-----`;
    }
};

const Transaction = exports.Transaction = class Transaction {
    constructor(opts={}) {
        Object.assign(this, {
            from: null, to: null, value: 0, nonce: 0, signature: null,
        }, opts);
    }

    hash() {
        const head = JSON.stringify(this, ['from', 'to', 'value', 'nonce']);
        return createHash('SHA256').update(head).digest('hex');
    }

    sign(privateKey) {
        const cert = Wallet.getNodePrivateKey(this.from, privateKey);
        const signature = createSign('SHA256').update(this.hash()).sign(cert, 'hex');
        return new Transaction({...this, signature});
    }

    test() {
        const cert = Wallet.getNodePublicKey(this.from);
        const signature = createVerify('SHA256').update(this.hash());
        if (!(this.from) || !(this.signature))  return false;
        return signature.verify(cert, this.signature, 'hex');
    }
};

const Block = exports.Block = class Block {
    constructor(opts={}) {
        Object.assign(this, {
            parentHash: null, stateHash: null, miner: null, nonce: 0, transactions: [],
        }, opts);
    }

    hash() {
        const head = JSON.stringify(this,['parentHash', 'stateHash', 'miner', 'nonce']);
        const tail = JSON.stringify(this.transactions.map(tx => tx.hash()));
        return createHash('SHA256').update(head + tail).digest('hex');
    }

    mine(min=0, max=Number.MAX_SAFE_INTEGER) {
        for (let nonce = min; nonce <= max; nonce++) {
            const block = new Block({...this, nonce});
            if (block.test()) return block;
        }
    }

    test() {
        const mask = '0'.repeat(CONFIG.BLOCK_DIFFICULTY);
        return this.hash().startsWith(mask);
    }
};

const State = exports.State = class State {
    constructor(opts={}) {
        Object.assign(this, {wallets: {}}, opts);
    }

    hash() {
        const keys = Object.keys(this.wallets).sort();
        const head = JSON.stringify(keys);
        const tail = JSON.stringify(keys.map(wl => this.wallets[wl]));
        return createHash('SHA256').update(head + tail).digest('hex');
    }

    with(mt) {
        if (mt instanceof Transaction) {
            const sender = this.wallets[mt.from] || {value: 0, nonce: 0};
            const target = this.wallets[(mt.to)] || {value: 0, nonce: 0};
            return new State({ ...this, wallets: { ...this.wallets,
                [mt.from]: {value: sender.value - mt.value, nonce: sender.nonce + 1},
                [(mt.to)]: {value: target.value + mt.value, nonce: target.nonce},
            }});
        } else {
            const miner = this.wallets[mt.miner] || {value: 0, nonce: 0};
            return new State({ ...this, wallets: { ...this.wallets, 
                [mt.miner]: {...miner, value: miner.value + CONFIG.BLOCK_REWARD},
            }});
        }
    }
};

const Blockchain = exports.Blockchain = class Blockchain {
    constructor(opts={}) {
        Object.assign(this, {
            state: new State(), blocks: new Array(),
        }, opts);
    }

    static verifyTransaction(prev, state, tx) {
        const sender = state.wallets[tx.from] || {value: 0};
        if (tx.value <= 0 || sender.value < tx.value) throw Error('Bad value.');
        if (tx.nonce <  0 || sender.nonce > tx.nonce) throw Error('Bad nonce.');
        if (prev && prev.nonce > tx.nonce) throw Error('Bad nonce order.');
        if (!tx.test()) throw Error('Transaction is not signed properly.');
        return state.with(tx);
    }

    static verifyBlock(prev, state, block) {
        if (prev && block.parentHash !== prev .hash()) throw Error('Bad parentHash.');
        if (prev && block.stateHash  !== state.hash()) throw Error('Bad stateHash.' )
        if (!block.test()) throw Error('Block is not mined properly.');
        return block.transactions.reduce((state, tx, index) => {
            const prev = block.transactions[index - 1] || (null);
            return Blockchain.verifyTransaction(prev, state, tx);
        }, state.with(block));
    }

    baln(address) {
        if (!this.state.wallets[address]) return (0);
        return this.state.wallets[address].value;
    }

    push(block) {
        const prev = (this.blocks[this.blocks.length - 1]) || (null);
        this.state = Blockchain.verifyBlock(prev, this.state, block);
        this.blocks.push(block);
    }

    mine(miner, transactions=[]) {
        const prev = (this.blocks[this.blocks.length - 1]) || (null);
        this.push(new Block({
            parentHash:   prev && prev.hash(),
            stateHash:    this.state.hash(),
            transactions, miner,
        }).mine());
    }
};