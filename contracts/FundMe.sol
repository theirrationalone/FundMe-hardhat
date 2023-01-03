////////////////
/// LICENSE ///
//////////////
// SPDX-License-Identifier: MIT

/////////////////
/// COMPILER ///
///////////////
pragma solidity ^0.8.8;

////////////////
/// IMPORTS ///
//////////////
import "./PriceConverter.sol";

///////////////
/// ERRORS ///
/////////////
error FundMe__notPaidEnough();
error FundMe__withdrawalFailed();
error FundMe__notOwner();

/**
 * @title FundMe
 * @notice Performs Crowd Funding
 * @dev This Contract can collect funds from various funders and allows owner of the contract to withdraw all funds.
 * @param ethUsdPriceFeedAddress  to initialize constructor to allow eth conversion.
 * @author theirrationalone
 */

/////////////////
/// CONTRACT ///
///////////////
contract FundMe {
    //////////////////////////
    /// TYPE DECLARATIONS ///
    ////////////////////////
    using PriceConverter for uint256;

    ////////////////////////
    /// STATE VARIABLES ///
    //////////////////////
    uint256 private constant MINIMUM_USD = 50 * 1e18;
    address private immutable i_owner;
    AggregatorV3Interface private immutable i_priceFeed;
    address[] private s_funders;
    mapping(address => uint256) private s_fundersToAmountFunded;

    ///////////////
    /// EVENTS ///
    /////////////
    event AmountFunded(uint256 indexed amountPaid);

    //////////////////
    /// MODIFIERS ///
    ////////////////
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__notOwner();
        }
        _;
    }

    //////////////////////////
    /// SPECIAL FUNCTIONS ///
    ////////////////////////
    constructor(address ethUsdPriceFeedAddress) {
        i_owner = msg.sender;
        i_priceFeed = AggregatorV3Interface(ethUsdPriceFeedAddress);
    }

    /////////////////////////////
    /// MUTATIONAL FUNCTIONS ///
    ///////////////////////////
    function fund() public payable {
        if (msg.value.getConversionRate(i_priceFeed) < MINIMUM_USD) {
            revert FundMe__notPaidEnough();
        }

        s_funders.push(msg.sender);
        s_fundersToAmountFunded[msg.sender] = msg.value;

        emit AmountFunded(msg.value);
    }

    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;

        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            s_fundersToAmountFunded[funders[funderIndex]] = 0;
        }

        s_funders = new address[](0);

        (bool isSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");

        if (!isSuccess) {
            revert FundMe__withdrawalFailed();
        }
    }

    /////////////////////////
    /// HELPER FUNCTIONS ///
    ///////////////////////
    function getMinimumUsd() public pure returns (uint256) {
        return MINIMUM_USD;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeedAddress() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getFundersLength() public view returns (uint256) {
        return s_funders.length;
    }

    function getFunder(uint256 _funderIndx) public view returns (address) {
        return s_funders[_funderIndx];
    }

    function getFunderAmount(address _funder) public view returns (uint256) {
        return s_fundersToAmountFunded[_funder];
    }
}
