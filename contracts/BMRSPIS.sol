// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * Ownership of this token gives you the right on profit of sold insurances of Boomerang Coin (BMR).
 *
 * @author ZacTheDev from https://boomerangcoin.com/
 **/
contract BMRSPIS is ERC20Votes {

	constructor() ERC20("Boomerang - Share Profit Insurance Sales", "BMR|SPIS") ERC20Permit("BMR|SPIS") {

		// Initially we give 100% shares to deployer.
		_mint(msg.sender, 100 * (10 ** decimals()));
	}

	function _afterTokenTransfer(address from, address to, uint256 amount) internal override {
		super._afterTokenTransfer(from, to, amount);

		// @see https://forum.openzeppelin.com/t/self-delegation-in-erc20votes/17501/16
		// If the (new) receiver didn't set up a delegator yet, then we set it to himself. This way voting power = balance.
		if (to != address(0) && numCheckpoints(to) == 0 && delegates(to) == address(0)) {
			_delegate(to, to);
		}
	}

}
