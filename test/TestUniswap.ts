import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployments, ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { DAI, DAI_WHALE, WBTC, impersonateAccount } from "../utils";

describe("TestUniswap", function () {
  let testUniswapV2: Contract;
  let tokenIn: Contract;
  let tokenOut: Contract;
  let daiWhaleSigner: Signer;

  const TOKEN_IN = DAI;
  const TOKEN_OUT = WBTC;
  const AMOUNT_IN = ethers.utils.parseEther("20000");
  const AMOUNT_OUT_MIN = 1;

  before(async () => {
    await deployments.fixture(["uniswap"]);
    testUniswapV2 = await ethers.getContract("TestUniswapV2");
    tokenIn = await ethers.getContractAt("IERC20", TOKEN_IN);
    tokenOut = await ethers.getContractAt("IERC20", TOKEN_OUT);
    await impersonateAccount(DAI_WHALE);
    daiWhaleSigner = await ethers.getSigner(DAI_WHALE);

    await tokenIn
      .connect(daiWhaleSigner)
      .approve(testUniswapV2.address, AMOUNT_IN);
  });

  async function accountsFixture() {
    const [signer] = await ethers.getSigners();
    return { signer };
  }

  describe("TestUniswapV2", function () {
    it("Should swap", async function () {
      console.log(
        `Converting ${ethers.utils.formatEther(AMOUNT_IN)} DAI to WBTC`
      );
      const { signer } = await loadFixture(accountsFixture);
      const TO = await signer.getAddress();
      const beforeBalance = await tokenOut.balanceOf(TO);

      await testUniswapV2
        .connect(daiWhaleSigner)
        .swap(
          tokenIn.address,
          tokenOut.address,
          AMOUNT_IN,
          AMOUNT_OUT_MIN,
          TO,
          {
            from: DAI_WHALE,
          }
        );
      const afterBalance = await tokenOut.balanceOf(TO);
      console.log(
        `Before WBTC balance: ${ethers.utils.formatUnits(beforeBalance, 8)}`
      );
      console.log(
        `After WBTC balance: ${ethers.utils.formatUnits(afterBalance, 8)}`
      );
    });
  });
});
