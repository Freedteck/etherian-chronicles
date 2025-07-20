const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("EtherianChronicles", function () {
  // Test fixture to deploy the contract
  async function deployEtherianChronicleFixture() {
    const [
      owner,
      writer,
      collaborator1,
      collaborator2,
      voter1,
      voter2,
      voter3,
    ] = await ethers.getSigners();

    // Set block base fee to zero because we want exact calculation checks without network fees
    await hre.network.provider.send("hardhat_setNextBlockBaseFeePerGas", [
      "0x0",
    ]);

    // Deploy the contract
    const EtherianChronicle = await ethers.getContractFactory(
      "EtherianChronicle"
    );
    const etherianChronicle = await EtherianChronicle.deploy();
    await etherianChronicle.waitForDeployment();

    return {
      etherianChronicle,
      owner,
      writer,
      collaborator1,
      collaborator2,
      voter1,
      voter2,
      voter3,
    };
  }

  async function createStoryProposalFixture() {
    const fixture = await loadFixture(deployEtherianChronicleFixture);

    await fixture.etherianChronicle
      .connect(fixture.writer)
      .createStoryProposal(
        "Test Story",
        "A test summary",
        "QmHashImage123",
        "QmHashChapter123",
        ["Choice 1", "Choice 2"],
        [fixture.collaborator1.address],
        86400n
      );

    return fixture;
  }

  async function createStoryWithVotesFixture() {
    const fixture = await loadFixture(deployEtherianChronicleFixture);

    await fixture.etherianChronicle
      .connect(fixture.writer)
      .createStoryProposal(
        "Test Story",
        "A test summary",
        "QmHashImage123",
        "QmHashChapter123",
        ["Choice 1", "Choice 2"],
        [fixture.collaborator1.address],
        86400n
      );

    // Add votes
    await fixture.etherianChronicle
      .connect(fixture.voter1)
      .voteOnProposal(0n, 1n); // YES
    await fixture.etherianChronicle
      .connect(fixture.voter2)
      .voteOnProposal(0n, 1n); // YES
    await fixture.etherianChronicle
      .connect(fixture.voter3)
      .voteOnProposal(0n, 2n); // NO

    return fixture;
  }

  async function createApprovedStoryFixture() {
    const fixture = await loadFixture(deployEtherianChronicleFixture);

    await fixture.etherianChronicle
      .connect(fixture.writer)
      .createStoryProposal(
        "Test Story",
        "A test summary",
        "QmHashImage123",
        "QmHashChapter123",
        ["Choice 1", "Choice 2"],
        [fixture.collaborator1.address],
        86400n
      );

    // Vote and approve
    await fixture.etherianChronicle
      .connect(fixture.voter1)
      .voteOnProposal(0n, 1n);
    await fixture.etherianChronicle
      .connect(fixture.voter2)
      .voteOnProposal(0n, 1n);

    await time.increase(86401);
    await fixture.etherianChronicle.connect(fixture.voter1).resolveProposal(0n);

    return fixture;
  }

  async function createStoryWithChapterFixture() {
    const fixture = await loadFixture(createApprovedStoryFixture);

    await fixture.etherianChronicle
      .connect(fixture.writer)
      .addChapter(
        0n,
        0n,
        0n,
        "QmHashNewChapter123",
        ["Choice A", "Choice B", "Choice C"],
        3600n
      );

    return fixture;
  }

  async function createChapterWithVotesFixture() {
    const fixture = await loadFixture(createStoryWithChapterFixture);

    // Add votes
    await fixture.etherianChronicle
      .connect(fixture.voter1)
      .voteOnChapter(0n, 1n, 0n); // Choice A
    await fixture.etherianChronicle
      .connect(fixture.voter2)
      .voteOnChapter(0n, 1n, 0n); // Choice A
    await fixture.etherianChronicle
      .connect(fixture.voter3)
      .voteOnChapter(0n, 1n, 1n); // Choice B

    return fixture;
  }

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { etherianChronicle } = await loadFixture(
        deployEtherianChronicleFixture
      );

      expect(await etherianChronicle.name()).to.equal("EtherianLoreFragment");
      expect(await etherianChronicle.symbol()).to.equal("ELF");
    });

    it("Should set the correct owner", async function () {
      const { etherianChronicle, owner } = await loadFixture(
        deployEtherianChronicleFixture
      );

      expect(await etherianChronicle.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero stories", async function () {
      const { etherianChronicle } = await loadFixture(
        deployEtherianChronicleFixture
      );

      expect(await etherianChronicle.getTotalStories()).to.equal(0n);
    });
  });

  describe("Story Proposal Creation", function () {
    it("Should create a story proposal successfully", async function () {
      const { etherianChronicle, writer, collaborator1 } = await loadFixture(
        deployEtherianChronicleFixture
      );

      const storyData = {
        title: "The Magic Forest",
        summary: "A mystical adventure in an enchanted forest",
        ipfsHashImage: "QmHashImage123",
        ipfsHashChapter1: "QmHashChapter123",
        choices: ["Go left into the dark path", "Go right towards the light"],
        collaborators: [collaborator1.address],
        voteDuration: 86400n, // 24 hours
      };

      const tx = await etherianChronicle
        .connect(writer)
        .createStoryProposal(
          storyData.title,
          storyData.summary,
          storyData.ipfsHashImage,
          storyData.ipfsHashChapter1,
          storyData.choices,
          storyData.collaborators,
          storyData.voteDuration
        );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      // Check that total stories increased
      expect(await etherianChronicle.getTotalStories()).to.equal(1n);

      // Check story details
      const story = await etherianChronicle.stories(0n);
      expect(story[1]).to.equal(writer.address); // writer
      expect(story[2]).to.equal(storyData.title); // title
      expect(story[3]).to.equal(storyData.summary); // summary
    });

    it("Should fail with empty title", async function () {
      const { etherianChronicle, writer } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await expect(
        etherianChronicle.connect(writer).createStoryProposal(
          "", // empty title
          "A summary",
          "QmHashImage123",
          "QmHashChapter123",
          ["Choice 1", "Choice 2"],
          [],
          86400n
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should fail with insufficient choices", async function () {
      const { etherianChronicle, writer } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await expect(
        etherianChronicle.connect(writer).createStoryProposal(
          "Title",
          "A summary",
          "QmHashImage123",
          "QmHashChapter123",
          ["Only one choice"], // insufficient choices
          [],
          86400n
        )
      ).to.be.revertedWith("Chapter must have at least 2 choices");
    });

    it("Should add collaborators correctly", async function () {
      const { etherianChronicle, writer, collaborator1, collaborator2 } =
        await loadFixture(deployEtherianChronicleFixture);

      await etherianChronicle
        .connect(writer)
        .createStoryProposal(
          "Test Story",
          "A test summary",
          "QmHashImage123",
          "QmHashChapter123",
          ["Choice 1", "Choice 2"],
          [collaborator1.address, collaborator2.address],
          86400n
        );

      // Check collaborators
      expect(
        await etherianChronicle.checkIsCollaborator(0n, collaborator1.address)
      ).to.be.true;
      expect(
        await etherianChronicle.checkIsCollaborator(0n, collaborator2.address)
      ).to.be.true;
      expect(await etherianChronicle.checkIsCollaborator(0n, writer.address)).to
        .be.true; // writer is auto-added
    });
  });

  describe("Proposal Voting", function () {
    it("Should allow voting on proposals", async function () {
      const { etherianChronicle, voter1, voter2 } = await loadFixture(
        createStoryProposalFixture
      );

      // Vote YES
      await etherianChronicle.connect(voter1).voteOnProposal(0n, 1n); // 1 = YES_TO_WRITE
      // Vote NO
      await etherianChronicle.connect(voter2).voteOnProposal(0n, 2n); // 2 = NO_TO_WRITE

      const [yesVotes, noVotes] = await etherianChronicle.getProposalVoteCounts(
        0n
      );
      expect(yesVotes).to.equal(1n);
      expect(noVotes).to.equal(1n);
    });

    it("Should prevent double voting", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createStoryProposalFixture
      );

      await etherianChronicle.connect(voter1).voteOnProposal(0n, 1n);

      await expect(
        etherianChronicle.connect(voter1).voteOnProposal(0n, 1n)
      ).to.be.revertedWithCustomError(
        etherianChronicle,
        "ProposalAlreadyVoted"
      );
    });

    it("Should check voting status correctly", async function () {
      const { etherianChronicle, voter1, voter2 } = await loadFixture(
        createStoryProposalFixture
      );

      expect(await etherianChronicle.hasVotedOnProposal(0n, voter1.address)).to
        .be.false;

      await etherianChronicle.connect(voter1).voteOnProposal(0n, 1n);

      expect(await etherianChronicle.hasVotedOnProposal(0n, voter1.address)).to
        .be.true;
      expect(await etherianChronicle.hasVotedOnProposal(0n, voter2.address)).to
        .be.false;
    });
  });

  describe("Proposal Resolution", function () {
    it("Should not resolve before voting period ends", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createStoryWithVotesFixture
      );

      await expect(
        etherianChronicle.connect(voter1).resolveProposal(0n)
      ).to.be.revertedWithCustomError(
        etherianChronicle,
        "ProposalVotePeriodNotOver"
      );
    });

    it("Should resolve proposal as approved when YES votes win", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createStoryWithVotesFixture
      );

      // Fast forward time past voting period
      await time.increase(86401); // 24 hours + 1 second

      const tx = await etherianChronicle.connect(voter1).resolveProposal(0n);
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      // Check that story status changed to ACTIVE (1)
      const story = await etherianChronicle.stories(0n);
      expect(story[5]).to.equal(1); // status should be ACTIVE
    });

    it("Should resolve proposal as rejected when NO votes win", async function () {
      const { etherianChronicle, voter1, voter2, voter3 } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await etherianChronicle
        .connect(voter1)
        .createStoryProposal(
          "Test Story",
          "A test summary",
          "QmHashImage123",
          "QmHashChapter123",
          ["Choice 1", "Choice 2"],
          [],
          86400n
        );

      // More NO votes than YES
      await etherianChronicle.connect(voter1).voteOnProposal(0n, 1n); // YES
      await etherianChronicle.connect(voter2).voteOnProposal(0n, 2n); // NO
      await etherianChronicle.connect(voter3).voteOnProposal(0n, 2n); // NO

      await time.increase(86401);

      await etherianChronicle.connect(voter1).resolveProposal(0n);

      const story = await etherianChronicle.stories(0n);
      expect(story[5]).to.equal(2); // status should be REJECTED
    });
  });

  describe("Chapter Management", function () {
    it("Should add new chapter successfully", async function () {
      const { etherianChronicle, writer } = await loadFixture(
        createApprovedStoryFixture
      );

      const tx = await etherianChronicle.connect(writer).addChapter(
        0n, // storyId
        0n, // previousChapterIndex
        0n, // previousChapterWinningChoiceIndex
        "QmHashNewChapter123",
        ["New Choice 1", "New Choice 2", "New Choice 3"],
        3600n // 1 hour vote duration
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      // Check current chapter index updated
      expect(await etherianChronicle.getCurrentChapterIndex(0n)).to.equal(1n);
    });

    it("Should prevent non-collaborators from adding chapters", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createApprovedStoryFixture
      );

      await expect(
        etherianChronicle
          .connect(voter1)
          .addChapter(
            0n,
            0n,
            0n,
            "QmHashNewChapter123",
            ["New Choice 1", "New Choice 2"],
            3600n
          )
      ).to.be.reverted;
    });

    it("Should allow collaborators to add chapters", async function () {
      const { etherianChronicle, collaborator1 } = await loadFixture(
        createApprovedStoryFixture
      );

      const tx = await etherianChronicle
        .connect(collaborator1)
        .addChapter(
          0n,
          0n,
          0n,
          "QmHashNewChapter123",
          ["New Choice 1", "New Choice 2"],
          3600n
        );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
  });

  describe("Chapter Voting", function () {
    it("Should allow voting on chapters", async function () {
      const { etherianChronicle, voter1, voter2, voter3 } = await loadFixture(
        createStoryWithChapterFixture
      );

      // Vote on different choices
      await etherianChronicle.connect(voter1).voteOnChapter(0n, 1n, 0n); // Choice A
      await etherianChronicle.connect(voter2).voteOnChapter(0n, 1n, 1n); // Choice B
      await etherianChronicle.connect(voter3).voteOnChapter(0n, 1n, 0n); // Choice A

      expect(await etherianChronicle.hasVotedOnChapter(0n, 1n, voter1.address))
        .to.be.true;
      expect(await etherianChronicle.hasVotedOnChapter(0n, 1n, voter2.address))
        .to.be.true;
      expect(await etherianChronicle.hasVotedOnChapter(0n, 1n, voter3.address))
        .to.be.true;
    });

    it("Should prevent double voting on chapters", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createStoryWithChapterFixture
      );

      await etherianChronicle.connect(voter1).voteOnChapter(0n, 1n, 0n);

      await expect(
        etherianChronicle.connect(voter1).voteOnChapter(0n, 1n, 1n)
      ).to.be.revertedWithCustomError(etherianChronicle, "AlreadyVoted");
    });

    it("Should prevent voting on invalid choice index", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createStoryWithChapterFixture
      );

      await expect(
        etherianChronicle.connect(voter1).voteOnChapter(0n, 1n, 5n) // Invalid choice index
      ).to.be.revertedWithCustomError(etherianChronicle, "InvalidChoice");
    });
  });

  describe("Chapter Resolution", function () {
    it("Should not resolve before voting period ends", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createChapterWithVotesFixture
      );

      await expect(
        etherianChronicle.connect(voter1).resolveChapter(0n, 1n)
      ).to.be.revertedWithCustomError(
        etherianChronicle,
        "VotingPeriodNotStarted"
      );
    });

    it("Should resolve chapter correctly", async function () {
      const { etherianChronicle, voter1 } = await loadFixture(
        createChapterWithVotesFixture
      );

      await time.increase(3601); // 1 hour + 1 second

      const tx = await etherianChronicle.connect(voter1).resolveChapter(0n, 1n);
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      // Check chapter details
      const chapter = await etherianChronicle.getChapter(0n, 1n);
      expect(chapter[5]).to.be.true; // isResolved
      expect(chapter[4]).to.equal(0n); // winningChoiceIndex should be 0 (Choice A won)
    });
  });

  describe("Collaborator Management", function () {
    async function createStoryFixture() {
      const fixture = await loadFixture(deployEtherianChronicleFixture);

      await fixture.etherianChronicle
        .connect(fixture.writer)
        .createStoryProposal(
          "Test Story",
          "A test summary",
          "QmHashImage123",
          "QmHashChapter123",
          ["Choice 1", "Choice 2"],
          [],
          86400n
        );

      return fixture;
    }

    it("Should add collaborator successfully", async function () {
      const { etherianChronicle, writer, collaborator2 } = await loadFixture(
        createStoryFixture
      );

      const tx = await etherianChronicle
        .connect(writer)
        .addCollaborator(0n, collaborator2.address);

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      expect(
        await etherianChronicle.checkIsCollaborator(0n, collaborator2.address)
      ).to.be.true;
    });

    it("Should prevent non-owners from adding collaborators", async function () {
      const { etherianChronicle, voter1, collaborator2 } = await loadFixture(
        createStoryFixture
      );

      await expect(
        etherianChronicle
          .connect(voter1)
          .addCollaborator(0n, collaborator2.address)
      ).to.be.reverted;
    });

    it("Should get collaborators list correctly", async function () {
      const { etherianChronicle, writer, collaborator1, collaborator2 } =
        await loadFixture(createStoryFixture);

      await etherianChronicle
        .connect(writer)
        .addCollaborator(0n, collaborator1.address);
      await etherianChronicle
        .connect(writer)
        .addCollaborator(0n, collaborator2.address);

      const collaborators = await etherianChronicle.getStoryCollaborators(0n);
      expect(collaborators).to.have.lengthOf(3); // writer + 2 added collaborators
      expect(collaborators).to.include(writer.address);
      expect(collaborators).to.include(collaborator1.address);
      expect(collaborators).to.include(collaborator2.address);
    });
  });

  describe("NFT Minting", function () {
    it("Should mint lore fragment NFT successfully", async function () {
      const { etherianChronicle, owner, voter1 } = await loadFixture(
        deployEtherianChronicleFixture
      );

      const tx = await etherianChronicle
        .connect(owner)
        .mintLoreFragment(voter1.address, 0n, 1n, "QmHashNFTMetadata123");

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      expect(await etherianChronicle.balanceOf(voter1.address)).to.equal(1n);
      expect(await etherianChronicle.ownerOf(0n)).to.equal(voter1.address);
    });

    it("Should prevent non-owners from minting NFTs", async function () {
      const { etherianChronicle, voter1, voter2 } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await expect(
        etherianChronicle
          .connect(voter2)
          .mintLoreFragment(voter1.address, 0n, 1n, "QmHashNFTMetadata123")
      ).to.be.revertedWithCustomError(
        etherianChronicle,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("View Functions", function () {
    it("Should return correct total stories count", async function () {
      const { etherianChronicle, writer } = await loadFixture(
        deployEtherianChronicleFixture
      );

      expect(await etherianChronicle.getTotalStories()).to.equal(0n);

      await etherianChronicle
        .connect(writer)
        .createStoryProposal(
          "Story 1",
          "Summary 1",
          "QmHash1",
          "QmChapter1",
          ["Choice 1", "Choice 2"],
          [],
          86400n
        );

      expect(await etherianChronicle.getTotalStories()).to.equal(1n);

      await etherianChronicle
        .connect(writer)
        .createStoryProposal(
          "Story 2",
          "Summary 2",
          "QmHash2",
          "QmChapter2",
          ["Choice A", "Choice B"],
          [],
          86400n
        );

      expect(await etherianChronicle.getTotalStories()).to.equal(2n);
    });
  });

  describe("Edge Cases and Error Handling", function () {
    it("Should handle non-existent story queries", async function () {
      const { etherianChronicle } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await expect(
        etherianChronicle.getCurrentChapterIndex(999n)
      ).to.be.revertedWithCustomError(etherianChronicle, "StoryNotFound");
    });

    it("Should handle non-existent chapter queries", async function () {
      const { etherianChronicle, writer } = await loadFixture(
        deployEtherianChronicleFixture
      );

      await etherianChronicle
        .connect(writer)
        .createStoryProposal(
          "Test Story",
          "Summary",
          "QmHash",
          "QmChapter",
          ["Choice 1", "Choice 2"],
          [],
          86400n
        );

      await expect(etherianChronicle.getChapter(0n, 999n)).to.be.reverted;
    });
  });
});
