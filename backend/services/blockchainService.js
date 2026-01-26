const { ethers } = require("ethers");
require('dotenv').config();

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

    this.contractABI = [
      "function awardPoints(address user, uint256 points, string orderId) external",
      "function redeemPoints(address user, uint256 points, string orderId) external",
      "function getPointBalance(address user) external view returns (uint256)",
      "function getUserStats(address user) external view returns (uint256 currentBalance, uint256 totalEarned, uint256 totalRedeemed, uint256 orders)"
    ];

    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      this.contractABI,
      this.wallet
    );
  }

  async awardPoints(userWalletAddress, points, orderId) {
    try {
      console.log(` Awarding ${points} points to ${userWalletAddress}`);
      const tx = await this.contract.awardPoints(userWalletAddress, points, orderId.toString());
      const receipt = await tx.wait();
      console.log(`Points awarded! TX: ${tx.hash}`);
      return { success: true, transactionHash: tx.hash, blockNumber: receipt.blockNumber };
    } catch (error) {
      console.error(" Error awarding points:", error.message);
      return { success: false, error: error.message };
    }
  }

  async redeemPoints(userWalletAddress, points, orderId) {
    try {
      console.log(`  Redeeming ${points} points from ${userWalletAddress}`);
      const tx = await this.contract.redeemPoints(userWalletAddress, points, orderId.toString());
      const receipt = await tx.wait();
      console.log(` Points redeemed! TX: ${tx.hash}`);
      return { success: true, transactionHash: tx.hash, blockNumber: receipt.blockNumber };
    } catch (error) {
      console.error(" Error redeeming points:", error.message);
      return { success: false, error: error.message };
    }
  }

  async getPointBalance(userWalletAddress) {
    try {
      const balance = await this.contract.getPointBalance(userWalletAddress);
      return Number(balance);
    } catch (error) {
      console.error("Error getting balance:", error.message);
      return 0;
    }
  }

  async testConnection() {
    try {
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(" Blockchain connected!");
      console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
      console.log(`   Wallet: ${this.wallet.address}`);
      console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
      console.log(`   Contract: ${process.env.CONTRACT_ADDRESS}`);
      return true;
    } catch (error) {
      console.error(" Blockchain connection failed:", error.message);
      return false;
    }
  }
}

let blockchainService = null;

function getBlockchainService() {
  if (!blockchainService && process.env.BLOCKCHAIN_ENABLED === "true") {
    blockchainService = new BlockchainService();
    blockchainService.testConnection();
  }
  return blockchainService;
}

module.exports = { getBlockchainService };