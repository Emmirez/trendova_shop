import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { addressService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    label: 'Home',
    isDefault: false,
  });

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.addresses);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      toast.error(err.message || 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: '',
      label: 'Home',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  // Open add modal
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode || '',
      label: address.label,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setShowModal(true);
  };

  // Save address (add or update)
  const handleSave = async () => {
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        await addressService.addAddress(formData);
        toast.success('Address added successfully');
      }
      await fetchAddresses();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save address:', err);
      toast.error(err.message || 'Failed to save address');
    }
  };

  // Delete address
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.deleteAddress(addressId);
        toast.success('Address deleted successfully');
        await fetchAddresses();
      } catch (err) {
        console.error('Failed to delete address:', err);
        toast.error(err.message || 'Failed to delete address');
      }
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId);
      toast.success('Default address updated');
      await fetchAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
      toast.error(err.message || 'Failed to set default address');
    }
  };

  if (loading) {
    return (
      <div className="border theme-border rounded-lg p-8" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">Saved Addresses</h3>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
          >
            <Plus size={13} />
            Add New
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <MapPin size={40} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted">No saved addresses</p>
            <button 
              onClick={handleAdd}
              className="px-6 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {addresses.map((address) => (
              <div key={address._id} className="px-6 py-4 hover:bg-gold/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {address.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gold/10 text-gold font-mono text-[9px] tracking-[0.15em] uppercase border border-gold/20 rounded-lg">
                          <Star size={10} />
                          Default
                        </span>
                      )}
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border theme-border theme-text-muted rounded-lg">
                        {address.label}
                      </span>
                    </div>
                    <p className="font-display font-semibold theme-text text-sm">{address.fullName}</p>
                    <p className="font-body theme-text-secondary text-sm mt-1">{address.phone}</p>
                    <p className="font-body theme-text-secondary text-sm mt-1">
                      {address.street}, {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="font-body theme-text-secondary text-sm">{address.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="px-3 py-1.5 border theme-border theme-text-muted hover:border-gold/40 hover:text-gold font-mono text-[9px] tracking-[0.1em] uppercase transition-all rounded-lg"
                        title="Set as default"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-red-400/40 hover:text-red-400 transition-all rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div className="w-full max-w-lg border theme-border shadow-2xl rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <h3 className="font-display font-bold theme-text text-lg">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Full Name */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 123 456 7890"
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Luxury Avenue"
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lagos"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Lagos State"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
              </div>

              {/* Country & Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Nigeria"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="100001"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Address Label
                </label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Set as Default */}
              {addresses.length > 0 && !editingAddress?.isDefault && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold/20"
                  />
                  <label htmlFor="isDefault" className="font-body theme-text-secondary text-sm">
                    Set as default address
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                <Check size={13} />
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAddresses;