import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTestUniswap: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const TestUniswapSwapV2 = await deploy("TestUniswapSwapV2", {
    args: [],
    from: deployer,
  });
  log(`TestUniswapSwapV2 deployed at: ${TestUniswapSwapV2.address}`);
};
export default deployTestUniswap;
deployTestUniswap.tags = ["uniswap"];
