import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
    developmentChains,
    INITIAL_SUPPLY,
    networkConfig,
} from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, network, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [INITIAL_SUPPLY];
    const ourToken = await deploy("OurToken", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });
    log(`OurToken deployed at ${ourToken.address}`);

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying Contract...");
        await verify(ourToken.address, args);
    }
};

export default deployToken;
deployToken.tags = ["all", "token"];
