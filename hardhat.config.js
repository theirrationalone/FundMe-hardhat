require("@nomicfoundation/hardhat-toolbox");
require("@nomcilabs/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "RPC_URL___not__provided";
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY || "METAMASK_PRIVATE_KEY___not__provided";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "COINMARKETCAP_API_KEY___not__provided";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY___not__provided";

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [METAMASK_PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.8.8" }, { version: "0.6.4" }],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        users: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        noColors: true,
        outputFile: "gas-report.txt",
        currency: "USD",
        token: "MATIC",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    mocha: {
        timeout: 1000 * 60 * 5,
    },
};
