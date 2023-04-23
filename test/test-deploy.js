const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", () => {
  let simpleStorageFactory, simpleStorage
  //wirte a before each hook
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Shoud update when call store", async () => {
    const expectedValue = "666"
    const txResponse = await simpleStorage.store(expectedValue)
    await txResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })

  // Should work correctly with the people struct and array
  it("Should work correctly with the people struct and array", async () => {
    const expectedPersonName = "Alice"
    const expectedPersonFavNumber = "20"
    const txResponse = await simpleStorage.addPerson(
      expectedPersonName,
      expectedPersonFavNumber
    )
    await txResponse.wait(1)

    const { favoriteNumber, name } = await simpleStorage.people(0)

    assert.equal(favoriteNumber.toString(), expectedPersonFavNumber)
    assert.equal(name, expectedPersonName)
  })
})
