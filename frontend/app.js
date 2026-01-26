const API_URL = "http://localhost:3000";  // ← Backend URL

let currentUser = "";
let authToken = "";

// Load user from session on page load
window.onload = function() {
  const savedUser = localStorage.getItem("currentUser");
  const savedToken = localStorage.getItem("authToken");
  if (savedUser && savedToken) {
    currentUser = savedUser;
    authToken = savedToken;
    updateUIForLoggedInUser();
  }
};

function updateUIForLoggedInUser() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("userInfo").style.display = "block";
  document.getElementById("currentUserName").innerText = currentUser;
  loadProducts();
  loadLoyaltyPoints();
  viewCart();
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    document.getElementById("authStatus").innerText = "Please enter username and password";
    document.getElementById("authStatus").style.color = "red";
    return;
  }

  try {
    console.log("Registering user...");
    
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    
    if (res.ok) {
      document.getElementById("authStatus").innerText = data.message + " - You got a blockchain wallet!";
      document.getElementById("authStatus").style.color = "green";
    } else {
      document.getElementById("authStatus").innerText = data.message;
      document.getElementById("authStatus").style.color = "red";
    }
  } catch (error) {
    console.error("Registration error:", error);
    document.getElementById("authStatus").innerText = "Error: Cannot connect to server. Make sure backend is running on port 5000.";
    document.getElementById("authStatus").style.color = "red";
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    document.getElementById("authStatus").innerText = "Please enter username and password";
    document.getElementById("authStatus").style.color = "red";
    return;
  }

  try {
    console.log("Logging in...");
    
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    
    if (res.ok) {
      currentUser = username;
      authToken = data.token;
      localStorage.setItem("currentUser", username);
      localStorage.setItem("authToken", data.token);
      
      document.getElementById("authStatus").innerText = "Login successful!";
      document.getElementById("authStatus").style.color = "green";
      
      updateUIForLoggedInUser();
    } else {
      document.getElementById("authStatus").innerText = data.message;
      document.getElementById("authStatus").style.color = "red";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("authStatus").innerText = "Error: Cannot connect to server. Make sure backend is running on port 5000.";
    document.getElementById("authStatus").style.color = "red";
  }
}

function logout() {
  currentUser = "";
  authToken = "";
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
  
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("products").innerHTML = "";
  document.getElementById("cart").innerHTML = "";
  document.getElementById("loyaltyInfo").innerHTML = "";
  document.getElementById("authStatus").innerText = "Logged out successfully";
  location.reload();
}

async function loadProducts() {
  try {
    console.log("Loading products...");
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    console.log("Products:", data);
    
    const products = data.products || data;
    
    const div = document.getElementById("products");
    div.innerHTML = "";
    
    if (products.length === 0) {
      div.innerHTML = "<p>No products available. Run: npm run seed</p>";
      return;
    }
    
    products.forEach(p => {
      div.innerHTML += `
        <div class="product-card">
          <h3>${p.name}</h3>
          <p>${p.description || ''}</p>
          <p class="price">$${p.price.toFixed(2)}</p>
          <input type="number" id="qty-${p._id}" value="1" min="1" max="10" style="width: 50px;" />
          <button onclick="addToCart('${p._id}')">Add to Cart</button>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("products").innerHTML = "<p>Error loading products. Is backend running?</p>";
  }
}

async function addToCart(productId) {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const quantity = parseInt(document.getElementById(`qty-${productId}`).value) || 1;

  try {
    console.log("Adding to cart:", { username: currentUser, productId, quantity });
    
    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: currentUser, 
        productId,
        quantity 
      })
    });
    
    const data = await res.json();
    console.log("Add to cart response:", data);
    
    if (res.ok) {
      showNotification("Added to cart!", "success");
      viewCart();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    showNotification("Error adding to cart", "error");
  }
}

async function viewCart() {
  if (!currentUser) {
    return;
  }

  try {
    console.log("Viewing cart for:", currentUser);
    const res = await fetch(`${API_URL}/cart/${currentUser}`);
    const data = await res.json();
    console.log("Cart data:", data);

    const ul = document.getElementById("cart");
    ul.innerHTML = "";

    if (!data.items || data.items.length === 0) {
      ul.innerHTML = '<li class="empty-cart">Your cart is empty 🛒</li>';
      document.getElementById("cartTotal").innerText = "";
      document.getElementById("checkoutBtn").disabled = true;
      return;
    }

    document.getElementById("checkoutBtn").disabled = false;

    data.items.forEach(item => {
      ul.innerHTML += `
        <li class="cart-item">
          <span class="item-name">${item.name}</span>
          <span class="item-details">
            $${item.price.toFixed(2)} × ${item.quantity} = $${item.subtotal.toFixed(2)}
          </span>
          <button onclick="removeFromCart('${item.productId}')" class="remove-btn">Remove</button>
        </li>
      `;
    });

    document.getElementById("cartTotal").innerHTML = `
      <strong>Total: $${data.total.toFixed(2)}</strong> 
      <span style="color: green;">(Earn ${Math.floor(data.total * 10)} points!)</span>
    `;
  } catch (error) {
    console.error("Error viewing cart:", error);
  }
}

async function checkout() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const usePoints = document.getElementById("usePointsCheckbox").checked;

  try {
    console.log("Checking out...");
    const res = await fetch(`${API_URL}/orders/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: currentUser,
        usePoints: usePoints
      })
    });
    
    const data = await res.json();
    console.log("Checkout response:", data);
    
    if (res.ok) {
      const message = `
        Order successful! 🎉
        Total: $${data.order.total.toFixed(2)}
        Points Earned: ${data.order.pointsEarned}
        ${data.order.pointsUsed > 0 ? `Points Used: ${data.order.pointsUsed}` : ''}
        New Balance: ${data.order.newPointBalance} points
      `;
      
      document.getElementById("orderStatus").innerText = message;
      document.getElementById("orderStatus").style.color = "green";
      
      viewCart();
      loadLoyaltyPoints();
    } else {
      document.getElementById("orderStatus").innerText = data.message;
      document.getElementById("orderStatus").style.color = "red";
    }
  } catch (error) {
    console.error("Checkout error:", error);
    document.getElementById("orderStatus").innerText = "Checkout failed: " + error.message;
    document.getElementById("orderStatus").style.color = "red";
  }
}

async function removeFromCart(productId) {
  if (!currentUser) return;

  try {
    const res = await fetch(`${API_URL}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: currentUser,
        productId
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      showNotification("Item removed", "success");
      viewCart();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error removing item", "error");
  }
}

async function loadLoyaltyPoints() {
  if (!currentUser) return;

  try {
    const res = await fetch(`${API_URL}/auth/profile/${currentUser}`);
    const data = await res.json();

    if (res.ok) {
      const pointsValue = ((data.loyaltyPoints || 0) * 0.01).toFixed(2);
      document.getElementById("loyaltyInfo").innerHTML = `
        <div class="loyalty-card">
          <h3>💎 Your Loyalty Points</h3>
          <p class="points-balance">${data.loyaltyPoints || 0} points</p>
          <p class="points-value">Worth: $${pointsValue}</p>
          <p class="wallet-address">Wallet: ${data.walletAddress.substring(0, 10)}...${data.walletAddress.substring(38)}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading loyalty points:", error);
  }
}

async function viewOrders() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/orders/user/${currentUser}`);
    const data = await res.json();

    const ordersDiv = document.getElementById("orderHistory");
    
    if (!data.orders || data.orders.length === 0) {
      ordersDiv.innerHTML = '<p>No orders yet. Start shopping! 🛍️</p>';
      return;
    }

    ordersDiv.innerHTML = '<h3>Your Orders</h3>';
    data.orders.forEach(order => {
      ordersDiv.innerHTML += `
        <div class="order-card">
          <p><strong>Order #${order._id.substring(0, 8)}</strong> - ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Total: $${order.total.toFixed(2)}</p>
          <p>Status: ${order.status}</p>
          <p>Points Earned: ${order.pointsEarned || 0}</p>
          ${order.pointsUsed ? `<p>Points Used: ${order.pointsUsed}</p>` : ''}
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

function showNotification(message, type) {
  const notif = document.getElementById("notification");
  notif.innerText = message;
  notif.className = `notification ${type}`;
  notif.style.display = "block";
  
  setTimeout(() => {
    notif.style.display = "none";
  }, 3000);
}