import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductForm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    T_Shirt_Type: '',
    Comic_Theme: '',
    Variants: [
      { Size: [], Color: '', Stock: '', Price: '' }
    ],             
    Discount: 0,
    Images: [],               
    CreatedBy: '',            
    Delivery: [
      {
        Days_Required: 5,
        Locations: [],
        Condition: 'Free delivery',
        ConditionValue: null
      }
    ],
    ReturnPolicy: [
      {
        Available: false,
        ValidTill: 'No returns available',
        returnDays: 0
      }
    ],
    isActive: true
  });

  const tShirtTypes = [
    'Oversized', 'Acid Wash', 'Graphic Printed', 'Solid Color', 
    'Polo T-Shirts', 'Sleeveless', 'Long Sleeve', 'Henley', 
    'Hooded', 'Crop Tops'
  ];

  const comicThemes = [
    'Marvel Universe', 'DC Comics', 'Anime Superheroes', 
    'Classic Comics', 'Sci-Fi & Fantasy', 'Video Game Characters', 
    'Custom Fan Art'
  ];

  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const commonColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey', 'Navy', 'Purple'];

  // Fetch user data and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productRes = await fetch(`http://localhost:5000/product_info/${productId}`, {
          credentials: 'include',
        });
        
        if (!productRes.ok) {
          throw new Error('Failed to fetch product data');
        }

        const { product } = await productRes.json();
        
        setFormData({
          Name: product.Name || '',
          Description: product.Description || '',
          T_Shirt_Type: product.T_Shirt_Type || '',
          Comic_Theme: product.Comic_Theme || '',
          Variants: product.Variants && product.Variants.length > 0 
            ? product.Variants 
            : [{ Size: [], Color: '', Stock: '', Price: '' }],
          Discount: product.Discount || 0,
          Images: product.Images || [],
          CreatedBy: product.CreatedBy,
          Delivery: product.Delivery && product.Delivery.length > 0 
            ? product.Delivery 
            : [{
                Days_Required: 5,
                Locations: [],
                Condition: 'Free delivery',
                ConditionValue: null
              }],
          ReturnPolicy: product.ReturnPolicy && product.ReturnPolicy.length > 0 
            ? product.ReturnPolicy 
            : [{
                Available: false,
                ValidTill: 'No returns available',
                returnDays: 0
              }],
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    } else {
      setError('Product ID is required');
      setLoading(false);
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle nested field changes
  const handleNestedChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Update variant price and stock
  const updateVariantField = (index, field, value) => {
    const updatedVariants = [...formData.Variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value  
    };
    handleNestedChange('Variants', updatedVariants);
  };

  // Add a new variant
  const addVariant = () => {
    handleNestedChange('Variants', [
      ...formData.Variants,
      { Size: [], Color: '', Stock: 0, Price: 0 }
    ]);
  };

  // Remove a variant
  const removeVariant = (index) => {
    const updatedVariants = [...formData.Variants];
    updatedVariants.splice(index, 1);
    handleNestedChange('Variants', updatedVariants);
  };

  // Handle size selection for a variant
  const handleSizeSelect = (index, size) => {
    const currentSizes = formData.Variants[index].Size || [];
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size) 
      : [...currentSizes, size];             

    updateVariantField(index, 'Size', updatedSizes);
  };

  // Handle color selection for a variant
  const handleColorSelect = (index, color) => {
    updateVariantField(index, 'Color', color);
  };

  // Update delivery settings
  const updateDeliveryField = (index, field, value) => {
    const updatedDelivery = [...formData.Delivery];
    updatedDelivery[index] = {
      ...updatedDelivery[index],
      [field]: field === 'Days_Required' ? Number(value) : value
    };
    handleNestedChange('Delivery', updatedDelivery);
  };

  // Update return policy
  const updateReturnPolicyField = (index, field, value) => {
    const updatedPolicy = [...formData.ReturnPolicy];
    updatedPolicy[index] = {
      ...updatedPolicy[index],
      [field]: field === 'returnDays' ? Number(value) : value
    };
    handleNestedChange('ReturnPolicy', updatedPolicy);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formDataFile,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json(); 
      const imageObject = { Url: data.url, Alt: file.name };

      handleNestedChange("Images", [...formData.Images, imageObject]);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.Images];
    updatedImages.splice(index, 1);
    handleNestedChange('Images', updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const cleanedVariants = formData.Variants
      .filter(v => v.Size && v.Color && v.Stock !== '' && v.Price !== '')
      .map(v => ({
        ...v,
        Stock: Number(v.Stock),
        Price: Number(v.Price)
      }));

    const finalData = {
      ...formData,
      Variants: cleanedVariants
    };

    try {
      const response = await fetch(`http://localhost:5000/update_product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      console.log('Product updated successfully:', data);
      setTimeout(() => {
        alert('Product Updated Successfully!')
      }, 1000);

      navigate('/vendor_products');

    } catch (err) {
      console.error(err);
      setError('Error updating product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-200 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-300">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-200 p-6 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Product</h2>
          <p className="text-gray-300">{error}</p>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 transition-colors text-white rounded-md"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/vendor_products')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 p-6 mb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-14 gap-4 mt-8">
          <button 
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            onClick={() => navigate('/vendor_products')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 shadow-md border-1 border-lime-200">
                <h2 className="text-xl font-semibold text-white mb-5 pb-2 border-b border-gray-700">Product Information</h2>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="Name" className="block text-sm font-medium text-gray-300 mb-1">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="Name"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="Description" className="block text-sm font-medium text-gray-300 mb-1">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="Description"
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Enter product description"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="T_Shirt_Type" className="block text-sm font-medium text-gray-300 mb-1">
                        T-Shirt Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="T_Shirt_Type"
                        name="T_Shirt_Type"
                        value={formData.T_Shirt_Type}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select T-Shirt Type</option>
                        {tShirtTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="Comic_Theme" className="block text-sm font-medium text-gray-300 mb-1">
                        Comic Theme <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="Comic_Theme"
                        name="Comic_Theme"
                        value={formData.Comic_Theme}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Comic Theme</option>
                        {comicThemes.map(theme => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="Discount" className="block text-sm font-medium text-gray-300 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="Discount"
                      name="Discount"
                      value={formData.Discount}
                      onChange={handleChange}
                      step="1"
                      min="0"
                      placeholder="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2 gap-3">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="isActive" 
                        id="isActive" 
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`block h-6 rounded-full w-12 transition ${formData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white rounded-full h-4 w-4 transition transform ${formData.isActive ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <label 
                      htmlFor="isActive" 
                      className="text-sm font-medium text-gray-300 cursor-pointer select-none"
                    >
                      Active (visible in store)
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Variants Section */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-md border-1 border-lime-200">
                <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Product Variants</h2>
                  <button 
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
                  >
                    Add Variant
                  </button>
                </div>
                
                <div className="space-y-6">
                  {formData.Variants.map((variant, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600 relative">
                      {formData.Variants.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Size <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {commonSizes.map(size => (
                              <div 
                                key={size} 
                                onClick={() => handleSizeSelect(index, size)}
                                className={`
                                  flex items-center justify-center p-2 rounded cursor-pointer transition-colors text-sm
                                  ${variant.Size && variant.Size.includes(size)
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}
                                `}
                              >
                                {size}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Color <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {commonColors.slice(0, 6).map(color => (
                              <div 
                                key={color}
                                onClick={() => handleColorSelect(index, color)}
                                className={`
                                  flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-sm
                                  ${variant.Color === color
                                    ? 'bg-gray-600 border border-purple-500' 
                                    : 'bg-gray-600 border border-gray-500 hover:border-gray-400'}
                                `}
                              >
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-500"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                ></div>
                                <span className="text-gray-300 text-xs">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Stock <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            value={variant.Stock}
                            onChange={(e) => updateVariantField(index, 'Stock', e.target.value)}
                            required
                            min="0"
                            placeholder="0"
                            className="w-full bg-gray-600 border border-gray-500 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Price (₹) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            value={variant.Price}
                            onChange={(e) => updateVariantField(index, 'Price', e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-gray-600 border border-gray-500 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Images */}
            <div className="space-y-6">
              {/* Product Images Section */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-md border-1 border-lime-200">
                <h2 className="text-xl font-semibold text-white mb-5 pb-2 border-b border-gray-700">Product Images</h2>
                
                <div className="space-y-4">
                  <div
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 border border-dashed border-gray-500 rounded-lg p-4 cursor-pointer">
                    <Upload size={20} />
                    <span>Upload Images</span>

                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </div>

                  {formData.Images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {formData.Images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                            <img 
                              src={image.Url} 
                              alt={image.Alt || `Product ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-700/50 rounded-lg p-8 text-center">
                      <p className="text-gray-400">No images uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Delivery Information Section */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-md border-1 border-lime-200">
                <h2 className="text-xl font-semibold text-white mb-5 pb-2 border-b border-gray-700">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Days Required
                      </label>
                      <input
                        type="number"
                        value={formData.Delivery[0].Days_Required}
                        onChange={(e) => updateDeliveryField(0, 'Days_Required', e.target.value)}
                        min="0"
                        placeholder="0"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Locations
                      </label>
                      <input
                        type="text"
                        value={formData.Delivery[0].Locations.join(', ')}
                        onChange={(e) => {
                          const locationsArray = e.target.value
                            .split(',')
                            .map(loc => loc.trim())
                            .filter(Boolean);
                          updateDeliveryField(0, 'Locations', locationsArray);
                        }}
                        placeholder="Enter delivery locations"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1  gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Delivery Condition
                      </label>
                      <select
                        value={formData.Delivery[0].Condition}
                        onChange={(e) => updateDeliveryField(0, 'Condition', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Free delivery">Free delivery</option>
                        <option value="Paid delivery">Paid delivery</option>
                        <option value="Free delivery on order above">Free delivery on order above</option>
                      </select>
                    </div>
                    
                    {formData.Delivery[0].Condition === "Free delivery on order above" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Order Value
                        </label>
                        <input
                          type="number"
                          value={formData.Delivery[0].ConditionValue || ''}
                          onChange={(e) => updateDeliveryField(0, 'ConditionValue', e.target.value)}
                          min="0"
                          placeholder="0.00"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Return Policy Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-md border-1 border-lime-200">
          <h2 className="text-xl font-semibold text-white mb-5 pb-2 border-b border-gray-700">Return Policy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 space-x-3 mb-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="returnAvailable"
                  checked={formData.ReturnPolicy[0].Available}
                  onChange={(e) => updateReturnPolicyField(0, 'Available', e.target.checked)}
                  className="sr-only"
                />
                <div className={`block h-6 rounded-full w-12 transition ${formData.ReturnPolicy[0].Available ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.ReturnPolicy[0].Available ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
              <label htmlFor="returnAvailable" className="text-white font-medium">Return Available</label>
            </div>

            {formData.ReturnPolicy[0].Available && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Return Window (Days)</label>
                    <input
                      type="number"
                      value={formData.ReturnPolicy[0].ReturnWindow}
                      onChange={(e) => updateReturnPolicyField(0, 'ReturnWindow', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Return Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.ReturnPolicy[0].ReturnCost}
                      onChange={(e) => updateReturnPolicyField(0, 'ReturnCost', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                      placeholder="e.g., 5.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Return Conditions</label>
                  <textarea
                    value={formData.ReturnPolicy[0].Conditions.join('\n')}
                    onChange={(e) => updateReturnPolicyField(0, 'Conditions', e.target.value.split('\n').filter(condition => condition.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter return conditions (one per line)&#10;e.g., Item must be unused&#10;Original packaging required&#10;No returns on sale items"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-800 rounded-lg px-4 py-6 shadow-md border-1 border-lime-200 flex flex-col sm:flex-row justify-center gap-3">
            <button 
                type="button" 
                onClick={() => console.log('Navigate back')}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:bg-purple-800/50 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                {saving ? (
                <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                </>
                ) : (
                <>
                    <Save size={18} />
                    <span>Update Product</span>
                </>
                )}
            </button>
            </div>
            </div>
            </div>
        </form>
        </div>
    </div>
    );
};

export default EditProductForm;