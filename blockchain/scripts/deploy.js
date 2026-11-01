const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("Deploying TrustChainCredentialRegistry Smart Contract...");
  console.log("Network:", hre.network.name);
  console.log("==================================================");

  const [deployer, issuer1] = await hre.ethers.getSigners();
  console.log("Deployer / Admin address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const TrustChainCredentialRegistry = await hre.ethers.getContractFactory("TrustChainCredentialRegistry");
  const registry = await TrustChainCredentialRegistry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("\n>>> TrustChainCredentialRegistry deployed at:", contractAddress);

  // If on local network or hardhat, authorize a demo university issuer
  if (issuer1) {
    console.log("\nAuthorizing demo issuer:", issuer1.address);
    const tx = await registry.authorizeIssuer(
      issuer1.address,
      "Prof. Eleanor Vance",
      "Stanford Academic Credentialing Board"
    );
    await tx.wait();
    console.log("Demo issuer authorized successfully!");
  }

  // Get artifact for ABI
  const artifact = await hre.artifacts.readArtifact("TrustChainCredentialRegistry");

  const contractData = {
    address: contractAddress,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    admin: deployer.address,
    abi: artifact.abi,
  };

  // Paths to export
  const exportPaths = [
    path.join(__dirname, "../contract_data.json"),
    path.join(__dirname, "../../backend/blockchain/contract_data.json"),
    path.join(__dirname, "../../frontend/src/contracts/contract_data.json"),
  ];

  for (const expPath of exportPaths) {
    const dir = path.dirname(expPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(expPath, JSON.stringify(contractData, null, 2));
    console.log("Exported contract configuration to:", expPath);
  }

  console.log("\n==================================================");
  console.log("Deployment and configuration completed successfully!");
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
