// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Utils {
    /**
     * @dev Convert uint256 to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    /**
     * @dev Simple base64 encoding
     */
    function base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        if (data.length == 0) return "";
        
        string memory result = new string(4 * ((data.length + 2) / 3));
        bytes memory resultBytes = bytes(result);
        
        uint256 i = 0;
        uint256 j = 0;
        
        for (; i + 3 <= data.length; i += 3) {
            (resultBytes[j], resultBytes[j+1], resultBytes[j+2], resultBytes[j+3]) = 
                encode3Bytes(data[i], data[i+1], data[i+2], bytes(table));
            j += 4;
        }
        
        if (i + 1 == data.length) {
            (resultBytes[j], resultBytes[j+1], resultBytes[j+2], resultBytes[j+3]) = 
                encode3Bytes(data[i], 0, 0, bytes(table));
            resultBytes[j+2] = "=";
            resultBytes[j+3] = "=";
        } else if (i + 2 == data.length) {
            (resultBytes[j], resultBytes[j+1], resultBytes[j+2], resultBytes[j+3]) = 
                encode3Bytes(data[i], data[i+1], 0, bytes(table));
            resultBytes[j+3] = "=";
        }
        
        return result;
    }

    function encode3Bytes(bytes1 b0, bytes1 b1, bytes1 b2, bytes memory table) 
        internal pure returns (bytes1, bytes1, bytes1, bytes1) {
        uint256 n = (uint8(b0) << 16) | (uint8(b1) << 8) | uint8(b2);
        return (
            table[(n >> 18) & 63],
            table[(n >> 12) & 63], 
            table[(n >> 6) & 63],
            table[n & 63]
        );
    }

    /**
     * @dev Helper function to get rarity name
     */
    function getRarityName(uint8 rarity) internal pure returns (string memory) {
        if (rarity == 3) return "Legendary";
        if (rarity == 2) return "Epic"; 
        if (rarity == 1) return "Rare";
        return "Common";
    }
}