/* Goothereum Test by SweetPalma, 2018. All rights reserved. */
const {Block} = require('../goothereum');
const assert = require('assert');

/* Test #1: Block .test() must return true for mined blocks: */
{
    const block = new Block().mine();
    assert(block.test() === true, 'Must return true for mined block.');
}

/* Test #2: Block .test() must return false for blocks that weren't mined: */
{
    const block = new Block();
    assert(block.test() === false, 'Must return false for block that wasn`t mined.');
}
