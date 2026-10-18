// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        address payable owner;
        string metadataURI;
        uint256 reputationScore;
        bool isActive;
    }

    mapping(address => Agent) public agents;
    
    event AgentRegistered(address indexed agentAddress, string metadataURI);
    event ReputationUpdated(address indexed agentAddress, uint256 newScore);

    function registerAgent(string memory _metadataURI) external {
        require(!agents[msg.sender].isActive, "Agent already registered");
        agents[msg.sender] = Agent({
            owner: payable(msg.sender),
            metadataURI: _metadataURI,
            reputationScore: 100,
            isActive: true
        });
        emit AgentRegistered(msg.sender, _metadataURI);
    }
}
