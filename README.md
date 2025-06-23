# FashionHub - Item Management App

A full-stack application for managing fashion items, allowing users to view, add, and inquire about items. The application supports adding images (cover and additional images) for each item and stores item details like name, type, and description.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express, MongoDB
- **File Upload**: Cloudinary for image storage 
- **Styling**: Tailwind CSS

## Setup the Project

### Prerequisites

Ensure that you have the following tools installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Clone the Repository

```bash
https://github.com/vishal-tiwari-1971/fashionHub
cd fashionhub

```

Backend Setup
Install Backend Dependencies:
Navigate to the server directory and install the required dependencies:

```bash
cd server
npm install
```
Configure Environment Variables:

Create a .env file in the server directory with the following configuration:

.env
PORT=5000
MONGO_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:3000

Run the Backend:
Run the following command to start the server:
```bash
npm start
```
The backend will be available at http://localhost:5000.

Frontend Setup
Install Frontend Dependencies:
Navigate to the client directory and install the required dependencies:

```bash
cd client
npm install
```

Configure Environment Variables:
Create a .env file in the client directory and add the following:

.env
```bash
REACT_APP_API_URL=http://localhost:5000
```

Run the Frontend:
```bash
npm start
```

The frontend will be available at http://localhost:3000.

Access the Application
Once both the frontend and backend are running, open your browser and visit http://localhost:3000 to access the app.

How to Add New Items
Click on "Add Items" in the navigation bar.

Fill out the form with the item name, type, description, and upload cover image and additional images.

Click "Add Item" to submit the new item.

The new item will be added to the database and shown on the "View Items" page.

How to View Item Details
Click on any item in the "View Items" page to open a modal with detailed information.

You can view the item's images, description, and inquire via email.


## CORS Policy
If you encounter a CORS error while trying to make requests from the frontend to the backend, follow the instructions below to configure the backend to accept cross-origin requests:

In the Backend (server.js):
Make sure you configure CORS middleware correctly:
```bash
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'withCredentials'],  
  credentials: true,  
}));
```

## Deployment
# Deploying the Backend on Render
Go to Render and sign up/log in.

Create a new Web Service.
Link your GitHub repository.
Set build and start commands:
Build Command: npm install
Start Command: npm start

Set environment variables like MONGODB_URI, , and Cloudinary API keys.

# Deploying the Frontend on Vercel
Go to Vercel and sign up/log in.
Create a new project by linking your GitHub repository.
Vercel will automatically detect that it’s a React app and deploy it.

Set the REACT_APP_API_URL environment variable to your backend URL .

## API Endpoints
GET /product
Fetch all products.

Response:
```bash
[
  {
    id: "12345",
    name: "Shirt",
    type: "Clothing",
    description: "A cool shirt",
    coverImage: "https://example.com/image.jpg",
    additionalImages: ["https://example.com/image2.jpg"]
  }
]
```

POST /product
Add a new product.
Request Body:
Response:
json
```bash
{
  id: "12345",
  name: "Shirt",
  type: "Clothing",
  description: "A cool shirt",
  coverImage: "https://example.com/image.jpg",
  additionalImages: ["https://example.com/image2.jpg"]
}
```
This `README.md` provides a comprehensive guide for setting up the project, running it locally, and deploying both the frontend and backend.
