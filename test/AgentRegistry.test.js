// test/AgentRegistry.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("A.E.G.I.S. AgentRegistry", function () {
    let agentRegistry;
    let owner, agent1, agent2, unauthorized;

    beforeEach(async function () {
        [owner, agent1, agent2, unauthorized] = await ethers.getSigners();
        const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
        agentRegistry = await AgentRegistry.deploy();
        await agentRegistry.waitForDeployment();
    });

    describe("Registration", function () {
        it("Should successfully register a new agent with a default reputation of 100", async function () {
            await agentRegistry.connect(agent1).registerAgent("ipfs://QmAgent1Metadata");
            const agentData = await agentRegistry.getAgent(agent1.address);
            
            expect(agentData.isActive).to.be.true;
            expect(agentData.reputationScore).to.equal(100);
            expect(agentData.metadataURI).to.equal("ipfs://QmAgent1Metadata");
        });

        it("Should prevent duplicate registrations from the same address", async function () {
            await agentRegistry.connect(agent1).registerAgent("ipfs://QmAgent1Metadata");
            await expect(
                agentRegistry.connect(agent1).registerAgent("ipfs://QmDuplicate")
            ).to.be.revertedWith("Agent already registered");
        });

        it("Should reject empty metadata URIs", async function () {
            await expect(
                agentRegistry.connect(agent1).registerAgent("")
            ).to.be.revertedWith("Metadata URI cannot be empty");
        });
    });

    describe("Reputation & Deactivation (Access Control)", function () {
        beforeEach(async function () {
            await agentRegistry.connect(agent1).registerAgent("ipfs://QmAgent1");
        });

        it("Should allow the owner to update an agent's reputation", async function () {
            await agentRegistry.connect(owner).updateReputation(agent1.address, 250);
            const agentData = await agentRegistry.getAgent(agent1.address);
            expect(agentData.reputationScore).to.equal(250);
        });

        it("Should prevent unauthorized users from updating reputation", async function () {
            await expect(
                agentRegistry.connect(unauthorized).updateReputation(agent1.address, 999)
            ).to.be.reverted; // Ownable revert
        });

        it("Should allow the agent owner to deactivate their own agent", async function () {
            await agentRegistry.connect(agent1).deactivateAgent(agent1.address);
            const agentData = await agentRegistry.getAgent(agent1.address);
            expect(agentData.isActive).to.be.false;
        });

        it("Should allow the contract owner to deactivate a compromised agent", async function () {
            await agentRegistry.connect(owner).deactivateAgent(agent1.address);
            const agentData = await agentRegistry.getAgent(agent1.address);
            expect(agentData.isActive).to.be.false;
        });
    });
});
