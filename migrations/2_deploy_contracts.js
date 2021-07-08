var TokenMock = artifacts.require("./TokenMock.sol");
var LpMock = artifacts.require("./LpMock.sol");
var LpStaking = artifacts.require("./LpStaking.sol");

module.exports = function (deployer) {
  deployer.deploy(TokenMock);
  deployer.deploy(LpMock);
  deployer.deploy(LpStaking);
};
