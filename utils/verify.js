const { run } = require("hardhat");

module.exports = async (contractAddress, constructorArguments) => {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArguments,
        });
        console.log("\x1b[32m%s\x1b[0m", "Contract Verified Successfully!");
    } catch (e) {
        if (!!e.message.toLowerCase().includes("already verified")) {
            console.log("\x1b[32m%s\x1b[0m", "Contract Already Verified, No Need to Verify Again!");
        } else {
            console.log(`\x1b[33mverify.js -- ERROR: ${e}\x1b[0m`);
        }
    }
};
