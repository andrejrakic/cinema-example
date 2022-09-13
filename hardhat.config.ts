import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.10',
		settings: {
			optimizer: {
				runs: 200,
				enabled: false,
			},
		},
	},
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {},
		// goerli: {
		// 	url: process.env.GOERLI_RPC_URL,
		// 	// chainId: 5,
		// 	accounts:
		// 		process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		// },
	},
};

export default config;
