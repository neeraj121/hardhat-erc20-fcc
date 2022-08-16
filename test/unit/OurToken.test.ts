import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers } from "hardhat";
import { INITIAL_SUPPLY } from "../../helper-hardhat-config";
import { OurToken } from "../../typechain";

describe("OurToken Unit Test", function () {
    let ourToken: OurToken,
        deployer: SignerWithAddress,
        user1: SignerWithAddress;
    const decimals = 10 ** 18;
    const tokensToSend = ethers.utils.parseEther("10");

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        deployer = signers[0];
        user1 = signers[1];

        await deployments.fixture("all");
        ourToken = await ethers.getContract("OurToken", deployer);
    });

    it("was deployed", async () => {
        assert(ourToken.address);
    });

    describe("constructor", function () {
        it("Should have correct initial supply of token", async () => {
            const totalSupply = await ourToken.totalSupply();
            expect(totalSupply.toString()).to.equal(INITIAL_SUPPLY);
        });

        it("initializes the token with the correct name and symbol", async () => {
            const name = await ourToken.name();
            const symbol = await ourToken.symbol();

            assert.equal(name, "OurToken");
            assert.equal(symbol, "OT");
        });
    });

    describe("minting", function () {
        it("user can not mint", async () => {
            try {
                // @ts-ignore
                await ourToken._mint(deployer, 100);
            } catch (error) {
                assert(error);
            }
        });
    });

    describe("transfers", function () {
        it("Should be able to transfer tokens successfully to an address", async () => {
            const transactionResponse = await ourToken.transfer(
                user1.address,
                tokensToSend
            );
            await transactionResponse.wait(1);
            expect(await ourToken.balanceOf(user1.address)).to.equal(
                tokensToSend
            );
        });

        it("emits a Transfer Event, when a transfer occurs", async () => {
            await expect(
                ourToken.transfer(user1.address, tokensToSend)
            ).to.emit(ourToken, "Transfer");
        });

        describe("allowances", function () {
            const amount = (20 * decimals).toString();
            let playerToken: OurToken;

            beforeEach(async () => {
                playerToken = await ethers.getContract("OurToken", user1);
            });

            it("Should approve other address to spend token", async () => {
                const tokensToSpend = ethers.utils.parseEther("5");
                await ourToken.approve(user1.address, tokensToSpend);
                await playerToken.transferFrom(
                    deployer.address,
                    user1.address,
                    tokensToSpend
                );
                expect(await ourToken.balanceOf(user1.address)).to.equal(
                    tokensToSpend
                );
            });

            it("doesn't allow a member to do transfers", async () => {
                await expect(
                    playerToken.transferFrom(
                        deployer.address,
                        user1.address,
                        amount
                    )
                ).to.be.revertedWith("ERC20: insufficient allowance");
            });

            it("emits an approve event, when an approval occurs", async () => {
                await expect(ourToken.approve(user1.address, amount)).to.emit(
                    ourToken,
                    "Approval"
                );
            });

            it("the allowance being set is accurate", async () => {
                await ourToken.approve(user1.address, amount);
                expect(
                    await ourToken.allowance(deployer.address, user1.address)
                ).to.equal(amount);
            });

            it("won't allow the user to go over the allowance", async () => {
                await ourToken.approve(user1.address, amount);
                await expect(
                    playerToken.transferFrom(
                        deployer.address,
                        user1.address,
                        (40 * decimals).toString()
                    )
                ).to.be.revertedWith("ERC20: insufficient allowance");
            });
        });
    });
});
