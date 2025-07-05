import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Phone, Camera, Home, Settings, PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import Loader from '../components/Loader';

export default function ProfilePage() {
  const [activePanel, setActivePanel] = useState('personal');
  const [triggerSubmitAfterAddress, setTriggerSubmitAfterAddress] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [user, setUser] = useState();
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/user_profile', {
          method: 'GET',
          credentials: 'include', 
        });
        console.log(res);
        
        const data = await res.json();
        console.log(data);
        
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');
  
        const formattedData = formatUserData(data);
        setUser(formattedData);
        setFormData(formattedData);
      } catch (err) {
        console.log(err);
        console.error('Error fetching profile:', err.message);
      }
    };
  
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (triggerSubmitAfterAddress) {
      console.log("Updated formData:", formData);
      handleSubmit();
      setTriggerSubmitAfterAddress(false); 
    }
  }, [formData]);

  const formatUserData = (data) => ({
    name: data.Name,
    email: data.Email,
    phone: data.PhoneNumber || '',
    avatarUrl: data.Avatar || '/avatars/default.png',
    addresses: (data.addresses || []).map((addr, index) => ({
      id: addr._id || index + 1,
      type: addr.type || 'Other',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      isDefault: addr.isDefault || false,
    })),
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      twoFactorAuth: false,
    },
  });  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (setting) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));
  };

  const handleNewAddressChange = (field, value) => {

    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));

  };

  const AddNewAddress = () => {

    const updatedAddresses = [...formData.addresses, newAddress];
    setFormData({ ...formData, addresses: updatedAddresses });
    setTriggerSubmitAfterAddress(true);
    setAddingNewAddress(false); 
    setNewAddress({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
  }

  const handleAddressChange = (index, field, value) => {

    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][field] = value;
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };
  

  const handleSetDefaultAddress = (index) => {

    const updatedAddresses = formData.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    setFormData({ ...formData, addresses: updatedAddresses });
    setTriggerSubmitAfterAddress(true);
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (formData.addresses.length === 0) {
      console.log("Warning: No addresses to update");
    }
    
    const payload = {
      phone: formData.phone,
      avatar: formData.avatarUrl,
      addresses: formData.addresses.map(a => ({
        id: a.id,
        type: a.type,
        street: a.street,
        city: a.city,
        state: a.state,
        zipCode: a.zipCode,
        isDefault: a.isDefault,
      })),
    };
  
    try {
      const res = await fetch('http://localhost:5000/update_user_profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      console.log(res);
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  
      const formattedData = formatUserData(data);
      
      setUser(formattedData);
      setFormData(formattedData);
      setIsEditing(false);
      setEditingAddressIndex(null);
      console.log('Profile updated:', data);
    } catch (err) {
      console.error('Error updating profile:', err.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    const addressToDelete = formData.addresses[index];
    console.log(addressToDelete);
    console.log(addressToDelete.id);
    
    if (!addressToDelete ) {
      alert("Address not found");
      return;
    }

    if ( !addressToDelete.id) {
      alert("Address ID not found");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/delete_address/${addressToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete address");

      const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
      setFormData({ ...formData, addresses: updatedAddresses });

      alert("Address deleted successfully!");
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({...user});
    setIsEditing(false);
    setEditingAddressIndex(null);
    setAddingNewAddress(false);
  };

  if (!formData) {
    return <Loader/>;
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'personal':
        return (
          <div className="bg-slate-800 border-1 border-lime-100 p-6 rounded-lg shadow-md transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Personal Details</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Edit size={18} />
                  Edit
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <div className="flex items-center border rounded-md overflow-hidden border-slate-600 cursor-not-allowed">
                      <div className="p-2 bg-slate-700 cursor-not-allowed">
                        <User size={20} className="text-gray-300 cursor-not-allowed" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 cursor-not-allowed focus:outline-none bg-slate-700 text-white"
                        required
                        readOnly 
                        disabled 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                    <div className="flex items-center border rounded-md overflow-hidden border-slate-600 cursor-not-allowed">
                      <div className="p-2 bg-slate-700 cursor-not-allowed">
                        <Mail size={20} className="text-gray-300 cursor-not-allowed" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 cursor-not-allowed focus:outline-none bg-slate-700 text-white"
                        required
                        readOnly 
                        disabled 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <div className="flex items-center border rounded-md overflow-hidden border-slate-600">
                      <div className="p-2 bg-slate-700">
                        <Phone size={20} className="text-gray-300" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 focus:outline-none bg-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-gray-200 rounded-md hover:bg-slate-700 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex text-left  items-center gap-6 p-3 bg-slate-700 rounded-md pl-5">
                    <User size={20} className="text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="font-medium text-white">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex text-left items-center gap-6 p-3 bg-slate-700 rounded-md pl-5">
                    <Mail size={20} className="text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-400">Email Address</p>
                      <p className="font-medium text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex text-left items-center gap-6 p-3 bg-slate-700 rounded-md pl-5">
                    <Phone size={20} className="text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="font-medium text-white">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'addresses':
        return (
          <div className="bg-slate-800 border-1 border-lime-100 p-6 rounded-lg shadow-md transition-colors duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-white">My Addresses</h2>
              {!addingNewAddress && editingAddressIndex === null && (
                <button
                  onClick={() => setAddingNewAddress(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <PlusCircle size={18} />
                  Add Address
                </button>
              )}
            </div>

            {addingNewAddress ? (
              <div className="mb-8 border border-slate-700 p-4 rounded-lg bg-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Add New Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Address Type</label>
                    <select
                      value={newAddress.type}
                      onChange={(e) => handleNewAddressChange('type', e.target.value)}
                      className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => handleNewAddressChange('street', e.target.value)}
                      className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => handleNewAddressChange('city', e.target.value)}
                      className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => handleNewAddressChange('state', e.target.value)}
                      className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">ZIP Code</label>
                    <input
                      type="text"
                      value={newAddress.zipCode}
                      onChange={(e) => handleNewAddressChange('zipCode', e.target.value)}
                      className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2 flex items-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => handleNewAddressChange('isDefault', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-300">Set as default address</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setAddingNewAddress(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-gray-200 rounded-md hover:bg-slate-600 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={AddNewAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    <Save size={18} />
                    Save Address
                  </button>
                </div>
              </div>
            ) : null}

            {formData.addresses.length > 0 ? (
              <div className="space-y-4">
                {formData.addresses.map((address, index) => (
                  <div key={address.id || index} className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-400 bg-blue-900/20' : 'border-slate-400'}`}>
                    {editingAddressIndex === index ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Address Type</label>
                            <select
                              value={formData.addresses[index].type}
                              onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                              className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Street Address</label>
                            <input
                              type="text"
                              value={formData.addresses[index].street}
                              onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                              className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">City</label>
                            <input
                              type="text"
                              value={formData.addresses[index].city}
                              onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                              className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">State</label>
                            <input
                              type="text"
                              value={formData.addresses[index].state}
                              onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                              className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">ZIP Code</label>
                            <input
                              type="text"
                              value={formData.addresses[index].zipCode}
                              onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                              className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-gray-200 rounded-md hover:bg-slate-700 transition"
                          >
                            <X size={18} />
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleSubmit(); 
                              setEditingAddressIndex(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            <Save size={18} />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-medium text-white">{address.type} Address</span>
                            {address.isDefault && <span className="ml-2 px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-md">Default</span>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingAddressIndex(index)}
                              className="text-gray-300 hover:text-blue-400"
                            >
                              <Edit size={18} />
                            </button>
                            {formData.addresses.length > 1 && (
                              <button
                                onClick={() => handleDeleteAddress(index)}
                                className="text-gray-300 hover:text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start text-left gap-3">
                          <MapPin size={20} className="text-gray-400 mt-1" />
                          <div>
                            <p className="text-gray-300">{address.street}</p>
                            <p className="text-gray-300">{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                        </div>

                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(index)}
                            className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                          >
                            Set as Default
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MapPin size={40} className="mx-auto mb-3 text-gray-400" />
                <p>You don't have any saved addresses yet.</p>
              </div>
            )}
          </div>
        );

      case 'avatar':
        return (
          <div className="bg-slate-800 border-1 border-lime-100 p-6 rounded-lg shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Picture</h2>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-6">
                <img
                  src={`/avatars/${user.avatarUrl}`}
                  alt="Profile Avatar"
                  className="w-40 h-40 rounded-full object-cover border-4 border-purple-400"
                />
                <button 
                  onClick={ () => navigate('/avatar') }
                  className="absolute bottom-3 right-3 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md">
                  <Camera size={24} />
                </button>
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                <p className="text-gray-400">{user.email}</p>

                <div className="flex gap-3 mt-6 justify-center">
                  <button className="px-4 py-2 border border-slate-600 text-gray-200 rounded-md hover:bg-slate-700 transition">
                    Remove
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Upload Your's
                  </button>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  Recommended: Square image, at least 300x300 pixels.
                </p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-slate-800 border-1 border-lime-100 p-6 rounded-lg shadow-md transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Account Settings</h2>
              {isEditing ? null : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Edit size={18} />
                  Edit
                </button>
              )}
            </div>
      
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Email Notifications</h3>
                      <p className="text-sm text-slate-400">Receive order updates and account notices</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.emailNotifications}
                        onChange={() => handleSettingsChange('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">SMS Notifications</h3>
                      <p className="text-sm text-slate-400">Receive order and delivery updates via text</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.smsNotifications}
                        onChange={() => handleSettingsChange('smsNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Marketing Emails</h3>
                      <p className="text-sm text-slate-400">Receive deals, discounts and product updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.marketingEmails}
                        onChange={() => handleSettingsChange('marketingEmails')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-400">Additional security for your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.twoFactorAuth}
                        onChange={() => handleSettingsChange('twoFactorAuth')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
      
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-500 transition"
                  >
                    Delete Account
                  </button>
      
                  <div className="flex-grow"></div>
      
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-slate-600 text-slate-200 rounded-md hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
      
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Email Notifications</h3>
                      <p className="text-sm text-slate-400">Receive order updates and account notices</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${user.settings.emailNotifications ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                      {user.settings.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">SMS Notifications</h3>
                      <p className="text-sm text-slate-400">Receive order and delivery updates via text</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${user.settings.smsNotifications ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                      {user.settings.smsNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Marketing Emails</h3>
                      <p className="text-sm text-slate-400">Receive deals, discounts and product updates</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${user.settings.marketingEmails ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                      {user.settings.marketingEmails ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
      
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-md">
                    <div>
                      <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-400">Additional security for your account</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${user.settings.twoFactorAuth ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                      {user.settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
      
                <div className="mt-6">
                  <button className="px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-500 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <div className="text-white">Select a panel</div>;
      }
      };
      
      return (
        <div className="min-h-screen bg-slate-950 py-8 transition-colors duration-300">
          <div className='flex justify-center mb-10'>
            <h1 className='text-4xl font-bold py-2'>Your Profile</h1>
          </div>
          <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row xl:gap-16 lg:gap-10 md:gap-6 sm:gap-10">
              <div className="md:w-1/3">
                <div className="bg-slate-800 border-1 border-lime-100 p-6 rounded-lg shadow-md">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={`/avatars/${user.avatarUrl}`}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-400 shadow-lg"
                      />
                    </div>
                    <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                  </div>
      
                  <div className="mt-6">
                    <nav className="space-y-2">
                      <button
                        onClick={() => setActivePanel('personal')}
                        className={`flex items-center gap-3 w-full p-3 rounded-md ${activePanel === 'personal' ? 'bg-slate-400/30 text-yellow-400' : 'hover:bg-slate-700 text-yellow-200'}`}>
                        <User size={20} />
                        <span>Personal Details</span>
                      </button>
                      <button
                        onClick={() => setActivePanel('addresses')}
                        className={`flex items-center gap-3 w-full p-3 rounded-md ${activePanel === 'addresses' ? 'bg-slate-400/30 text-green-400' : 'hover:bg-slate-700 text-green-300'}`}>
                        <Home size={20} />
                        <span>Address</span>
                      </button>
                      <button
                        onClick={() => setActivePanel('avatar')}
                        className={`flex items-center gap-3 w-full p-3 rounded-md ${activePanel === 'avatar' ? 'bg-slate-400/30 text-orange-400' : 'hover:bg-slate-700 text-orange-300'}`}>
                        <Camera size={20} />
                        <span>Avatar</span>
                      </button>
                      <button
                        onClick={() => setActivePanel('settings')}
                        className={`flex items-center gap-3 w-full p-3 rounded-md ${activePanel === 'settings' ? 'bg-slate-400/30 text-rose-400' : 'hover:bg-slate-700 text-rose-300'}`}>
                        <Settings size={20} />
                        <span>Account Settings</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
      
              <div className="md:w-2/3">
                {renderPanel()}
              </div>
            </div>
          </div>
        </div>
    )};