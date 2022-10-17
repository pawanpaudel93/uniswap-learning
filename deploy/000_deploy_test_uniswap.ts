import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTestUniswap: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const TestUniswapV2 = await deploy("TestUniswapV2", {
    args: [],
    from: deployer,
  });
  log(`TestUniswapV2 deployed at: ${TestUniswapV2.address}`);
};
export default deployTestUniswap;
deployTestUniswap.tags = ["uniswap"];
