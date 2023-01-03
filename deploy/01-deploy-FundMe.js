const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log, get } = deployments;
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;

    if (!!developmentChains.includes(network.name)) {
        const MockV3Aggregator = await get("MockV3Aggregator");
        ethUsdPriceFeedAddress = MockV3Aggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
    }

    const args = [ethUsdPriceFeedAddress];
    log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Deploying Contract Please Wait...");
    const FundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
        log: true,
    });
    log("\x1b[32m%s\x1b[0m", "Contract Deployed!");
    log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    log("");

    if (!developmentChains.includes(network.name) && !!process.env.ETHERSCAN_API_KEY) {
        log("-------------------------------------------------------------------");
        log("\x1b[33m%s\x1b[0m", "Verifying Contract Please Wait...");
        await verify(FundMe.address, args);
        log("-------------------------------------------------------------------");
    }
};

module.exports.tags = ["all", "FundMe"];
