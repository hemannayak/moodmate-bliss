import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      displayName,
      bio,
      dateOfBirth,
      gender,
      phone,
      location,
      avatar,
      photo
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (displayName !== undefined) user.profile.displayName = displayName;
    if (bio !== undefined) user.profile.bio = bio;
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.profile.gender = gender;
    if (phone !== undefined) user.profile.phone = phone;
    if (location !== undefined) user.profile.location = location;
    if (avatar !== undefined) user.profile.avatar = avatar;
    if (photo !== undefined) user.profile.photo = photo;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload avatar
// @route   POST /api/profile/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: 'No avatar provided' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.avatar = avatar;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.profile.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload photo
// @route   POST /api/profile/photo
// @access  Private
export const uploadPhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ message: 'No photo provided' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.photo = photo;
    await user.save();

    res.json({
      message: 'Photo uploaded successfully',
      photo: user.profile.photo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete avatar
// @route   DELETE /api/profile/avatar
// @access  Private
export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.avatar = undefined;
    await user.save();

    res.json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete photo
// @route   DELETE /api/profile/photo
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.photo = undefined;
    await user.save();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
