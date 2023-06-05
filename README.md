# BMRSPIS
This repo is dedicated for auditing purposes of the "Boomerang - Share Profit Insurance Sales" aka BMR|SPIS coin.

## Installation
- `npm i --force` to install node_modules which skips the `@nomiclabs/hardhat-waffle@2.0.5` resolve error.
- `npx hardhat node` to start Hardhat chain node - let the process run
- `npm run test` to run unit tests

 ## Deploy to BSC-test
- `npx hardhat --network bsc-test deploy` to deploy
- `npx hardhat verify --network bsc-test 0xContractAddressHere` to upload source (verify)