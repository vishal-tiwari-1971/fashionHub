require("dotenv").config()
require("./config/db").connect()
const express = require('express')
const cookieParser=require('cookie-parser')
const app = express()
const cors=require('cors')
const Product = require("./model/product")
// to allow json format data 
app.use(express.json())
// to get data from forms
app.use(express.urlencoded({ extended: true }))
const {PORT}=process.env
app.use(cookieParser())
const multer = require('multer');
const cloudinary = require('./config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });


app.use(cors({
  origin: process.env.FRONTEND_URL
  ,    // Allow this specific origin
  methods: ['GET', 'POST'], // Allowed HTTP methods,
  allowedHeaders: ['Content-Type', 'Authorization', 'withCredentials'],  // Allow these headers
  credentials: true, // Allow cookies to be sent
  
}));
console.log(process.env.FRONTEND_URL);



app.get("/", (req, res) => {
  res.send("<h1>Welcome </h1> ") 
   });

app.get("/product",upload.array('additionalImages', 5), async (req, res) => {
  try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving product entries.");
    }
});



app.post("/product", 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]), 
  async (req, res) => {
    try {
      const { name, type, description } = req.body;
      
      if (!name || !type || !description) {
        return res.status(400).send("All fields are required.");
      }

      // Handle cover image upload
      let coverImageUrl = '';
      if (req.files.coverImage) {
        const coverResult = await cloudinary.uploader.upload(req.files.coverImage[0].path);
        coverImageUrl = coverResult.secure_url;
      }

      // Handle additional images
      const additionalImageUrls = [];
      if (req.files.additionalImages) {
        for (const file of req.files.additionalImages) {
          const result = await cloudinary.uploader.upload(file.path);
          additionalImageUrls.push(result.secure_url);
        }
      }

      const product = await Product.create({
        name,
        type,
        description,
        coverImage: coverImageUrl,
        additionalImages: additionalImageUrls
      });

        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error creating product.");
    }

   });



app.use('/uploads', express.static('uploads'));


app.listen(PORT, ()=> {console.log(`Server is running at ${PORT}`)}
)