import { deployments, ethers } from "hardhat";
import { Contract } from "ethers";
import {
  DAI,
  DAI_WHALE,
  WETH_WHALE,
  impersonateAccount,
  WETH,
  sendEther,
} from "../utils";

describe("TestUniswapLiquidity", function () {
  let contract: Contract;
  let tokenA: Contract;
  let tokenB: Contract;

  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = DAI;
  const TOKEN_B_WHALE = DAI_WHALE;
  const TOKEN_A_AMOUNT = ethers.utils.parseEther("1");
  const TOKEN_B_AMOUNT = ethers.utils.parseEther("1");

  before(async () => {
    const [account] = await ethers.getSigners();
    const CALLER = await account.getAddress();
    await deployments.fixture(["liquidity"]);
    contract = await ethers.getContract("TestUniswapLiquidityV2");
    tokenA = await ethers.getContractAt("IERC20", TOKEN_A);
    tokenB = await ethers.getContractAt("IERC20", TOKEN_B);

    // send ETH for tx fee
    await sendEther(account, TOKEN_A_WHALE, 1);
    await sendEther(account, TOKEN_B_WHALE, 1);

    const tokenAWhaleSigner = await impersonateAccount(TOKEN_A_WHALE);
    const tokenBWhaleSigner = await impersonateAccount(TOKEN_B_WHALE);

    await tokenA.connect(tokenAWhaleSigner).transfer(CALLER, TOKEN_A_AMOUNT);
    await tokenB.connect(tokenBWhaleSigner).transfer(CALLER, TOKEN_B_AMOUNT);

    await tokenA.approve(contract.address, TOKEN_A_AMOUNT);
    await tokenB.approve(contract.address, TOKEN_B_AMOUNT);
  });

  it("V2: add liquidity and remove liquidity", async () => {
    let tx = await contract.addLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT
    );
    let receipt = await tx.wait();
    console.log("=== add liquidity ===");
    for (const log of receipt.events.filter((e) => e.event === "Log")) {
      console.log(`${log.args.message} ${log.args.val}`);
    }

    tx = await contract.removeLiquidity(tokenA.address, tokenB.address);
    receipt = await tx.wait();
    console.log("=== remove liquidity ===");
    for (const log of receipt.events.filter((e) => e.event === "Log")) {
      console.log(`${log.args.message} ${log.args.val}`);
    }
  });
});
