const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");

!!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mFundMe -- Staging Testing\x1b[0m", () => {
          let deployer, FundMe;
          const ethPrice = ethers.utils.parseEther("0.05").toString();
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              FundMe = await ethers.getContract("FundMe", deployer);
          });

          it("\x1b[34mShould Fund and Withdraw Correctly!\x1b[0m", async () => {
              console.log("\x1b[33m%s\x1b[0m", "Funding Please wait...");
              const txResponse = await FundMe.fund({ value: ethPrice });
              await txResponse.wait(1);
              console.log("\x1b[32m%s\x1b[0m", "Funded Successfully!");

              const startingFundmeBalance = await ethers.provider.getBalance(FundMe.address);
              const startingDeployerBalance = await ethers.provider.getBalance(deployer);

              console.log("\x1b[33m%s\x1b[0m", "Withdrawing Please wait...");
              const withdrawTxResponse = await FundMe.withdraw();
              const txReceipt = await withdrawTxResponse.wait(1);
              console.log("\x1b[32m%s\x1b[0m", "Successful Withdrawal!");

              const { gasUsed, effectiveGasPrice } = txReceipt;

              const totalGasUsed = gasUsed.mul(effectiveGasPrice);

              const endingFundMeBalance = await ethers.provider.getBalance(FundMe.address);
              const endingDeployerBalance = await ethers.provider.getBalance(deployer);

              assert.equal(endingFundMeBalance.toString(), "0");
              assert.equal(
                  endingDeployerBalance.add(totalGasUsed).toString(),
                  startingDeployerBalance.add(startingFundmeBalance).toString()
              );
          });
      });
