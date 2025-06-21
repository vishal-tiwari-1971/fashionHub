
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaTshirt, FaPlus, FaCheckCircle, FaEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './App.css';

// Main App Component
function App() {
  const [items, setItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // fetching the products
  useEffect(() => {
    const fetchItems= async ()=>{
      try{
        const response=await axios.get(`${process.env.REACT_APP_API_URL}/product`);
        setItems(response.data);
      } catch(error){
        console.error("Error fetching products",error)
      }
      };
    fetchItems();
  }, []);

  const addItem = async (newItem) => {
    try{
      const response=await axios.post(`${process.env.REACT_APP_API_URL}/product`,newItem , {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setItems([...items, response.data]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch(error){
    console.error("Error adding product",error)
  }
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleEnquire = () => {
    setShowModal(false);
    setShowEmailModal(true);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        
        <div className="container">
          <Routes>
            <Route path="/" element={
              <ViewItemsPage 
                items={items} 
                onItemClick={openItemModal} 
              />
            } />
            <Route path="/add" element={
              <AddItemPage 
                addItem={addItem} 
                showSuccess={showSuccess} 
              />
            } />
          </Routes>
        </div>
        
        {showModal && selectedItem && (
          <ItemDetailModal 
            item={selectedItem} 
            onClose={() => setShowModal(false)}
            onEnquire={handleEnquire}
          />
        )}
        
        {showEmailModal && (
          <EmailModal 
            itemName={selectedItem?.name || "Item"}
            onClose={() => setShowEmailModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

// Header Component
function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <FaTshirt className="logo-icon" />
            <span>FashionHub</span>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  View Items
                </Link>
              </li>
              <li>
                <Link to="/add" className="nav-link">
                  Add Items
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

// View Items Page Component
function ViewItemsPage({ items, onItemClick }) {
  return (
    <div className="page">
      <h1>View Items</h1>
      <div className="items-grid">
        {items.length === 0 ? (
          <div className="no-items">
            <p>No items found. Add some items to get started!</p>
            <Link to="/add" className="btn">
              <FaPlus /> Add New Item
            </Link>
          </div>
        ) : (
          items.map(item => (
            <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))
        )}
      </div>
    </div>
  );
}

// Item Card Component
function ItemCard({ item, onClick }) {
  return (
    <div className="item-card" onClick={onClick}>
      <img src={item.coverImage} alt={item.name} className="item-image" />
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <span className="item-type">{item.type}</span>
      </div>
    </div>
  );
}

// Add Item Page Component
function AddItemPage({ addItem, showSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    coverImage: null,
    additionalImages: []
  });
  
  const [coverPreview, setCoverPreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setFormData(prev => ({ ...prev, coverImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImages = (e) => {
  const files = Array.from(e.target.files);
  const newPreviews = [];
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onloadend = () => {
      newPreviews.push(reader.result);
      // Update previews only when all files are processed
      if (newPreviews.length === files.length) {
        setAdditionalPreviews(prev => [...prev, ...newPreviews]);
      }
    };
    reader.readAsDataURL(file);
  });
  
  setFormData(prev => ({ 
    ...prev, 
    additionalImages: [...prev.additionalImages, ...files] 
  }));
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', formData.name);
  form.append('type', formData.type);
  form.append('description', formData.description);
  
  // Append cover image
  if (formData.coverImage) {
    form.append('coverImage', formData.coverImage);
  }
  
  // Append additional images
  formData.additionalImages.forEach((image) => {
    form.append('additionalImages', image);
  });
  
  await addItem(form);
  
  // Reset form
  setFormData({
    name: '',
    type: '',
    description: '',
    coverImage: null,
    additionalImages: []
  });
  setCoverPreview(null);
  setAdditionalPreviews([]);
};

  return (
    <div className="page">
      <h1>Add New Item</h1>
      
      {showSuccess && (
        <div className="success-message">
          <FaCheckCircle /> Item successfully added!
        </div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input
              type="text"
              id="item-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="item-type">Item Type</label>
            <select
              id="item-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select item type</option>
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="Shoes">Shoes</option>
              <option value="Sports Gear">Sports Gear</option>
              <option value="Jacket">Jacket</option>
              <option value="Accessory">Accessory</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="item-description">Item Description</label>
            <textarea
              id="item-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Item Cover Image</label>
            <div className="file-upload" onClick={() => document.getElementById('cover-image').click()}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="preview-image" />
              ) : (
                <>
                  <div className="upload-icon">
                    <FaPlus />
                  </div>
                  <p>Click to upload cover image</p>
                </>
              )}
              <input 
                type="file" 
                id="cover-image" 
                accept="image/*" 
                onChange={handleCoverImage}
                hidden 
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Additional Images</label>
            <div className="file-upload" onClick={() => document.getElementById('additional-images').click()}>
              <div className="upload-icon">
                <FaPlus />
              </div>
              <p>Click to upload additional images</p>
              <input 
                type="file" 
                id="additional-images" 
                accept="image/*" 
                onChange={handleAdditionalImages}
                multiple 
                hidden 
              />
            </div>
            <div className="preview-container">
              {additionalPreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} className="preview-image" />
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn-submit">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

// Item Detail Modal Component
function ItemDetailModal({ item, onClose, onEnquire }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine cover image with additional images
  const allImages = [item.coverImage, ...item.additionalImages];
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.name}</h2>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <div className="carousel">
            <div className="carousel-images">
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} - ${index + 1}`}
                  className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <button className="carousel-prev" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            
            <button className="carousel-next" onClick={nextImage}>
              <FaChevronRight />
            </button>
            
            <div className="carousel-nav">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="item-details">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            
            <div className="detail-row">
              <div className="detail-card">
                <h3>Item Type</h3>
                <p>{item.type}</p>
              </div>
              
              <div className="detail-card">
  <h3>Added On</h3>
  <p>{new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</p>
</div>
            </div>
            
            <button className="enquire-btn" onClick={onEnquire}>
              <FaEnvelope /> Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Email Modal Component
function EmailModal({ itemName, onClose }) {
  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-content" onClick={e => e.stopPropagation()}>
        <span className="close-email" onClick={onClose}>
          &times;
        </span>
        
        <h3>Enquiry Sent</h3>
        <p>
          Your enquiry about <strong>{itemName}</strong> has been sent to our team.
        </p>
        <p>We'll contact you shortly at the provided email address.</p>
        
        <button className="enquire-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default App;