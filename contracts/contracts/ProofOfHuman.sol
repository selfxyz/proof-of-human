// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {AttestationId} from "@selfxyz/contracts/contracts/constants/AttestationId.sol";

/**
 * @title ProofOfHuman
 * @notice A simple contract to verify humanity using Self Protocol
 * @dev Extends SelfVerificationRoot to handle passport verification callbacks
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Mapping to track verified humans
    mapping(address => bool) public verifiedHumans;
    
    // Mapping to track verification timestamps
    mapping(address => uint256) public verificationTimestamp;
    
    // Mapping to store nationality if disclosed
    mapping(address => string) public userNationality;
    
    // Events
    event HumanVerified(address indexed user, uint256 timestamp, string nationality);
    event VerificationAttempted(address indexed user);

    constructor(address _identityVerificationHub) 
        SelfVerificationRoot(_identityVerificationHub, 1) // scope = 1 for default
    {}

    /**
     * @notice Returns the configuration ID for verification
     * @dev Uses a default config for all verifications
     */
    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData
    ) public pure override returns (bytes32) {
        // Using a simple default config for all users
        return keccak256("proof-of-human-default");
    }

    /**
     * @notice Handles successful passport verification
     * @dev Called by the hub after proof verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        // Extract user address from userData
        // userData format: | 32 bytes destChainId | 32 bytes userIdentifier | userDefinedData |
        bytes32 userIdentifierBytes32;
        if (userData.length >= 64) {
            assembly {
                userIdentifierBytes32 := mload(add(userData, 64)) // Skip 32 bytes destChainId, read userIdentifier
            }
        }
        
        address user = address(uint160(uint256(userIdentifierBytes32)));
        
        emit VerificationAttempted(user);
        
        // Mark user as verified human
        verifiedHumans[user] = true;
        verificationTimestamp[user] = block.timestamp;
        
        // Store nationality if disclosed
        if (bytes(output.nationality).length > 0) {
            userNationality[user] = output.nationality;
        }
        
        emit HumanVerified(user, block.timestamp, output.nationality);
    }

    /**
     * @notice Check if an address is a verified human
     * @param user The address to check
     * @return bool Whether the address is verified
     */
    function isVerifiedHuman(address user) external view returns (bool) {
        return verifiedHumans[user];
    }

    /**
     * @notice Get verification details for a user
     * @param user The address to check
     * @return isVerified Whether the user is verified
     * @return timestamp When the user was verified (0 if not verified)
     * @return nationality The user's nationality (empty if not disclosed)
     */
    function getVerificationDetails(address user) external view returns (
        bool isVerified,
        uint256 timestamp,
        string memory nationality
    ) {
        return (
            verifiedHumans[user],
            verificationTimestamp[user],
            userNationality[user]
        );
    }
}