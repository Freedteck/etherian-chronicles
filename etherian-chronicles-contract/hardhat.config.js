require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-network-helpers");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */

if (!vars.has("DEPLOYER_PRIVATE_KEY")) {
  console.error("Missing env var DEPLOYER_PRIVATE_KEY");
}

const deployerPrivateKey = vars.get("DEPLOYER_PRIVATE_KEY");

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      accounts: [deployerPrivateKey],
    },
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: [deployerPrivateKey],
    },
  },
  etherscan: {
    apiKey: {
      etherlinkMainnet: "DUMMY",
      etherlinkTestnet: "DUMMY",
    },
    customChains: [
      {
        network: "etherlinkMainnet",
        chainId: 42793,
        urls: {
          apiURL: "https://explorer.etherlink.com/api",
          browserURL: "https://explorer.etherlink.com",
        },
      },
      {
        network: "etherlinkTestnet",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet.explorer.etherlink.com/api",
          browserURL: "https://testnet.explorer.etherlink.com",
        },
      },
    ],
  },
};
