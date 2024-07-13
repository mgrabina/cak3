import { expect } from "chai";
import { ethers } from "hardhat";
import { FundingRound } from "../typechain-types";

describe("FundingRound", function () {
  // We define a fixture to reuse the same setup in every test.

  let FundingRound: FundingRound;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("FundingRound");
    FundingRound = (await yourContractFactory.deploy(owner.address)) as FundingRound;
    await FundingRound.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await FundingRound.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should allow setting a new message", async function () {
      const newGreeting = "Learn Scaffold-ETH 2! :)";

      await FundingRound.setGreeting(newGreeting);
      expect(await FundingRound.greeting()).to.equal(newGreeting);
    });
  });
});
