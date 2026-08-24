# Nostra — Fashion E-Commerce Platform

Nostra is a modern fashion e-commerce web application designed to provide users with a smooth online shopping experience. The platform allows users to browse fashion products, view product details, manage their cart, and interact with a recycling/rewards module through the ReWear feature.

## 🚀 Features

### 🛍️ E-Commerce
- Browse fashion products
- Product listing and product details
- Add products to cart
- Update product quantities
- Remove products from cart
- Dynamic cart management
- Responsive user interface

### ♻️ ReWear
ReWear is a sustainability-focused module that allows users to submit clothing items for recycling.

- Upload clothing items for recycling
- Earn coins for eligible recycled items
- Track earned coins
- Coin-based reward mechanism
- Encourages sustainable fashion practices

### 👤 User Experience
- User-friendly navigation
- Responsive design
- Interactive product interface
- Smooth shopping workflow

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- React.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Tools & Services
- Git
- GitHub
- Cloudinary
- Figma

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ Products            │
                    │ Product Details     │
                    │ Cart                │
                    │ ReWear              │
                    └──────────┬──────────┘
                               │
                         API Requests
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js +         │
                    │   Express Backend   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │                     │
                    │ Users               │
                    │ Products            │
                    │ Cart                │
                    │ ReWear Data         │
                    └─────────────────────┘
