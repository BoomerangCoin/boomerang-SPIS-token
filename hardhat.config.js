require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('hardhat-watcher');

require('dotenv').config()

var chai = require('chai');

//use default BigNumber
chai.use(require('chai-bignumber')());
//chai.use(require('chai-as-promised'));

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

	// TODO Critical: This is deployed, but keeps triggering CLI warnings whenever using hardhat.
	solidity: "0.8.9", // As seen in openzeppelin-contracts/hardhat.config.js
	//solidity: "0.8.4",

	defaultNetwork: "hardhat",

	networks: {

		hardhat: {
			chainId: 31337,
		},
		'bsc-test': {
			url: "https://data-seed-prebsc-1-s1.binance.org:8545",
			chainId: 97,
			gasPrice: 20000000000,
			accounts: [
				process.env.ACCOUNTS_BSC_TEST_DEPLOYER_PK,
			]
		},
		'bsc-main': {
			url: "https://bsc-dataseed.binance.org/",
			chainId: 56,
			gasPrice: 20000000000,
			accounts: [
				process.env.ACCOUNTS_BSC_TEST_DEPLOYER_PK,
			]
		}
	},

	etherscan: {
		//apiKey: process.env.ETHERSCAN_API_KEY,
		apiKey: process.env.ETHERSCAN_BSC_API_KEY,
	},

	gasReporter: {
		enabled: process.env.REPORT_GAS === 'true',
	},

	namedAccounts: {
		deployer: {
			default: 0,
			'bsc-test': process.env.ACCOUNTS_BSC_TEST_DEPLOYER_ADDRESS,
			'bsc-main': process.env.ACCOUNTS_BSC_TEST_DEPLOYER_ADDRESS,
		},
		anonymous: {
			default: 1,
		},
		devManager: {
			default: 2,
		}
	},

	mocha: {
		timeout: 30 * 1000,
	},

	watcher: {
		compilation: {
			tasks: ['compile'],
		},
	},
};
