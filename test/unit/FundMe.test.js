const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mFundMe -- Unit Testing\x1b[0m", () => {
          let FundMe, MockV3Aggregator, deployer, signers;
          const ethPrice = ethers.utils.parseEther("0.05").toString();

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              const { fixture } = deployments;

              await fixture(["all"]);

              FundMe = await ethers.getContract("FundMe", deployer);
              MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
              signers = await ethers.getSigners();
          });

          describe("\x1b[36mConstructor\x1b[0m", () => {
              it("\x1b[34mShould set Price feeds Correctly!\x1b[0m", async () => {
                  const priceFeedAddress = await FundMe.getPriceFeedAddress();

                  assert.equal(priceFeedAddress, MockV3Aggregator.address);
              });

              it("\x1b[34mShould have MINIMUM USD Greater than 0!\x1b[0m", async () => {
                  const minimumUsd = await FundMe.getMinimumUsd();

                  expect(+minimumUsd.toString()).greaterThan(0);
              });

              it("\x1b[34mShould have Deployer as The Owner of the Contract!\x1b[0m", async () => {
                  const owner = await FundMe.getOwner();

                  assert.equal(owner, deployer);
              });
          });

          describe("\x1b[36mfund\x1b[0m", () => {
              it("\x1b[34mShould be reverted with Custom Error named as \x1b[33'FundMe__notPaidEnough' \x1b[34m !\x1b[0m", async () => {
                  await expect(FundMe.fund()).to.be.revertedWithCustomError(FundMe, "FundMe__notPaidEnough");
              });

              it("\x1b[34mShould Fund Successfully and have funders length greater than 0 !\x1b[0m", async () => {
                  const txResponse = await FundMe.fund({ value: ethPrice });
                  await txResponse.wait(1);

                  const fundersLength = await FundMe.getFundersLength();

                  assert.notEqual(fundersLength.toString(), "0");
              });

              it("\x1b[34mShould have a funder on Successful funding!\x1b[0m", async () => {
                  const txResponse = await FundMe.fund({ value: ethPrice });
                  await txResponse.wait(1);
                  const funder = await FundMe.getFunder("0");
                  const fundersLength = await FundMe.getFundersLength();

                  assert.equal(funder, deployer);
                  expect(+fundersLength.toString()).greaterThan(0);
              });

              it("\x1b[34mShould return the fund Amount funded by the funder!\x1b[0m", async () => {
                  const txResponse = await FundMe.fund({ value: ethPrice });
                  await txResponse.wait(1);

                  const funder = await FundMe.getFunder("0");

                  const fundedAmount = await FundMe.getFunderAmount(funder);

                  assert.equal(fundedAmount.toString(), ethPrice);
              });

              it("\x1b[34mShould emit an Event named 'AmountFunded' on successful funding !\x1b[0m", async () => {
                  await expect(FundMe.fund({ value: ethPrice })).emit(FundMe, "AmountFunded");
              });
          });

          describe("\x1b[36mwithdraw\x1b[0m", () => {
              beforeEach(async () => {
                  const txResponse = await FundMe.fund({ value: ethPrice });
                  await txResponse.wait(1);
              });

              it("\x1b[34mShould withdraw all funds successfully!\x1b[0m", async () => {
                  const txResponse = await FundMe.withdraw();
                  await txResponse.wait(1);
              });

              it("\x1b[34mShould remove and reset all funders from contract successfully !\x1b[0m", async () => {
                  const txResponse = await FundMe.withdraw();
                  await txResponse.wait(1);

                  const fundersLength = await FundMe.getFundersLength();

                  assert.equal(fundersLength.toString(), "0");
                  await expect(FundMe.getFunder("0")).to.be.reverted;
              });

              it("\x1b[34mShould allow multiple fundings, withdraw All Amount and account deployer's & contract's balance correctly !\x1b[0m", async () => {
                  const funderIndex = 1;
                  const additionalFunders = 5;

                  for (let i = funderIndex; i < additionalFunders + funderIndex; i++) {
                      const additionalFunderConnectedFundMe = await FundMe.connect(signers[i]);
                      const txResponse = await additionalFunderConnectedFundMe.fund({ value: ethPrice });
                      await txResponse.wait(1);
                  }

                  const startingFundmeBalance = await ethers.provider.getBalance(FundMe.address);
                  const startingDeployerBalance = await ethers.provider.getBalance(deployer);

                  const txResponse = await FundMe.withdraw();
                  const txReceipt = await txResponse.wait(1);

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

              it("\x1b[34mShould be reverted with msg named 'FundMe__notOwner' if an attacker try to withdraw funds !\x1b[0m", async () => {
                  const attackerConnectedFundMe = await FundMe.connect(signers[1]);

                  await expect(attackerConnectedFundMe.withdraw()).to.be.revertedWithCustomError(
                      FundMe,
                      "FundMe__notOwner"
                  );
              });
          });
      });
