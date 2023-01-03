const { getNamedAccounts, ethers } = require("hardhat");

const withdraw = async () => {
    const { deployer } = await getNamedAccounts();
    const FundMe = await ethers.getContract("FundMe", deployer);

    console.log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Withdrawing Funds Please wait..");
    const txResponse = await FundMe.withdraw();
    await txResponse.wait(1);
    console.log("\x1b[32m%s\x1b[0m", "Amount Withdrawed Successfully!");
    console.log("\x1b[36m%s\x1b[0m", "-------------------------------------------------------------------");
    console.log("");
};

withdraw()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(`\x1b[31mfund.js -- ERROR: ${err}\x1b[0m`);
        process.exit(1);
    });
