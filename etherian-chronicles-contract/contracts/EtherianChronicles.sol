// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Custom errors for clarity and gas efficiency
error StoryNotFound();
error ChapterNotFound();
error ProposalNotFound();
error Unauthorized();
error InvalidStoryStatus();
error InvalidChapterStatus();
error VotingPeriodNotOver();
error VotingPeriodNotStarted();
error AlreadyVoted();
error InvalidChoice();
error NotStoryCollaborator();
error NotStoryOwner();
error StoryAlreadyApproved();
error StoryAlreadyRejected();
error ProposalVotePeriodNotOver();
error ProposalVotePeriodNotStarted();
error ProposalAlreadyVoted();
error CannotAddChapterToNonActiveStory();
error PreviousChapterNotResolved();
error InvalidPreviousChapterIndex();
error StoryNotYetCreated();
error ChapterCannotBeAddedToLiveVote();

contract EtherianChronicle is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    // --- State Variables ---

    uint256 private _storyIdCounter;
    uint256 private _loreFragmentTokenIdCounter;

    // Enum for story status
    enum StoryStatus {
        PROPOSAL_PENDING_VOTE, // Story is proposed, waiting for community vote
        ACTIVE,                // Story approved, active for chapter voting
        REJECTED,              // Story proposal rejected by community
        COMPLETED,             // Story concluded
        PAUSED                 // Optional: for moderation or emergencies
    }

    // Enum for proposal vote type
    enum ProposalVoteType {
        NO_VOTE, // Default, unvoted
        YES_TO_WRITE,
        NO_TO_WRITE
    }

    // Structs
    struct Choice {
        string text;             // Description of the choice
        uint256 voteCount;       // Number of votes for this choice
        uint256 nextChapterIndex; // Index of the chapter that follows this choice if winning
    }

    struct Chapter {
        uint256 chapterId;         // Unique ID within the story
        uint256 storyId;           // ID of the parent story
        string ipfsHash;           // IPFS hash of the chapter's content (text)
        Choice[] choices;          // Array of choices for this chapter
        uint256 voteEndTime;       // Timestamp when voting ends for this chapter
        uint256 winningChoiceIndex; // Index of the winning choice (-1 if not resolved)
        bool isResolved;           // True if the chapter's vote is resolved
        mapping(address => bool) hasVoted; // Tracks if an address has voted in this chapter
        uint256 voteCountSum;      // Sum of all votes for this chapter
    }

    struct Story {
        uint256 storyId;                     // Unique ID for the story
        address payable writer;              // The original creator/writer of the story
        string title;                        // Title of the story
        string summary;                      // Brief summary for proposals
        string ipfsHashImage;                // IPFS hash for the story's cover image
        address[] collaborators;             // List of addresses authorized to add chapters/manage
        StoryStatus status;                  // Current status of the story
        uint256 proposalVoteEndTime;         // Timestamp when proposal voting ends
        mapping(address => ProposalVoteType) proposalVotes; // Tracks proposal votes
        uint256 proposalYesVotes;            // Count of YES votes for the proposal (fixed from uint255)
        uint256 proposalNoVotes;             // Count of NO votes for the proposal (fixed from uint255)
        uint256 currentChapterIndex;         // Index of the current active chapter being voted on
        Chapter[] chapters;                  // Array of all chapters in the story
        mapping(address => bool) isCollaborator; // Quick lookup for collaborators
    }

    // Mappings
    mapping(uint256 => Story) public stories; // storyId => Story struct
    mapping(uint256 => uint256) public storyIdToCurrentChapterIndex; // Convenience mapping

    // --- Events ---
    event StoryProposed(
        uint256 indexed storyId,
        address indexed writer,
        string title,
        string summary,
        string ipfsHashImage
    );
    event StoryApproved(uint256 indexed storyId);
    event StoryRejected(uint256 indexed storyId);
    event ChapterAdded(
        uint256 indexed storyId,
        uint256 indexed chapterId,
        string ipfsHash,
        uint256 voteEndTime
    );
    event VoteCast(
        uint256 indexed storyId,
        uint256 indexed chapterId,
        address indexed voter,
        uint256 choiceIndex
    );
    event ChapterResolved(
        uint256 indexed storyId,
        uint256 indexed chapterId,
        uint256 winningChoiceIndex,
        string winningChoiceText
    );
    event CollaboratorAdded(uint256 indexed storyId, address indexed collaborator);
    event LoreFragmentMinted(
        address indexed recipient,
        uint256 indexed storyId,
        uint256 indexed chapterId,
        uint256 tokenId
    );
    event ProposalVoteCast(
        uint256 indexed storyId,
        address indexed voter,
        ProposalVoteType voteType
    );

    // --- Constructor ---
    constructor() ERC721("EtherianLoreFragment", "ELF") Ownable(msg.sender) {
        _storyIdCounter = 0;
        _loreFragmentTokenIdCounter = 0;
    }

    // --- Modifiers ---
    modifier onlyStoryOwner(uint256 _storyId) {
        if (stories[_storyId].writer != msg.sender) revert NotStoryOwner();
        _;
    }

    modifier onlyCollaborator(uint256 _storyId) {
        if (!stories[_storyId].isCollaborator[msg.sender] && stories[_storyId].writer != msg.sender)
            revert NotStoryCollaborator();
        _;
    }

    modifier storyExists(uint256 _storyId) {
        if (stories[_storyId].writer == address(0)) revert StoryNotFound();
        _;
    }

    modifier chapterExists(uint256 _storyId, uint256 _chapterIndex) {
        if (_chapterIndex >= stories[_storyId].chapters.length) revert ChapterNotFound();
        _;
    }

    // --- Core Functions ---

    /**
     * @dev Creates a new story proposal. The story will first go through a community vote.
     * The first chapter content is provided upfront for users to review.
     * @param _title The title of the story.
     * @param _summary A brief summary of the story for the proposal.
     * @param _ipfsHashImage IPFS hash for the story's cover image.
     * @param _ipfsHashChapter1Content IPFS hash for the content of the first chapter.
     * @param _chapter1Choices An array of choices for the first chapter.
     * @param _collaborators Initial list of collaborators.
     * @param _proposalVoteDuration Duration in seconds for the proposal voting phase.
     */
    function createStoryProposal(
        string calldata _title,
        string calldata _summary,
        string calldata _ipfsHashImage,
        string calldata _ipfsHashChapter1Content,
        string[] calldata _chapter1Choices,
        address[] calldata _collaborators,
        uint256 _proposalVoteDuration
    ) external nonReentrant {
        // Input validation
        require(_proposalVoteDuration > 0, "Proposal vote duration must be positive");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_summary).length > 0, "Summary cannot be empty");
        require(bytes(_ipfsHashImage).length > 0, "Image hash cannot be empty");
        require(bytes(_ipfsHashChapter1Content).length > 0, "Chapter 1 content hash cannot be empty");
        require(_chapter1Choices.length >= 2, "Chapter must have at least 2 choices");

        uint256 storyId = _storyIdCounter++;
        
        _initializeStory(storyId, _title, _summary, _ipfsHashImage, _proposalVoteDuration);
        _setupCollaborators(storyId, _collaborators);
        _createFirstChapter(storyId, _ipfsHashChapter1Content, _chapter1Choices);

        emit StoryProposed(storyId, msg.sender, _title, _summary, _ipfsHashImage);
    }

    /**
     * @dev Internal function to initialize story data
     */
    function _initializeStory(
        uint256 _storyId,
        string calldata _title,
        string calldata _summary,
        string calldata _ipfsHashImage,
        uint256 _proposalVoteDuration
    ) internal {
        Story storage story = stories[_storyId];
        story.storyId = _storyId;
        story.writer = payable(msg.sender);
        story.title = _title;
        story.summary = _summary;
        story.ipfsHashImage = _ipfsHashImage;
        story.status = StoryStatus.PROPOSAL_PENDING_VOTE;
        story.proposalVoteEndTime = block.timestamp + _proposalVoteDuration;
        story.proposalYesVotes = 0;
        story.proposalNoVotes = 0;
        story.currentChapterIndex = 0;
    }

    /**
     * @dev Internal function to setup collaborators
     */
    function _setupCollaborators(uint256 _storyId, address[] calldata _collaborators) internal {
        Story storage story = stories[_storyId];
        
        // Add provided collaborators
        for (uint256 i = 0; i < _collaborators.length; i++) {
            story.isCollaborator[_collaborators[i]] = true;
            story.collaborators.push(_collaborators[i]);
        }

        // Add creator as a collaborator by default
        story.isCollaborator[msg.sender] = true;
        story.collaborators.push(msg.sender);
    }

    /**
     * @dev Internal function to create the first chapter
     */
    function _createFirstChapter(
        uint256 _storyId,
        string calldata _ipfsHashChapter1Content,
        string[] calldata _chapter1Choices
    ) internal {
        Story storage story = stories[_storyId];
        Chapter storage firstChapter = story.chapters.push();
        
        firstChapter.chapterId = 0;
        firstChapter.storyId = _storyId;
        firstChapter.ipfsHash = _ipfsHashChapter1Content;
        firstChapter.voteEndTime = 0;
        firstChapter.winningChoiceIndex = type(uint256).max;
        firstChapter.isResolved = false;
        firstChapter.voteCountSum = 0;

        for (uint256 i = 0; i < _chapter1Choices.length; i++) {
            firstChapter.choices.push(Choice({
                text: _chapter1Choices[i],
                voteCount: 0,
                nextChapterIndex: type(uint256).max
            }));
        }
    }

    /**
     * @dev Allows a user to vote on a story proposal.
     * @param _storyId The ID of the story proposal.
     * @param _voteType The type of vote (YES_TO_WRITE or NO_TO_WRITE).
     */
    function voteOnProposal(
        uint256 _storyId,
        ProposalVoteType _voteType
    ) external nonReentrant storyExists(_storyId) {
        Story storage story = stories[_storyId];

        if (story.status != StoryStatus.PROPOSAL_PENDING_VOTE) revert InvalidStoryStatus();
        if (block.timestamp >= story.proposalVoteEndTime) revert ProposalVotePeriodNotOver();
        if (story.proposalVotes[msg.sender] != ProposalVoteType.NO_VOTE) revert ProposalAlreadyVoted();
        if (_voteType == ProposalVoteType.NO_VOTE) revert InvalidChoice();

        story.proposalVotes[msg.sender] = _voteType;

        if (_voteType == ProposalVoteType.YES_TO_WRITE) {
            story.proposalYesVotes++;
        } else if (_voteType == ProposalVoteType.NO_TO_WRITE) {
            story.proposalNoVotes++;
        }

        emit ProposalVoteCast(_storyId, msg.sender, _voteType);
    }

    /**
     * @dev Resolves a story proposal based on votes. Can be called by anyone after voteEndTime.
     * @param _storyId The ID of the story proposal.
     */
    function resolveProposal(uint256 _storyId) external nonReentrant storyExists(_storyId) {
        Story storage story = stories[_storyId];

        if (story.status != StoryStatus.PROPOSAL_PENDING_VOTE) revert InvalidStoryStatus();
        if (block.timestamp < story.proposalVoteEndTime) revert ProposalVotePeriodNotOver();

        if (story.proposalYesVotes > story.proposalNoVotes) {
            story.status = StoryStatus.ACTIVE;
            story.chapters[0].isResolved = true;
            story.chapters[0].winningChoiceIndex = 0;
            emit StoryApproved(_storyId);
        } else {
            story.status = StoryStatus.REJECTED;
            emit StoryRejected(_storyId);
        }
    }

    /**
     * @dev Adds a new chapter to an existing story.
     * Can only be called by the story's writer or a collaborator.
     * New chapter must link to a resolved previous chapter's winning choice.
     * @param _storyId The ID of the story.
     * @param _previousChapterIndex The index of the previous chapter this new chapter follows.
     * @param _previousChapterWinningChoiceIndex The index of the winning choice from the previous chapter that leads to this new chapter.
     * @param _ipfsHash IPFS hash of the new chapter's content.
     * @param _choices An array of choices for this new chapter.
     * @param _voteDuration Duration in seconds for the chapter's voting phase.
     */
    function addChapter(
        uint256 _storyId,
        uint256 _previousChapterIndex,
        uint256 _previousChapterWinningChoiceIndex,
        string calldata _ipfsHash,
        string[] calldata _choices,
        uint256 _voteDuration
    ) external nonReentrant onlyCollaborator(_storyId) storyExists(_storyId) {
        Story storage story = stories[_storyId];

        // Validation
        if (story.status != StoryStatus.ACTIVE) revert CannotAddChapterToNonActiveStory();
        if (_previousChapterIndex >= story.chapters.length) revert InvalidPreviousChapterIndex();

        Chapter storage prevChapter = story.chapters[_previousChapterIndex];
        if (!prevChapter.isResolved) revert PreviousChapterNotResolved();
        if (prevChapter.winningChoiceIndex != _previousChapterWinningChoiceIndex) revert InvalidPreviousChapterIndex();

        if (story.chapters.length > 1 && !story.chapters[story.currentChapterIndex].isResolved) {
             revert ChapterCannotBeAddedToLiveVote();
        }

        require(_voteDuration > 0, "Vote duration must be positive");
        require(bytes(_ipfsHash).length > 0, "Chapter content hash cannot be empty");
        require(_choices.length >= 2, "Chapter must have at least 2 choices");

        uint256 newChapterIndex = story.chapters.length;
        
        // Update previous chapter's winning choice
        prevChapter.choices[_previousChapterWinningChoiceIndex].nextChapterIndex = newChapterIndex;

        // Create new chapter
        _createNewChapter(story, newChapterIndex, _storyId, _ipfsHash, _choices, _voteDuration);
        
        story.currentChapterIndex = newChapterIndex;
        emit ChapterAdded(_storyId, newChapterIndex, _ipfsHash, block.timestamp + _voteDuration);
    }

    /**
     * @dev Internal function to create a new chapter
     */
    function _createNewChapter(
        Story storage _story,
        uint256 _chapterIndex,
        uint256 _storyId,
        string calldata _ipfsHash,
        string[] calldata _choices,
        uint256 _voteDuration
    ) internal {
        Chapter storage newChapter = _story.chapters.push();
        newChapter.chapterId = _chapterIndex;
        newChapter.storyId = _storyId;
        newChapter.ipfsHash = _ipfsHash;
        newChapter.voteEndTime = block.timestamp + _voteDuration;
        newChapter.winningChoiceIndex = type(uint256).max;
        newChapter.isResolved = false;
        newChapter.voteCountSum = 0;

        for (uint256 i = 0; i < _choices.length; i++) {
            newChapter.choices.push(Choice({
                text: _choices[i],
                voteCount: 0,
                nextChapterIndex: type(uint256).max
            }));
        }
    }

    /**
     * @dev Allows a user to vote on a chapter's choice.
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter being voted on.
     * @param _choiceIndex The index of the chosen option.
     */
    function voteOnChapter(
        uint256 _storyId,
        uint256 _chapterIndex,
        uint256 _choiceIndex
    ) external nonReentrant storyExists(_storyId) chapterExists(_storyId, _chapterIndex) {
        Story storage story = stories[_storyId];
        Chapter storage chapter = story.chapters[_chapterIndex];

        if (story.status != StoryStatus.ACTIVE) revert InvalidStoryStatus();
        if (_chapterIndex != story.currentChapterIndex) revert InvalidChapterStatus();
        if (chapter.isResolved) revert InvalidChapterStatus();
        if (block.timestamp >= chapter.voteEndTime) revert VotingPeriodNotOver();
        if (chapter.hasVoted[msg.sender]) revert AlreadyVoted();
        if (_choiceIndex >= chapter.choices.length) revert InvalidChoice();

        chapter.choices[_choiceIndex].voteCount++;
        chapter.voteCountSum++;
        chapter.hasVoted[msg.sender] = true;

        emit VoteCast(_storyId, _chapterIndex, msg.sender, _choiceIndex);
    }

    /**
     * @dev Resolves a chapter's vote and determines the winning choice.
     * Can be called by anyone after the voting period ends.
     * Mints Lore Fragment NFTs to voters of the winning choice.
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter to resolve.
     */
    function resolveChapter(uint256 _storyId, uint256 _chapterIndex) external nonReentrant storyExists(_storyId) chapterExists(_storyId, _chapterIndex) {
        Story storage story = stories[_storyId];
        Chapter storage chapter = story.chapters[_chapterIndex];

        if (story.status != StoryStatus.ACTIVE) revert InvalidStoryStatus();
        if (chapter.isResolved) revert InvalidChapterStatus();
        if (block.timestamp < chapter.voteEndTime) revert VotingPeriodNotStarted();

        uint256 winningChoiceIndex = 0;
        uint256 maxVotes = 0;

        for (uint256 i = 0; i < chapter.choices.length; i++) {
            if (chapter.choices[i].voteCount > maxVotes) {
                maxVotes = chapter.choices[i].voteCount;
                winningChoiceIndex = i;
            }
        }

        chapter.winningChoiceIndex = winningChoiceIndex;
        chapter.isResolved = true;

        emit ChapterResolved(
            _storyId,
            _chapterIndex,
            winningChoiceIndex,
            chapter.choices[winningChoiceIndex].text
        );
    }

    // --- Collaborator Management ---

    /**
     * @dev Adds a new collaborator to an existing story.
     * Only the story writer (owner) can call this.
     * @param _storyId The ID of the story.
     * @param _collaboratorAddress The address of the new collaborator.
     */
    function addCollaborator(uint256 _storyId, address _collaboratorAddress) external onlyStoryOwner(_storyId) storyExists(_storyId) {
        Story storage story = stories[_storyId];
        if (!story.isCollaborator[_collaboratorAddress]) {
            story.isCollaborator[_collaboratorAddress] = true;
            story.collaborators.push(_collaboratorAddress);
            emit CollaboratorAdded(_storyId, _collaboratorAddress);
        }
    }

    // --- Lore Fragment NFT Functions ---

    /**
     * @dev Mints a Lore Fragment NFT to a recipient.
     * This function could be called by the `resolveChapter` function's logic,
     * or by an authorized keeper service that tracks winning voters.
     * @param _recipient The address to mint the NFT to.
     * @param _storyId The ID of the story associated with the fragment.
     * @param _chapterId The ID of the chapter associated with the fragment.
     * @param _tokenURI The IPFS hash or URL for the NFT's metadata.
     */
    function mintLoreFragment(
        address _recipient,
        uint256 _storyId,
        uint256 _chapterId,
        string calldata _tokenURI
    ) external onlyOwner nonReentrant {
        uint256 tokenId = _loreFragmentTokenIdCounter++;
        _safeMint(_recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        emit LoreFragmentMinted(_recipient, _storyId, _chapterId, tokenId);
    }

    // --- Required Overrides for Multiple Inheritance ---

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // --- View Functions (for frontend queries) ---

    /**
     * @dev Returns the total number of stories.
     */
    function getTotalStories() external view returns (uint256) {
        return _storyIdCounter;
    }

    /**
     * @dev Gets a specific chapter's details.
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter.
     */
    function getChapter(uint256 _storyId, uint256 _chapterIndex) external view storyExists(_storyId) chapterExists(_storyId, _chapterIndex) returns (
        uint256 chapterId,
        string memory ipfsHash,
        Choice[] memory choices,
        uint256 voteEndTime,
        uint256 winningChoiceIndex,
        bool isResolved,
        uint256 voteCountSum
    ) {
        Chapter storage chapter = stories[_storyId].chapters[_chapterIndex];
        return (
            chapter.chapterId,
            chapter.ipfsHash,
            chapter.choices,
            chapter.voteEndTime,
            chapter.winningChoiceIndex,
            chapter.isResolved,
            chapter.voteCountSum
        );
    }

    /**
     * @dev Gets the current active chapter index for a story.
     * @param _storyId The ID of the story.
     */
    function getCurrentChapterIndex(uint256 _storyId) external view storyExists(_storyId) returns (uint256) {
        return stories[_storyId].currentChapterIndex;
    }

    /**
     * @dev Checks if an address is a collaborator for a story.
     * @param _storyId The ID of the story.
     * @param _addr The address to check.
     */
    function checkIsCollaborator(uint256 _storyId, address _addr) external view storyExists(_storyId) returns (bool) {
        return stories[_storyId].isCollaborator[_addr];
    }

    /**
     * @dev Gets the proposal vote count for a specific story.
     * @param _storyId The ID of the story.
     */
    function getProposalVoteCounts(uint256 _storyId) external view storyExists(_storyId) returns (uint256 yesVotes, uint256 noVotes) {
        Story storage story = stories[_storyId];
        return (story.proposalYesVotes, story.proposalNoVotes);
    }

    /**
     * @dev Checks if a user has voted on a chapter.
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter.
     * @param _voter The address of the voter.
     */
    function hasVotedOnChapter(uint256 _storyId, uint256 _chapterIndex, address _voter) external view storyExists(_storyId) chapterExists(_storyId, _chapterIndex) returns (bool) {
        return stories[_storyId].chapters[_chapterIndex].hasVoted[_voter];
    }

    /**
     * @dev Checks if a user has voted on a proposal.
     * @param _storyId The ID of the story.
     * @param _voter The address of the voter.
     */
    function hasVotedOnProposal(uint256 _storyId, address _voter) external view storyExists(_storyId) returns (bool) {
        return stories[_storyId].proposalVotes[_voter] != ProposalVoteType.NO_VOTE;
    }

    /**
     * @dev Helper function for testing / debugging
     */
    function getStoryCollaborators(uint256 _storyId) external view storyExists(_storyId) returns (address[] memory) {
        return stories[_storyId].collaborators;
    }
}