# Beverage E-Commerce Backend with Blockchain Loyalty Points

A Node.js/Express backend for a beverage e-commerce platform featuring blockchain-based loyalty points system.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **Products**: CRUD operations for beverage products
- **Shopping Cart**: Add, update, remove items
- **Orders**: Checkout system with order history
- **Blockchain Loyalty Points**: 
  - Each user gets a blockchain wallet on registration
  - Earn 10% of order total as loyalty points
  - Redeem points for discounts (1 point = $0.01)
  - Transfer points between users
  - View transaction history

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Create data files** (if not exists):
```bash
# These should already exist in your data folder:
# - users.json
# - products.json
# - carts.json
# - orders.json (create this one)
```

3. **Start the server**:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Project Structure

```
backend/
├── data/
│   ├── db.js              # Database handler
│   ├── users.json         # User data
│   ├── products.json      # Products data
│   ├── carts.json         # Shopping carts
│   └── orders.json        # Orders history
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.js            # Authentication endpoints
│   ├── products.js        # Product endpoints
│   ├── cart.js            # Cart endpoints
│   ├── orders.js          # Order endpoints
│   └── blockchain.js      # Blockchain/loyalty endpoints
├── server.js              # Main server file
└── package.json
```

## How to Start
- In Terminal A, enter the backend folder and type,
```
ganache
```
- In Terminal B, enter the backend folder and type,
```
npm run dev
```
- I believe you already have the Go Live Extension to run the index.html file

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user (creates wallet automatically)
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile/:username` - Get user profile

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Add new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Cart
- `GET /cart/:username` - View cart with totals
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update item quantity
- `POST /cart/remove` - Remove item from cart
- `DELETE /cart/clear/:username` - Clear entire cart

### Orders
- `POST /orders/checkout` - Checkout and create order
- `GET /orders` - Get all orders (admin)
- `GET /orders/user/:username` - Get user's orders
- `GET /orders/:orderId` - Get specific order
- `PUT /orders/:orderId/status` - Update order status

### Blockchain/Loyalty
- `GET /blockchain/loyalty/:username` - Get loyalty points balance
- `GET /blockchain/transactions/:username` - Get points transaction history
- `POST /blockchain/transfer` - Transfer points between users
- `GET /blockchain/wallet/:username` - Get wallet information

## 📝 API Usage Examples

### Register a User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

Response includes wallet address!

### Add to Cart
```bash
curl -X POST http://localhost:5000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "productId": 1,
    "quantity": 2
  }'
```

### Checkout (Earn Points!)
```bash
curl -X POST http://localhost:5000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "usePoints": false
  }'
```

### Checkout with Points Redemption
```bash
curl -X POST http://localhost:5000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "usePoints": true
  }'
```

### Check Loyalty Points
```bash
curl http://localhost:5000/blockchain/loyalty/john
```

## 🎯 How Loyalty Points Work

1. **Earning Points**: 
   - When you complete an order, you earn 10% of the order total as points
   - Example: $50 order = 500 points

2. **Point Value**:
   - 1 point = $0.01
   - 500 points = $5.00 discount

3. **Using Points**:
   - During checkout, set `usePoints: true`
   - Your available points will be converted to discount
   - You still earn points on the discounted total

4. **Blockchain Integration**:
   - Each user gets a unique Ethereum wallet address
   - Currently points are stored in database
   - Ready for smart contract integration on Polygon/Ethereum

## 🔮 Next Steps for Full Blockchain Integration

To make this a true blockchain application:

1. **Deploy Smart Contract** (ERC-20 token for loyalty points)
2. **Connect to Testnet** (Polygon Mumbai or Ethereum Sepolia)
3. **Implement Token Minting** (mint tokens when orders complete)
4. **Token Redemption** (burn tokens when used for discounts)
5. **On-chain Verification** (verify all transactions on blockchain)

## 🔐 Security Notes

⚠️ **IMPORTANT**: This is a development version!

- JWT secret should be stored in environment variables
- User private keys should be encrypted (not stored in plain text)
- Add rate limiting for API endpoints
- Implement proper authentication middleware on protected routes
- Use HTTPS in production
- Never expose private keys in responses

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC