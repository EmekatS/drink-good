// Was deployed in RemixIDE
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BeverageLoyaltyToken is ERC20, Ownable {
    
    event PointsAwarded(address indexed user, uint256 amount, string orderId);
    event PointsRedeemed(address indexed user, uint256 amount, string orderId);

    mapping(address => uint256) public totalPointsEarned;
    mapping(address => uint256) public totalPointsRedeemed;
    mapping(address => uint256) public orderCount;

    constructor() ERC20("Beverage Loyalty Token", "BLT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function awardPoints(address user, uint256 points, string memory orderId) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(points > 0, "Points must be greater than 0");

        _mint(user, points * 10 ** decimals());
        totalPointsEarned[user] += points;
        orderCount[user] += 1;

        emit PointsAwarded(user, points, orderId);
    }

    function redeemPoints(address user, uint256 points, string memory orderId) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(points > 0, "Points must be greater than 0");
        
        uint256 amount = points * 10 ** decimals();
        require(balanceOf(user) >= amount, "Insufficient points");

        _burn(user, amount);
        totalPointsRedeemed[user] += points;

        emit PointsRedeemed(user, points, orderId);
    }

    function getPointBalance(address user) external view returns (uint256) {
        return balanceOf(user) / 10 ** decimals();
    }

    function getUserStats(address user) external view returns (
        uint256 currentBalance,
        uint256 totalEarned,
        uint256 totalRedeemed,
        uint256 orders
    ) {
        return (
            balanceOf(user) / 10 ** decimals(),
            totalPointsEarned[user],
            totalPointsRedeemed[user],
            orderCount[user]
        );
    }
}