////////////////
/// LICENSE ///
//////////////
// SPDX-License-Identifier: MIT

/////////////////
/// COMPILER ///
///////////////
pragma solidity ^0.6.0;

////////////////
/// IMPORTS ///
//////////////
import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";

/**
 * @title MockV3Aggregator
 * @notice Mock for PriceFeeds
 * @dev This Contract Allows to work in local development by mimicing AggregatorV3 PriceFeed.
 * @param decimals to initialize constructor
 * @param initialAnswer to initialize constructor
 * @author theirrationalone
 */
