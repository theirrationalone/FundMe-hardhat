const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    if (!!developmentChains.includes(network.name)) {
        log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
        log("\x1b[33m%s\x1b[0m", "Local Network Detected Deploying Mocks Please Wait...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
        log("\x1b[32m%s\x1b[0m", "Mocks Deployed!");
        log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
        log("");
    }
};

module.exports.tags = ["all", "mocks"];
