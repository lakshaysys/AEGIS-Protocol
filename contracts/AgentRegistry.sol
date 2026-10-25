// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentRegistry is Ownable, ReentrancyGuard {
    struct Agent {
        address owner;
        string metadataURI;
        uint256 reputationScore;
        bool isActive;
    }

    mapping(address => Agent) public agents;
    uint256 public totalActiveAgents;
    
    event AgentRegistered(address indexed agentAddress, string metadataURI);
    event ReputationUpdated(address indexed agentAddress, uint256 newScore);
    event AgentDeactivated(address indexed agentAddress);

    constructor() Ownable(msg.sender) {}

    function registerAgent(string memory _metadataURI) external {
        require(!agents[msg.sender].isActive, "Agent already registered");
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty");

        agents[msg.sender] = Agent({
            owner: msg.sender,
            metadataURI: _metadataURI,
            reputationScore: 100,
            isActive: true
        });
        totalActiveAgents++;
        emit AgentRegistered(msg.sender, _metadataURI);
    }

    /// @notice Allows the contract owner to update an agent's reputation score
    function updateReputation(address _agentAddress, uint256 _newScore) external onlyOwner {
        require(agents[_agentAddress].isActive, "Agent not registered or inactive");
        agents[_agentAddress].reputationScore = _newScore;
        emit ReputationUpdated(_agentAddress, _newScore);
    }

    /// @notice Allows an agent owner or the contract owner to deactivate an agent
    function deactivateAgent(address _agentAddress) external {
        require(msg.sender == agents[_agentAddress].owner || msg.sender == owner(), "Unauthorized");
        require(agents[_agentAddress].isActive, "Agent already inactive");
        
        agents[_agentAddress].isActive = false;
        totalActiveAgents--;
        emit AgentDeactivated(_agentAddress);
    }

    /// @notice View function to retrieve full agent details
    function getAgent(address _agentAddress) external view returns (Agent memory) {
        return agents[_agentAddress];
    }
}
