const TokenMock = artifacts.require("TokenMock");
const LpStaking = artifacts.require("LpStaking");
const LpMock = artifacts.require("LpMock");
const BigNumber = require('bignumber.js');

contract("", async (accounts) => {
  const deployer = accounts[0];
  let instanceToken;
  let instanceLpStaking;
  let instanceLP;

  before(async () => {
    instanceToken = await TokenMock.new({ from: deployer });
    instanceLpStaking = await LpStaking.new({ from: deployer });
    instanceLP = await LpMock.new({ from: deployer });
  });

  describe("V3 Staking", () => {
    it("mint token", async () => {
      await instanceLpStaking.setTokenAddress(instanceToken.address);
      await instanceLpStaking.setPairAddress(instanceLP.address);

      await instanceToken.transfer(instanceLpStaking.address, "10000000000000000000");

      const balance0 = new BigNumber(await instanceToken.balanceOf(deployer));
      const balance1 = new BigNumber(await instanceToken.balanceOf(instanceLpStaking.address));

      assert.equal(balance0.toString(10), "90000000000000000000");
      assert.equal(balance1.toString(10), "10000000000000000000");
    });

    it("mint LP", async () => {
      instanceLP.transfer(accounts[2], "100000000000000000000");
      instanceLP.transfer(accounts[3], "100000000000000000000");

      const balance1 = new BigNumber(await instanceLP.balanceOf(accounts[2]));
      const balance2 = new BigNumber(await instanceLP.balanceOf(accounts[3]));

      assert.equal(balance1.toString(10), "100000000000000000000");
      assert.equal(balance2.toString(10), "100000000000000000000");
    });

    it("staking LP", async () => {
      await instanceLP.approve(instanceLpStaking.address, "100000000000000000000", { from: accounts[2] });
      await instanceLP.approve(instanceLpStaking.address, "100000000000000000000", { from: accounts[3] });

      await instanceLpStaking.start();

      await instanceLpStaking.stake("50000000000000000000", 103, { from: accounts[2] });
      await instanceLpStaking.stake("100000000000000000000", 4, { from: accounts[3] });

      let totalStakedAmount = new BigNumber(await instanceLpStaking._totalStakedAmount());
      let totalStakedLpAmount = new BigNumber(await instanceLpStaking._totalStakedLpAmount());
      assert.equal(totalStakedAmount.toString(10), "24900000000000000000000");
      assert.equal(totalStakedLpAmount.toString(10), "150000000000000000000");

      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      await timeout(20000);
      await instanceLP.transfer(accounts[4], "1");

      const reward1 = await instanceLpStaking.getReward(accounts[2], 0);
      const reward2 = await instanceLpStaking.getReward(accounts[3], 0);
      console.log(reward1.toString(), reward2.toString())
      expect(new BigNumber(reward1).gt(2000000000000)).to.equal(true);
      expect(new BigNumber(reward2).gt(1000000000000)).to.equal(true);
    });

    it("unStake LP", async () => {
      await instanceLpStaking.withdraw(0, "50000000000000000000", { from: accounts[2] });
      await instanceLpStaking.withdraw(0, "50000000000000000000", { from: accounts[3] });

      const balance1 = await instanceLP.balanceOf(accounts[2]);
      const balance2 = await instanceLP.balanceOf(accounts[3]);
      assert.equal(balance1.toString(), "100000000000000000000");
      assert.equal(balance2.toString(), "50000000000000000000");

      const reward1 = new BigNumber(await instanceToken.balanceOf(accounts[2]));
      const reward2 = new BigNumber(await instanceToken.balanceOf(accounts[3]));

      console.log(reward1.toString(), reward2.toString())
      expect(reward1.gt(700000000000)).to.equal(true);
      expect(reward2.gt(17000000000000)).to.equal(true);
    });
  });
});