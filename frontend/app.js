let currentUser = localStorage.getItem("currentUser") || "";

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("http://localhost:5000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById("authStatus").innerText = data.message;
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  console.log(data.message);
  if (res.ok) {
    currentUser = username;
    localStorage.setItem("currentUser", username); // <-- store username
    loadProducts(); // display products after login
  }
}

async function loadProducts() {
  const res = await fetch("http://localhost:5000/products");
  const products = await res.json();
  const div = document.getElementById("products");
  div.innerHTML = "";
  products.forEach(p => {
    div.innerHTML += `<div>${p.name} - $${p.price} <button onclick="addToCart(${p.id})">Add to Cart</button></div>`;
  });
}

async function addToCart(productId) {
  if (!currentUser) return alert("Login first");
  await fetch("http://localhost:5000/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser, productId })
  });
  console.log("Added to cart");
}

async function viewCart() {
  if (!currentUser) {
    console.log("Login first");
    return;
  }

  const res = await fetch(`http://localhost:5000/cart/${currentUser}`);
  const cart = await res.json();

  const ul = document.getElementById("cart");
  ul.innerHTML = "";

  cart.forEach(item => {
    ul.innerHTML += `
      <li>
        ${item.name} - $${item.price} × ${item.quantity}
        = $${item.total}
        <button onclick="removeFromCart(${item.productId})">Remove</button>
      </li>
    `;
  });
}

async function checkout() {
  if (!currentUser) return alert("Login first");
  const res = await fetch("http://localhost:5000/orders/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser })
  });
  const data = await res.json();
  document.getElementById("orderStatus").innerText = data.message + " Total: $" + data.total;
  viewCart();
}

async function removeFromCart(productId) {
  const res = await fetch("http://localhost:5000/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: currentUser,
      productId
    })
  });

  const data = await res.json();
  console.log(data.message);
  viewCart();
}
