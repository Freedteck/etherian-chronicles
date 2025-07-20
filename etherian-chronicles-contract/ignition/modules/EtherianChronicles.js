// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EtherianChronicle", (m) => {
  // Declare the EtherianChronicle contract.
  // The first argument is the name you give this deployment artifact within Ignition.
  // The second argument is the contract's name as defined in your Solidity file.
  const etherianChronicle = m.contract("EtherianChronicle");

  // If your contract had constructor arguments, you'd pass them here:
  // const etherianChronicle = m.contract("EtherianChronicle", YourContractArguments);

  // Return the deployed contract to make it accessible to other modules
  // or for verification purposes.
  return { etherianChronicle };
});
