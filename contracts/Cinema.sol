// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Cinema {
    uint256 internal price;
    address internal immutable cinemaTokenAddress;

    mapping(address => bool) public hadBoughtTicket;

    event NewBuyer(address buyer);
    // 0.8.4
    error AmountTooLow();

    constructor(uint256 _price, address _cinemaTokenAddress) {
        price = _price;
        cinemaTokenAddress = _cinemaTokenAddress;
    }

    /**
     * @notice Buys new ticket.
     *         Reverts if msg.sender already bought a ticket.
     *         Reverts if amount is less than price.
     *
     * @param amount - amount of CINEMA token msg.sender is willing to spend
     *
     * No return, reverts on error.
     */
    function buyTicket(uint256 amount) external {
        require(!hadBoughtTicket[msg.sender], "Already bought the ticket");
        if (amount < price) revert AmountTooLow();

        // send tokens from msg.sender to this contract
        // IERC20(cinemaTokenAddress).transferFrom(
        //     msg.sender,
        //     address(this),
        //     price
        // );
        hadBoughtTicket[msg.sender] = true;

        emit NewBuyer(msg.sender);
    }

    /**
     * @notice Gets the price of a single ticket
     *
     * @return price
     */
    function getPrice() external view returns (uint256) {
        return price;
    }
}
