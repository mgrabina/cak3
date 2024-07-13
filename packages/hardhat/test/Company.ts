import { expect } from "chai";
import { ethers } from "hardhat";
import { Company, USDC } from "../typechain-types";

describe("Company", function () {
  // We define a fixture to reuse the same setup in every test.

  let Company: Company;
  let USDC: USDToken;
  let employee1;
  let employee2;
  let employee3;
  let employee4;

  const amount1 =  '41000000000'; // 500k yearly
  const amount2 =   '8000000000'; // 100k yearly
  const amount3 =   '4000000000'; //  50k yearly
  const amount4 =   '2000000000'; //  25k yearly
  const amount5 =    '800000000'; //  10k yearly
  const _100k   = '100000000000';


  before(async () => {
    const [owner, investor, e1, e2, e3, e4] = await ethers.getSigners();
    employee1 =  e1;
    employee2 =  e2;
    employee3 =  e3;
    employee4 =  e4;

    const USDCFactory = await ethers.getContractFactory("USDC");
    USDC = (await USDCFactory.deploy("USDC", "USDC")) as USDCToken;
    await USDC.waitForDeployment();

    const companyFactory = await ethers.getContractFactory("Company");
    Company = (await companyFactory.deploy(USDC.target)) as Company;
    await Company.waitForDeployment();

  });

  describe("Deployment", function () {
    it("Should increase employee Number", async function () {

      expect(await Company.employeeCount()).to.equal("0");

      await Company.addEmployees(
        [employee1.address ,employee2.address],
        [amount1, amount2]
      )

      expect(await Company.employeeCount()).to.equal("2");

      await Company.addEmployees(
        [employee3.address],
        [amount3]
      )

      expect(await Company.employeeCount()).to.equal("3");

      await Company.addEmployees(
        [ employee4.address],
        [ amount4]
      )
      expect(await Company.employeeCount()).to.equal("4");

    });

    it("Should allow setting a new message", async function () {
      await USDC.mint(Company.target, _100k);

      let initialBalance = await USDC.balanceOf(employee1.address);

      await Company.executePeriodPayroll();

      let finalBalance = await USDC.balanceOf(employee1.address);

      expect(finalBalance).to.equal(amount1);
      expect(initialBalance).to.equal("0");

    });
  });
});
