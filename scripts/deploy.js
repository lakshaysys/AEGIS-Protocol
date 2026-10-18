const hre = require("hardhat");

async function main() {
    console.log("Initializing deployment of Project A.E.G.I.S. Agent Registry...");

    const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
    const agentRegistry = await AgentRegistry.deploy();

    await agentRegistry.waitForDeployment();

    const address = await agentRegistry.getAddress();
    console.log(`A.E.G.I.S. AgentRegistry successfully deployed to: ${address}`);
}

main().catch((error) => {
    console.error("Deployment failed, sir:", error);
    process.exitCode = 1;
});
