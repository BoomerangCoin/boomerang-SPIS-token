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

	solidity: "0.8.4",

	// TODO Critical: This is deployed, but keeps triggering CLI warnings whenever using hardhat.
	//solidity: "0.8.11",

	defaultNetwork: "hardhat",

	networks: {

		hardhat: {
			chainId: 31337,
		},

		'eth-rinkeby': {
			url: process.env.ALCHEMYAPI_ETH_RINKEBY_URL,
			accounts: [process.env.ALCHEMYAPI_ETH_RINKEBY_PK]
		},

		/*
		'polygon-main': {
		   url: process.env.ALCHEMYAPI_POLYGON_MAINNET_URL,
		   accounts: [process.env.ALCHEMYAPI_POLYGON_MAINNET_PK]
		}
		*/

		'polygon-mumbai': {
			url: process.env.ALCHEMYAPI_POLYGON_MUMBAI_URL,
			accounts: [
				process.env.ACCOUNTS_POLYGON_MUMBAI_DEPLOYER_PK,
				process.env.ACCOUNTS_POLYGON_MUMBAI_ANONYMOUS_PK,
				process.env.ACCOUNTS_POLYGON_MUMBAI_DEVMANAGER_PK,
				//process.env.ALCHEMYAPI_POLYGON_MUMBAI_PK
			]
		},
	},

	etherscan: {
		//apiKey: process.env.ETHERSCAN_API_KEY,
		apiKey: process.env.POLYGONSCAN_API_KEY,
	},

	polygonscan: {
		apiKey: process.env.POLYGONSCAN_API_KEY,
	},

	gasReporter: {
		enabled: process.env.REPORT_GAS === 'true',
	},

	namedAccounts: {
		deployer: {
			default: 0,
			'polygon-mumbai': process.env.ACCOUNTS_POLYGON_MUMBAI_DEPLOYER_ADDRESS,
		},
		anonymous: {
			default: 1,
			'polygon-mumbai': process.env.ACCOUNTS_POLYGON_MUMBAI_ANONYMOUS_ADDRESS,
		},
		devManager: {
			default: 4,
			'polygon-mumbai': process.env.ACCOUNTS_POLYGON_MUMBAI_DEVMANAGER_ADDRESS
			//localhost: process.env.DEV_MANAGER_ADDRESS
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
