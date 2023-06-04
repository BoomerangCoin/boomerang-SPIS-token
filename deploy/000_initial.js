// TODO Critical: Make live deploy and local deploy as well.

const {ethers, getNamedAccounts, network, deployments} = require("hardhat");

async function deployBMRSPIS() {

	// Deploy coin.
	const {deployer} = await getNamedAccounts();

	await deployments.deploy('BMRSPIS', {
		from: deployer,
	});
}

module.exports = async ({getNamedAccounts, deployments}) => {

	//
	await deployBMRSPIS();

	// Log due to not running in tests?
	if (!process.env.MOCHA_COLORS)
		console.info('✅ Initial deploy done!');
};

//module.exports.tags = ['deploy'];
