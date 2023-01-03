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
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceConverter
 * @notice Provides off chain current USD Prices of ETH Conversion Utility.
 * @dev This Contract Provides some utility functions to convert ETH into USD and much more.
 * @author theirrationalone
 */

////////////////
/// LIBRARY ///
//////////////
library PriceConverter {
    ///////////////////////////
    /// INTERNAL FUNCTIONS ///
    /////////////////////////
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 latestPrice, , , ) = priceFeed.latestRoundData();

        return uint256(latestPrice * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 latestEthPrice = getPrice(priceFeed);
        uint256 latestEthUsdConvertedPrice = (ethAmount * latestEthPrice) / 1e18;

        return latestEthUsdConvertedPrice;
    }
}
