# Renart Case - Ring E-commerce Application

An e-commerce application developed for ring sales. Backend built with Express.js, frontend with React.

## 🚀 Live Demo

- **Frontend:** [https://vocal-phoenix-662b37.netlify.app](https://vocal-phoenix-662b37.netlify.app)
- **Backend API:** [https://renart-case-backend-s028.onrender.com/products](https://renart-case-backend-s028.onrender.com/products)

## 📁 Project Structure

```
Renart-Case/
├── backend/           # Express.js backend server
│   ├── index.js       # Main server file
│   ├── products.json  # Product data
│   ├── package.json   # Backend dependencies
│   └── node_modules/  # Backend packages
├── frontend/          # React frontend application
│   ├── src/           # React source files
│   ├── public/        # Static files
│   ├── package.json   # Frontend dependencies
│   └── node_modules/  # Frontend packages
├── package.json       # Root level scripts
└── README.md          # This file
```

## 🚀 Installation and Running

### Install All Dependencies

```bash
npm run install:all
```

### Run in Development Mode (Backend + Frontend)

```bash
npm run dev
```

### Run Backend Only

```bash
npm run backend:dev
```

### Run Frontend Only

```bash
npm run frontend:dev
```

## 🔧 Features

### Backend (Port 5000)

- Express.js server
- CORS support
- Gold price API integration (GoldAPI)
- Product list endpoint (`/products`)
- Dynamic price calculation

### Frontend (Port 3000)

- React application
- API calls with Axios
- Responsive design
- Product list display
- Ring images with color variants

## 📡 API Endpoints

### GET /products

Returns a list of all rings. Each product includes:

- Name
- Popularity score (0-1)
- Weight (grams)
- Calculated price (USD)
- Popularity rating (0-5)
- Images (yellow, pink, white gold)

## 🛠 Technologies

### Backend

- Node.js
- Express.js
- Axios
- CORS

### Frontend

- React 19
- Axios
- React Slick (carousel)
- CSS3

### Development Tools

- Nodemon (backend hot reload)
- Concurrently (parallel execution)

## 📝 Notes

- Backend fetches gold prices from GoldAPI
- Price calculation formula: `(popularityScore + 1) * weight * goldPrice`
- Frontend automatically connects to backend (localhost:5000)

### Quick Summary

1. **Backend (Render):**

   - Create a new Web Service on Render.com
   - Connect repository, select `backend` folder as root
   - Deploy and note the URL

2. **Frontend (Netlify):**
   - Update backend URL in `frontend/.env.production`
   - Create a new project on Netlify.com
   - Connect repository, select `frontend` folder as root
   - Add environment variable: `REACT_APP_API_URL=<backend-url>`
   - Deploy

## 📄 License

This project was developed as a case study for Renart.
