import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTestUniswap: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const TestUniswapLiquidityV2 = await deploy("TestUniswapLiquidityV2", {
    args: [],
    from: deployer,
  });
  log(`TestUniswapLiquidityV2 deployed at: ${TestUniswapLiquidityV2.address}`);
};
export default deployTestUniswap;
deployTestUniswap.tags = ["liquidity"];
