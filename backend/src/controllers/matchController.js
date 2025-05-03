const User = require("../models/User");
const Match = require("../models/Match");
const { successResponse, errorResponse } = require("../helpers/responseHelper");
const mongoose = require('mongoose');

// Register a swipe (like or dislike)
const registerSwipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user.id;

    // Verify that the target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get the current user
    const currentUser = await User.findById(currentUserId);

    if (action === 'like') {
      // Verify if there is already a match
      const existingMatch = await Match.findOne({
        $or: [
          { user1: currentUserId, user2: targetUserId },
          { user1: targetUserId, user2: currentUserId }
        ]
      });

      if (existingMatch) {
        return errorResponse(res, 'There is already a match with this user', 400);
      }

      // Verify if the user has already given like
      if (currentUser.likes.includes(targetUserId)) {
        return errorResponse(res, 'You have already given like to this user', 400);
      }

      // Register the like
      currentUser.likes.push(targetUserId);
      await currentUser.save();

      // Verify if there is a match
      if (targetUser.likes.includes(currentUserId)) {
        try {
          // Create a new match
          const newMatch = new Match({
            user1: currentUserId,
            user2: targetUserId
          });
          await newMatch.save();

          return successResponse(res, {
            isMatch: true,
            matchId: newMatch._id,
            message: 'It is a match!',
            user: targetUser
          });
        } catch (error) {
          // If there's a duplicate key error, it means the match already exists
          if (error.code === 11000) {
            return errorResponse(res, 'Error con la BD', 400);
          }
          throw error;
        }
      }

      return successResponse(res, {
        isMatch: false,
        message: 'Like registered'
      });

    } else if (action === 'dislike') {
      // Register the dislike
      if (!currentUser.dislikes.includes(targetUserId)) {
        currentUser.dislikes.push(targetUserId);
        await currentUser.save();
      }

      return successResponse(res, {
        message: 'Dislike registered' 
      });
    } else {
      return errorResponse(res, 'Invalid action', 400);
    }

  } catch (error) {
    console.error('Error in registerSwipe:', error);
    return errorResponse(res);
  }
};

const getMatchesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify that the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'Invalid user ID format'
      });
    }

    // Verify that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'User not found'
      });
    }

    // Search all active matches where the user is involved
    const matches = await Match.find({
      $or: [
        { user1: userId },
        { user2: userId }
      ],
      isActive: true
    })
    .populate({
      path: 'user1 user2',
      select: '_id email'
    });

    // Transform the matches to only include the matched user's info
    const matchedUsers = matches.map(match => {
      const matchedUser = match.user1._id.toString() === userId ? match.user2 : match.user1;
      return {
        userId: matchedUser._id,
        email: matchedUser.email
      };
    });

    res.status(200).json({
      message: 'Matches found successfully',
      matches: matchedUsers
    });
  } catch (error) {
    //console.error('Error in getMatchesByUser:', error);
    res.status(500).json({ 
      message: 'Error in getMatchesByUser',
      error: error.message 
    });
  }
};

module.exports = {
  registerSwipe,
  getMatchesByUser
};
