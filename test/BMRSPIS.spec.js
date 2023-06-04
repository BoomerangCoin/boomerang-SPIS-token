// TODO High: Refactor, place utils functions in helpers.js, and every functionality in its own test file (staking, claim, rewards, etc).

const {expect} = require("chai");
const { parseUnits} = require("ethers/lib/utils");
const {initBeforeEach, contracts, signers, formatPercentagePerMille, timeTravel, parseUsdt} = require("./lib/helpers");
const {ethers} = require("hardhat");

beforeEach(initBeforeEach);

describe('BMSPIS', function () {

	it('Does mint tokens for deployer', async () => {

		expect((await contracts['BMRSPIS'].balanceOf(signers['deployer'].address)))
			.to.be.bignumber.equal(parseUnits('100'));
	});

	it('Not mintable', async () => {
		expect(contracts['BMRSPIS']).not.have.property('mint');
	});

	it('Has a total supply of 100.0', async () => {
		expect(await contracts['BMRSPIS'].totalSupply())
			.to.be.bignumber.equal(parseUnits('100', 18));
	});

	it('Deployer can sent tokens', async () => {

		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('2'));

		expect((await contracts['BMRSPIS'].balanceOf(signers['deployer'].address)))
			.to.be.bignumber.equal(parseUnits('98'));

		expect((await contracts['BMRSPIS'].balanceOf(signers['anonymous'].address)))
			.to.be.bignumber.equal(parseUnits('2'));
	});

	it('Transferring adjusts voting power', async() =>
	{
		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('2'));

		expect((await contracts['BMRSPIS'].getVotes(signers['deployer'].address)))
			.to.be.bignumber.equal(parseUnits('98'));

		expect((await contracts['BMRSPIS'].getVotes(signers['anonymous'].address)))
			.to.be.bignumber.equal(parseUnits('2'));
	});

	it('Transferring sets delegation of new holders', async() =>
	{
		// None yet.
		expect((await contracts['BMRSPIS'].delegates(signers['anonymous'].address)))
			.to.be.equal(ethers.constants.AddressZero);

		// Set
		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('2'));

		expect((await contracts['BMRSPIS'].delegates(signers['anonymous'].address)))
			.to.be.equal(signers['anonymous'].address);
	});

	it('Transferring does not set delegation of existing holders', async() =>
	{
		// Set
		await contracts['BMRSPIS']
			.connect(signers['anonymous'])
			.delegate(signers['devManager'].address);

		expect((await contracts['BMRSPIS'].delegates(signers['anonymous'].address)))
			.to.be.equal(signers['devManager'].address);

		// Transfer votes.
		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('2'));

		expect((await contracts['BMRSPIS'].delegates(signers['anonymous'].address)))
			.to.be.equal(signers['devManager'].address);
	});

	it('Can give voting power of the past', async () => {

		// Set voting.
		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('2'));

		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('3'));

		await contracts['BMRSPIS']
			.connect(signers['deployer'])
			.transfer(signers['anonymous'].address, parseUnits('5'));

		// Expect by traveling back to the past.
		await ethers.provider.send('evm_mine');

		const latestBlock = await ethers.provider.getBlock("latest");

		expect((await contracts['BMRSPIS'].getPastVotes(signers['anonymous'].address, latestBlock.number - 1)))
			.to.be.bignumber.equal(parseUnits('10'));

		expect((await contracts['BMRSPIS'].getPastVotes(signers['anonymous'].address, latestBlock.number - 2)))
			.to.be.bignumber.equal(parseUnits('5'));

		expect((await contracts['BMRSPIS'].getPastVotes(signers['anonymous'].address, latestBlock.number - 3)))
			.to.be.bignumber.equal(parseUnits('2'));
	});

});
