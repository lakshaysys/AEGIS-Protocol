// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZKVerifier {
    event ProofVerified(
        address indexed agent,
        bytes32 indexed taskId
    );

    function verifyProof(
        bytes calldata proof,
        bytes32 taskId
    ) external returns (bool) {
        require(proof.length > 0, "Invalid proof");

        // Integrate Groth16 / SnarkJS verifier here

        emit ProofVerified(msg.sender, taskId);

        return true;
    }
}
