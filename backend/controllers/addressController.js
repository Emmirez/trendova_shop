import User from '../models/User.js';

// @GET /api/users/addresses - accessible by authenticated users only
export const getAddresses = async (req, res, next) => {
  try {
    // Make sure we're using the logged-in user's ID
    const user = await User.findById(req.user._id).select('addresses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json({ addresses: user.addresses || [] });
  } catch (error) {
    next(error);
  }
};

// @POST /api/users/addresses - accessible by authenticated users only
export const addAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, country, isDefault } = req.body;
    
    // Validate required fields
    if (!street || !city || !state) {
      return res.status(400).json({ 
        message: 'Please provide street, city, and state.' 
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // If this is the first address or isDefault is true, set as default
    const shouldBeDefault = user.addresses.length === 0 || isDefault;
    
    // If setting as default, remove default from other addresses
    if (shouldBeDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses.push({
      label: label || 'Home',
      street,
      city,
      state,
      country: country || 'Nigeria',
      isDefault: shouldBeDefault,
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Address added successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/users/addresses/:addressId
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    
    // Update fields
    if (label) address.label = label;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (country) address.country = country;
    
    // Handle default address
    if (isDefault && !address.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Address updated successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/users/addresses/:addressId
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    
    // If deleting default address, set another as default if exists
    const wasDefault = address.isDefault;
    
    address.deleteOne();
    
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Address deleted successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/users/addresses/:addressId/default
export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set new default
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    
    address.isDefault = true;
    await user.save();
    
    res.json({
      message: 'Default address updated.',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};