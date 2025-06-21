const mongoose =require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true,  },
  type: {type: String,  required: true,   },
  description: {type: String,required: true,  },
  coverImage: { type: String,  default: null, },
  additionalImages: {type: [String], default: [], }
}, { timestamps: true, });               // add createdAt and updatedAt 

const Product = mongoose.model('Product', ProductSchema);

module.exports=Product;