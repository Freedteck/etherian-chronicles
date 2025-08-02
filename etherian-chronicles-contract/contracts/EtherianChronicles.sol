// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Utils.sol";

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
error UserAlreadyRegistered();
error CannotReferSelf();
error InvalidInput();

contract EtherianChronicle is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    // --- State Variables ---

    uint256 private _storyIdCounter;
    uint256 private _loreFragmentTokenIdCounter;

    uint256 public constant PROPOSAL_VOTING_PERIOD = 5 minutes;
    uint256 public constant CHAPTER_VOTING_PERIOD = 5 minutes;
    uint256 public constant POINTS_WINNING_VOTE = 50;
    uint256 public constant POINTS_EARLY_VOTE = 25;
    uint256 public constant POINTS_REFERRAL = 20;
    uint256 public constant POINTS_STORY_COMPLETION = 100;
    uint256 public constant EARLY_VOTE_PERIOD = 6 hours;

    // Leaderboard
    LeaderboardEntry[50] public leaderboard; // Top 50 users
    uint256 public leaderboardCount;


    // Enum for story status
    enum StoryStatus {
        PROPOSAL_PENDING_VOTE, // Story is proposed, waiting for community vote
        ACTIVE,                // Story approved, active for chapter voting
        REJECTED,              // Story proposal rejected by community
        COMPLETED,             // Story concluded
        PAUSED                // Optional: for moderation or emergencies
    }

    // Enum for proposal vote type
    enum ProposalVoteType {
        NO_VOTE, // Default, unvoted
        YES_TO_WRITE,
        NO_TO_WRITE
    }

    enum RarityTier {
        COMMON,    // 0-99 points
        RARE,      // 100-499 points  
        EPIC,      // 500-999 points
        LEGENDARY  // 1000+ points
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
        uint256 createdAt;         // Timestamp when chapter was created
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
        uint256 createdAt;                   // Timestamp when story was created
        uint256 proposalVoteEndTime;         // Timestamp when proposal voting ends
        mapping(address => ProposalVoteType) proposalVotes; // Tracks proposal votes
        uint256 proposalYesVotes;            // Count of YES votes for the proposal
        uint256 proposalNoVotes;             // Count of NO votes for the proposal
        uint256 currentChapterIndex;         // Index of the current active chapter being voted on
        Chapter[] chapters;                  // Array of all chapters in the story
        mapping(address => bool) isCollaborator; // Quick lookup for collaborators
    }

    struct UserProfile {
        uint256 totalPoints;
        uint256 storiesParticipated;
        uint256 winningVotes;
        address referrer;
        uint256 referralCount;
        bool isRegistered;
        uint256 registeredAt;
    }

    struct LoreFragmentData {
        uint256 storyId;
        uint256 chapterId;
        uint256 choiceIndex;
        uint256 mintTimestamp;
        uint256 userPointsAtMint;
        RarityTier rarity;
    }

    struct LeaderboardEntry {
        address user;
        uint256 points;
        uint256 winningVotes;
        uint256 storiesParticipated;
        uint256 referralCount;
    }

    // Mappings
    mapping(uint256 => Story) public stories; // storyId => Story struct
    mapping(uint256 => uint256) public storyIdToCurrentChapterIndex; // Convenience mapping
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => LoreFragmentData) public loreFragmentData;
    mapping(address => uint256[]) public userOwnedFragments;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public earlyVoters; // storyId => chapterId => voter => isEarlyVoter
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasClaimedFragment; // storyId => chapterId => user => claimed
    mapping(uint256 => mapping(uint256 => mapping(address => uint256))) public userVoteChoices;
    mapping(uint256 => bool) public storyCompletionBonusAvailable;
    mapping(uint256 => mapping(address => bool)) public hasClaimedCompletionBonus; // storyId => user => claimed



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
    event UserRegistered(address indexed user, address indexed referrer);
    event PointsAwarded(address indexed user, uint256 points, string reason);
    event LeaderboardUpdated(address indexed user, uint256 position, uint256 points);
    event StoryCompleted(uint256 indexed storyId, uint256 totalChapters, uint256 totalParticipants);
    event StoryCompletionBonusAwarded(address indexed user, uint256 indexed storyId, uint256 bonusPoints);

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
     * @dev Register user with optional referrer
     */
    function registerUser(address _referrer) external {
        if (userProfiles[msg.sender].isRegistered) revert UserAlreadyRegistered();
        if (_referrer == msg.sender) revert CannotReferSelf();
        
        UserProfile storage profile = userProfiles[msg.sender];
        profile.isRegistered = true;
        profile.registeredAt = block.timestamp;
        
        if (_referrer != address(0) && userProfiles[_referrer].isRegistered) {
            profile.referrer = _referrer;
            userProfiles[_referrer].referralCount++;
        }
        
        emit UserRegistered(msg.sender, _referrer);
    }

    /**
     * @dev Award points to user and update leaderboard
     */
    function _awardPoints(address _user, uint256 _points, string memory _reason) internal {
        if (!userProfiles[_user].isRegistered) {
            // Auto-register user if not registered
            userProfiles[_user].isRegistered = true;
            userProfiles[_user].registeredAt = block.timestamp;
        }
        
        userProfiles[_user].totalPoints += _points;
        emit PointsAwarded(_user, _points, _reason);
        
        _updateLeaderboard(_user);
    }

    /**
     * @dev Update leaderboard with user's new points
     */
    function _updateLeaderboard(address _user) internal {
        uint256 userPoints = userProfiles[_user].totalPoints;
        UserProfile storage profile = userProfiles[_user];
        
        // Find if user is already in leaderboard
        uint256 existingIndex = type(uint256).max;
        for (uint256 i = 0; i < leaderboardCount; i++) {
            if (leaderboard[i].user == _user) {
                existingIndex = i;
                break;
            }
        }
        
        // Create new entry
        LeaderboardEntry memory newEntry = LeaderboardEntry({
            user: _user,
            points: userPoints,
            winningVotes: profile.winningVotes,
            storiesParticipated: profile.storiesParticipated,
            referralCount: profile.referralCount
        });
        
        if (existingIndex != type(uint256).max) {
            // Update existing entry
            leaderboard[existingIndex] = newEntry;
            
            // Bubble sort to maintain order (simple for hackathon)
            for (uint256 i = existingIndex; i > 0 && leaderboard[i].points > leaderboard[i-1].points; i--) {
                LeaderboardEntry memory temp = leaderboard[i];
                leaderboard[i] = leaderboard[i-1];
                leaderboard[i-1] = temp;
            }
        } else if (leaderboardCount < 50) {
            // Add new entry
            leaderboard[leaderboardCount] = newEntry;
            leaderboardCount++;
            
            // Bubble sort to maintain order
            for (uint256 i = leaderboardCount - 1; i > 0 && leaderboard[i].points > leaderboard[i-1].points; i--) {
                LeaderboardEntry memory temp = leaderboard[i];
                leaderboard[i] = leaderboard[i-1];
                leaderboard[i-1] = temp;
            }
        } else if (userPoints > leaderboard[49].points) {
            // Replace last entry
            leaderboard[49] = newEntry;
            
            // Bubble sort to maintain order
            for (uint256 i = 49; i > 0 && leaderboard[i].points > leaderboard[i-1].points; i--) {
                LeaderboardEntry memory temp = leaderboard[i];
                leaderboard[i] = leaderboard[i-1];
                leaderboard[i-1] = temp;
            }
        }
    }

    /**
     * @dev Generate token URI from story data and user info
     */
    function generateTokenURI(uint256 _tokenId) public view returns (string memory) {
        LoreFragmentData memory fragment = loreFragmentData[_tokenId];
        Story storage story = stories[fragment.storyId];
        
        string memory rarityName = Utils.getRarityName(uint8(fragment.rarity));
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Utils.base64Encode(bytes(abi.encodePacked(
                '{"name":"', story.title, ' - Chapter ', Utils.toString(fragment.chapterId),
                '","description":"Lore Fragment from collaborative story - ', rarityName, ' rarity",',
                '"attributes":[',
                    '{"trait_type":"Story","value":"', story.title, '"},',
                    '{"trait_type":"Chapter","value":"', Utils.toString(fragment.chapterId), '"},',
                    '{"trait_type":"Rarity","value":"', rarityName, '"},',
                    '{"trait_type":"Points at Mint","value":"', Utils.toString(fragment.userPointsAtMint), '"}',
                '],',
                '"image":"', story.ipfsHashImage, '"}'
            )))
        ));
    }

    /**
     * @dev Creates a new story proposal. The story will first go through a community vote.
     * The first chapter content is provided upfront for users to review.
     * @param _title The title of the story.
     * @param _summary A brief summary of the story for the proposal.
     * @param _ipfsHashImage IPFS hash for the story's cover image.
     * @param _ipfsHashChapter1Content IPFS hash for the content of the first chapter.
     * @param _chapter1Choices An array of choices for the first chapter.
     * @param _collaborators Initial list of collaborators.
     */
    function createStoryProposal(
        string calldata _title,
        string calldata _summary,
        string calldata _ipfsHashImage,
        string calldata _ipfsHashChapter1Content,
        string[] calldata _chapter1Choices,
        address[] calldata _collaborators
    ) external nonReentrant {
        // Input validation (remove proposal vote duration check)
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_summary).length > 0, "Summary cannot be empty");
        require(bytes(_ipfsHashImage).length > 0, "Image hash cannot be empty");
        require(bytes(_ipfsHashChapter1Content).length > 0, "Chapter 1 content hash cannot be empty");

        uint256 storyId = _storyIdCounter++;
        
        _initializeStory(storyId, _title, _summary, _ipfsHashImage);
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
        string calldata _ipfsHashImage
    ) internal {
        Story storage story = stories[_storyId];
        story.storyId = _storyId;
        story.writer = payable(msg.sender);
        story.title = _title;
        story.summary = _summary;
        story.ipfsHashImage = _ipfsHashImage;
        story.status = StoryStatus.PROPOSAL_PENDING_VOTE;
        story.createdAt = block.timestamp;
        story.proposalVoteEndTime = block.timestamp + PROPOSAL_VOTING_PERIOD;
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
        firstChapter.createdAt = block.timestamp;
        firstChapter.voteEndTime = 0; // Will be set when story is approved
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
            // Set voting period for first chapter when story is approved
            story.chapters[0].voteEndTime = block.timestamp + CHAPTER_VOTING_PERIOD;
            story.chapters[0].isResolved = false; // Allow voting on first chapter
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
     */
function addChapter(
    uint256 _storyId,
    uint256 _previousChapterIndex,
    uint256 _previousChapterWinningChoiceIndex,
    string calldata _ipfsHash,
    string[] calldata _choices
) external nonReentrant onlyCollaborator(_storyId) storyExists(_storyId) {
    Story storage story = stories[_storyId];

    if (story.status != StoryStatus.ACTIVE) revert CannotAddChapterToNonActiveStory();
    if (_previousChapterIndex >= story.chapters.length) revert InvalidPreviousChapterIndex();

    Chapter storage prevChapter = story.chapters[_previousChapterIndex];
    if (!prevChapter.isResolved) revert PreviousChapterNotResolved();
    if (prevChapter.winningChoiceIndex != _previousChapterWinningChoiceIndex) revert InvalidPreviousChapterIndex();

    if (story.chapters.length > 1 && !story.chapters[story.currentChapterIndex].isResolved) {
        revert ChapterCannotBeAddedToLiveVote();
    }

    if (bytes(_ipfsHash).length == 0) revert InvalidInput();

    uint256 newChapterIndex = story.chapters.length;
    
    prevChapter.choices[_previousChapterWinningChoiceIndex].nextChapterIndex = newChapterIndex;

    _createNewChapter(story, newChapterIndex, _storyId, _ipfsHash, _choices);
    
    story.currentChapterIndex = newChapterIndex;
    emit ChapterAdded(_storyId, newChapterIndex, _ipfsHash, block.timestamp + CHAPTER_VOTING_PERIOD);
}

    /**
     * @dev Internal function to create a new chapter
     */
    function _createNewChapter(
        Story storage _story,
        uint256 _chapterIndex,
        uint256 _storyId,
        string calldata _ipfsHash,
        string[] calldata _choices
    ) internal {
        Chapter storage newChapter = _story.chapters.push();
        newChapter.chapterId = _chapterIndex;
        newChapter.storyId = _storyId;
        newChapter.ipfsHash = _ipfsHash;
        newChapter.createdAt = block.timestamp;
        newChapter.voteEndTime = block.timestamp + CHAPTER_VOTING_PERIOD;
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

        // NEW: Track early voters (within first 6 hours)
        if (block.timestamp <= chapter.createdAt + EARLY_VOTE_PERIOD) {
            earlyVoters[_storyId][_chapterIndex][msg.sender] = true;
        }

        // NEW: Update user participation stats
        if (!_hasUserParticipatedInStory(msg.sender, _storyId)) {
            userProfiles[msg.sender].storiesParticipated++;
        }

        chapter.choices[_choiceIndex].voteCount++;
        chapter.voteCountSum++;
        chapter.hasVoted[msg.sender] = true;
        userVoteChoices[_storyId][_chapterIndex][msg.sender] = _choiceIndex;

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

        // NEW: Award points and mint NFTs for winning voters
        _processWinningVoters(_storyId, _chapterIndex, winningChoiceIndex);

        emit ChapterResolved(
            _storyId,
            _chapterIndex,
            winningChoiceIndex,
            chapter.choices[winningChoiceIndex].text
        );
    }

    /**
     * @dev End a story - can be called by writer or collaborators
     * Awards completion bonus to all participants
     */
    function endStory(uint256 _storyId) external onlyCollaborator(_storyId) storyExists(_storyId) {
        Story storage story = stories[_storyId];
        
        if (story.status != StoryStatus.ACTIVE) revert InvalidStoryStatus();
        if (story.chapters.length == 0) revert InvalidInput();
        
        if (story.chapters.length > 0) {
            Chapter storage currentChapter = story.chapters[story.currentChapterIndex];
            if (!currentChapter.isResolved && block.timestamp < currentChapter.voteEndTime) {
                revert InvalidChapterStatus();
            }
        }
        
        story.status = StoryStatus.COMPLETED;
        _awardStoryCompletionBonus(_storyId);
        
        emit StoryCompleted(_storyId, story.chapters.length, _getStoryParticipantCount(_storyId));
    }

    /**
     * @dev Award completion bonus to all story participants
     */
    function _awardStoryCompletionBonus(uint256 _storyId) internal {
        // Story storage story = stories[_storyId];
        
        // Create a mapping to track unique participants
        // address[] memory participants = new address[](0);
        
        // We'll award bonus through a claimable system to avoid gas issues
        // Mark story as having completion bonus available
        storyCompletionBonusAvailable[_storyId] = true;
    }

    /**
     * @dev Users claim their story completion bonus
     */
    function claimStoryCompletionBonus(uint256 _storyId) external nonReentrant storyExists(_storyId) {
        Story storage story = stories[_storyId];
        
        if (story.status != StoryStatus.COMPLETED) revert InvalidStoryStatus();
        if (!storyCompletionBonusAvailable[_storyId]) revert InvalidInput();
        if (hasClaimedCompletionBonus[_storyId][msg.sender]) revert AlreadyVoted();
        if (!_hasUserParticipatedInStory(msg.sender, _storyId)) revert Unauthorized();
        
        hasClaimedCompletionBonus[_storyId][msg.sender] = true;
        _awardPoints(msg.sender, POINTS_STORY_COMPLETION, "Story completion bonus");
        
        emit StoryCompletionBonusAwarded(msg.sender, _storyId, POINTS_STORY_COMPLETION);
    }

    /**
     * @dev Pause a story (emergency function)
     */
    function pauseStory(uint256 _storyId) external onlyStoryOwner(_storyId) storyExists(_storyId) {
        Story storage story = stories[_storyId];
        if (story.status != StoryStatus.ACTIVE) revert InvalidStoryStatus();
        story.status = StoryStatus.PAUSED;
    }

    /**
     * @dev Resume a paused story
     */
    function resumeStory(uint256 _storyId) external onlyStoryOwner(_storyId) storyExists(_storyId) {
        Story storage story = stories[_storyId];
        if (story.status != StoryStatus.PAUSED) revert InvalidStoryStatus();
        story.status = StoryStatus.ACTIVE;
    }

    /**
     * @dev Get count of unique participants in a story
     */
    function _getStoryParticipantCount(uint256 _storyId) internal view returns (uint256) {
        Story storage story = stories[_storyId];
        
        // Simple approach: count votes across all chapters
        // In a more sophisticated version, you'd track unique addresses
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < story.chapters.length; i++) {
            totalVotes += story.chapters[i].voteCountSum;
        }
        
        return totalVotes; // Approximation - actual unique users would be lower
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return generateTokenURI(tokenId);
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
        uint256 createdAt,
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
            chapter.createdAt,
            chapter.voteEndTime,
            chapter.winningChoiceIndex,
            chapter.isResolved,
            chapter.voteCountSum
        );
    }

    /**
     * @dev Process winning voters - award points and mint NFTs
     */
    function _processWinningVoters(uint256 _storyId, uint256 _chapterIndex, uint256 _winningChoiceIndex) internal {
        // Get all voters who voted for winning choice
        // Note: We need to track voters during voting, so modify the voting storage
        
        // For now, we'll mint NFTs in a separate function call due to gas limits
        // In production, you might want to use a keeper or batch processing
    }

    /**
     * @dev Users claim their own NFT after winning (much better!)
     */
    function claimWinnerFragment(
        uint256 _storyId,
        uint256 _chapterIndex
    ) external nonReentrant storyExists(_storyId) chapterExists(_storyId, _chapterIndex) {
        Story storage story = stories[_storyId];
        Chapter storage chapter = story.chapters[_chapterIndex];
        
        require(chapter.isResolved, "Chapter not resolved yet");
        require(chapter.hasVoted[msg.sender], "You did not vote");
        
        // Check if user voted for winning choice
        uint256 userChoice = userVoteChoices[_storyId][_chapterIndex][msg.sender];
        require(userChoice == chapter.winningChoiceIndex, "You didn't vote for winning choice");
        
        // Check if already claimed
        require(!hasClaimedFragment[_storyId][_chapterIndex][msg.sender], "Already claimed");
        
        // Award points
        uint256 points = POINTS_WINNING_VOTE;
        
        // Bonus points for early voting
        if (earlyVoters[_storyId][_chapterIndex][msg.sender]) {
            points += POINTS_EARLY_VOTE;
        }
        
        // Award referral points to referrer (only on first win)
        address referrer = userProfiles[msg.sender].referrer;
        if (referrer != address(0) && userProfiles[msg.sender].winningVotes == 0) {
            _awardPoints(referrer, POINTS_REFERRAL, "Referral bonus");
        }
        
        _awardPoints(msg.sender, points, "Winning vote");
        userProfiles[msg.sender].winningVotes++;
        
        // Mark as claimed
        hasClaimedFragment[_storyId][_chapterIndex][msg.sender] = true;
        
        // Mint NFT
        uint256 tokenId = _loreFragmentTokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        // Store fragment data
        loreFragmentData[tokenId] = LoreFragmentData({
            storyId: _storyId,
            chapterId: _chapterIndex,
            choiceIndex: userChoice,
            mintTimestamp: block.timestamp,
            userPointsAtMint: userProfiles[msg.sender].totalPoints,
            rarity: getUserRarityTier(msg.sender)
        });
        
        // Track user's NFTs
        userOwnedFragments[msg.sender].push(tokenId);
        
        emit LoreFragmentMinted(msg.sender, _storyId, _chapterIndex, tokenId);
    }

    /**
     * @dev Check if user has participated in a story
     */
    function _hasUserParticipatedInStory(address _user, uint256 _storyId) internal view returns (bool) {
        // Simple check - iterate through story chapters to see if user voted
        Story storage story = stories[_storyId];
        for (uint256 i = 0; i < story.chapters.length; i++) {
            if (story.chapters[i].hasVoted[_user]) {
                return true;
            }
        }
        return false;
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

    /**
     * @dev Gets detailed information about a story.
     * @param _storyId The ID of the story.
     */
    function getStoryDetails(uint256 _storyId) external view storyExists(_storyId) returns (
        uint256 storyId,
        address writer,
        string memory title,
        string memory summary,
        string memory ipfsHashImage,
        address[] memory collaborators,
        StoryStatus status,
        uint256 createdAt,
        uint256 proposalVoteEndTime,
        uint256 proposalYesVotes,
        uint256 proposalNoVotes,
        uint256 currentChapterIndex,
        uint256 totalChapters
    ) {
        Story storage story = stories[_storyId];
        return (
            story.storyId,
            story.writer,
            story.title,
            story.summary,
            story.ipfsHashImage,
            story.collaborators,
            story.status,
            story.createdAt,
            story.proposalVoteEndTime,
            story.proposalYesVotes,
            story.proposalNoVotes,
            story.currentChapterIndex,
            story.chapters.length
        );
    }

    /**
     * @dev Gets the total number of chapters for a story.
     * @param _storyId The ID of the story.
     */
    function getTotalChapters(uint256 _storyId) external view storyExists(_storyId) returns (uint256) {
        return stories[_storyId].chapters.length;
    }

    /**
     * @dev Gets story status.
     * @param _storyId The ID of the story.
     */
    function getStoryStatus(uint256 _storyId) external view storyExists(_storyId) returns (StoryStatus) {
        return stories[_storyId].status;
    }

    /**
     * @dev Gets proposal voting information.
     * @param _storyId The ID of the story.
     */
    function getProposalInfo(uint256 _storyId) external view storyExists(_storyId) returns (
        uint256 proposalVoteEndTime,
        uint256 proposalYesVotes,
        uint256 proposalNoVotes,
        bool isVotingActive
    ) {
        Story storage story = stories[_storyId];
        return (
            story.proposalVoteEndTime,
            story.proposalYesVotes,
            story.proposalNoVotes,
            block.timestamp < story.proposalVoteEndTime && story.status == StoryStatus.PROPOSAL_PENDING_VOTE
        );
    }

    /**
     * @dev Gets a user's vote on a proposal.
     * @param _storyId The ID of the story.
     * @param _voter The address of the voter.
     */
    function getUserProposalVote(uint256 _storyId, address _voter) external view storyExists(_storyId) returns (ProposalVoteType) {
        return stories[_storyId].proposalVotes[_voter];
    }

    /**
     * @dev Gets chapter choices (without the full chapter data).
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter.
     */
    function getChapterChoices(uint256 _storyId, uint256 _chapterIndex) external view storyExists(_storyId) chapterExists(_storyId, _chapterIndex) returns (Choice[] memory) {
        return stories[_storyId].chapters[_chapterIndex].choices;
    }

    /**
     * @dev Checks if voting is currently active for a chapter.
     * @param _storyId The ID of the story.
     * @param _chapterIndex The index of the chapter.
     */
    function isChapterVotingActive(uint256 _storyId, uint256 _chapterIndex) external view storyExists(_storyId) chapterExists(_storyId, _chapterIndex) returns (bool) {
        Story storage story = stories[_storyId];
        Chapter storage chapter = story.chapters[_chapterIndex];
        
        return (
            story.status == StoryStatus.ACTIVE &&
            _chapterIndex == story.currentChapterIndex &&
            !chapter.isResolved &&
            block.timestamp < chapter.voteEndTime
        );
    }

    function getVotingPeriods() external pure returns (uint256 proposalPeriod, uint256 chapterPeriod) {
        return (PROPOSAL_VOTING_PERIOD, CHAPTER_VOTING_PERIOD);
    }

    /**
     * @dev Get user's rarity tier based on points
     */
    function getUserRarityTier(address _user) public view returns (RarityTier) {
        uint256 points = userProfiles[_user].totalPoints;
        
        if (points >= 1000) return RarityTier.LEGENDARY;
        if (points >= 500) return RarityTier.EPIC;
        if (points >= 100) return RarityTier.RARE;
        return RarityTier.COMMON;
    }

    /**
     * @dev Get user profile details
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    /**
     * @dev Get leaderboard entries
     */
    function getLeaderboard(uint256 _start, uint256 _count) external view returns (LeaderboardEntry[] memory) {
        require(_start < leaderboardCount, "Start index out of bounds");
        
        uint256 end = _start + _count;
        if (end > leaderboardCount) {
            end = leaderboardCount;
        }
        
        LeaderboardEntry[] memory result = new LeaderboardEntry[](end - _start);
        for (uint256 i = _start; i < end; i++) {
            result[i - _start] = leaderboard[i];
        }
        
        return result;
    }

    /**
     * @dev Get user's owned fragment token IDs
     */
    function getUserFragments(address _user) external view returns (uint256[] memory) {
        return userOwnedFragments[_user];
    }

    /**
     * @dev Get fragment data
     */
    function getFragmentData(uint256 _tokenId) external view returns (LoreFragmentData memory) {
        return loreFragmentData[_tokenId];
    }

    /**
     * @dev Check if user can claim NFT for a chapter
     */
    function canClaimFragment(uint256 _storyId, uint256 _chapterIndex, address _user) 
        external view storyExists(_storyId) chapterExists(_storyId, _chapterIndex) returns (bool) {
        
        Chapter storage chapter = stories[_storyId].chapters[_chapterIndex];
        
        if (!chapter.isResolved) return false;
        if (!chapter.hasVoted[_user]) return false;
        if (hasClaimedFragment[_storyId][_chapterIndex][_user]) return false;
        
        uint256 userChoice = userVoteChoices[_storyId][_chapterIndex][_user];
        return userChoice == chapter.winningChoiceIndex;
    }

    /**
     * @dev Check if user can claim story completion bonus
     */
    function canClaimCompletionBonus(uint256 _storyId, address _user) 
        external view storyExists(_storyId) returns (bool) {
        
        Story storage story = stories[_storyId];
        
        if (story.status != StoryStatus.COMPLETED) return false;
        if (!storyCompletionBonusAvailable[_storyId]) return false;
        if (hasClaimedCompletionBonus[_storyId][_user]) return false;
        
        return _hasUserParticipatedInStory(_user, _storyId);
    }
}