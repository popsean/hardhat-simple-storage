// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers, run, network } = require("hardhat")

async function main() {
  console.log(
    "Deploying contracts with the account:",
    (await ethers.getSigners())[0].address
  )

  const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
  const simpleStorage = await SimpleStorage.deploy()
  await simpleStorage.deployed()
  console.log("SimpleStorage deployed to:", simpleStorage.address)

  if (process.env.ETHERSCAN_API_KEY && network.config.chainId === 11155111) {
    console.log("Waiting for block confirmations...")
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  const favoriteNumber = await simpleStorage.retrieve()
  console.log("Favorite number:", favoriteNumber.toNumber())

  const transaction = await simpleStorage.store(1337)
  await transaction.wait(1)

  const favoriteNumber2 = await simpleStorage.retrieve()
  console.log(`Favorite number after store: ${favoriteNumber2.toNumber()}`)
}

//verify
async function verify(contractAddress, args) {
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract source code already verified")
    } else {
      console.error(e)
    }
  }
}

//call main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
