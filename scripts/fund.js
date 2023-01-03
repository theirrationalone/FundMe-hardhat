const { getNamedAccounts, ethers } = require("hardhat");

const fund = async () => {
    const { deployer } = await getNamedAccounts();
    const FundMe = await ethers.getContract("FundMe", deployer);

    console.log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Funding Please wait..");
    const txResponse = await FundMe.fund({ value: ethers.utils.parseEther("0.05") });
    await txResponse.wait(1);
    console.log("\x1b[32m%s\x1b[0m", "Amount Funded Successfully!");
    console.log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    console.log("");
};

fund()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(`\x1b[31mfund.js -- ERROR: ${err}\x1b[0m`);
        process.exit(1);
    });
