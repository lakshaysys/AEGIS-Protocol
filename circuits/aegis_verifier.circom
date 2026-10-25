pragma circom 2.1.6;
include "node_modules/circomlib/circuits/poseidon.circom";

template AegisVerifier() {
    signal input agentId;
    signal input taskHash;
    signal input outputHash;
    signal output validProofHash;

    // Enforce a proper cryptographic commitment using Poseidon hash
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== agentId;
    poseidon.inputs[1] <== taskHash;
    poseidon.inputs[2] <== outputHash;
    
    // Constrain the output to the actual hash result
    validProofHash <== poseidon.out;
}

// agentId is public to allow the smart contract to verify which agent executed the task
component main {public [agentId]} = AegisVerifier();
