const {ethers, getNamedAccounts, deployments, network} = require("hardhat");
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');
const moment = require("moment");
const Sugar = require('sugar');
const {parseEther, formatEther, parseUnits, formatUnits} = require("ethers/lib/utils");

function str2time(input) {

	// Parse human input?
	if (typeof input == 'string') {
		return Math.round(Sugar.Date.create(input).getTime() / 100);
	}

	// Parse default JS format?
	return Math.round((new Date(input)).getTime() / 1000);
}

let signers = {};

async function loadSigners() {
	let namedAccounts = await getNamedAccounts();

	for (let name of Object.keys(namedAccounts))
		signers[name] = await ethers.getSigner(namedAccounts[name]);
}

let contracts = {};

async function loadContracts() {

	// Init default contracts.
	let anonymous = signers['anonymous'];

	for (let [name, deployment] of Object.entries(await deployments.all())) {
		contracts[name] = new ethers.Contract(deployment.address, deployment.abi, anonymous);
	}
}

function formatPercentagePerMille(percentage) {
	return percentage * 10;
}

function parsePercentagePerMille(value) {
	return value / 10;
}

async function initBeforeEach() {

	// Deploy
	this.timeout(30000);

	await network.provider.send("hardhat_reset");
	await deployments.fixture();

	// Load contracts.
	await loadSigners();
	await loadContracts();
}

function getEventsFromTx(tx, abi) {
	let iface = new ethers.utils.Interface(abi);

	return tx.events.map((log) => {
		try {
			return iface.parseLog(log);
		} catch (ex) {
		}
	}).filter(Boolean);
}

async function timeTravel(amount, unit) {
	let date = moment().add(amount, unit);

	await ethers.provider.send('evm_setNextBlockTimestamp', [date.unix()]);
	await ethers.provider.send('evm_mine', [date.unix()]);
}

function parseUsdt(amount) {
	return parseUnits(amount, 6);
}

function formatUsdt(amount) {
	return formatUnits(amount, 6);
}

module.exports = {
	initBeforeEach,
	contracts,
	signers,
	str2time,
	formatPercentagePerMille,
	parsePercentagePerMille,
	getEventsFromTx,
	timeTravel,
	parseUsdt,
	formatUsdt,
};
