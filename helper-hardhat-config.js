const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "localhost",
    },
};

const developmentChains = ["localhost", "hardhat"];

const DECIMALS = 8; // manage it according to goerli eth/usd price feeds
const INITIAL_ANSWER = 120000000000; // manage it according to goerli eth/usd price feeds

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
};
