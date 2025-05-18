let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
const cartCounter = document.getElementById('cartCounter');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const productGrid = document.getElementById('productGrid');
const orderHistory = document.getElementById('orderHistory');

// Fetch products from backend
async function loadProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();
    productGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-card-img">
        <h5>${product.name}</h5>
        <p>$${product.price.toFixed(2)}</p>
        <span class="heart-icon" onclick="toggleFavorite(this)">❤️</span>
        <button class="btn btn-primary order-btn" 
                data-product-id="${product.product_id}" 
                data-product="${product.name}" 
                data-price="${product.price}">Add to Cart</button>
      </div>
    `).join('');
    document.querySelectorAll('.order-btn').forEach(button => {
      button.addEventListener('click', addToCart);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    productGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
  }
}

// Toggle favorite heart icon
function toggleFavorite(element) {
  element.textContent = element.textContent === '❤️' ? '🤍' : '❤️';
}

// Add item to cart
function addToCart() {
  const productId = this.getAttribute('data-product-id');
  const productName = this.getAttribute('data-product');
  const price = parseFloat(this.getAttribute('data-price'));
  const existingItem = cart.find(item => item.product_id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product_id: productId, name: productName, price, quantity: 1 });
  }
  cartCount += 1;
  cartCounter.textContent = cartCount;
  updateCart();
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Added ${productName} to your cart!`);
}

// Update cart display
function updateCart() {
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} (x${item.quantity})</span>
      <span>$${(item.quantity * item.price).toFixed(2)} 
        <button class="btn btn-danger btn-sm" onclick="removeItem('${item.product_id}')">Remove</button>
      </span>
    </div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
  cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = cartCount;

  // Update order items display
  const orderItemsContainer = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  orderItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} (x${item.quantity})</span>
      <span>$${(item.quantity * item.price).toFixed(2)} 
        <button class="btn btn-danger btn-sm" onclick="removeItem('${item.product_id}')">Remove</button>
      </span>
    </div>
  `).join('');
  orderTotal.textContent = total.toFixed(2);
}

// Remove item from cart
function removeItem(productId) {
  const item = cart.find(item => item.product_id === productId);
  if (item) {
    cartCount -= item.quantity;
    cart = cart.filter(item => item.product_id !== productId);
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Place order
document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const user_id = 1; // Hardcoded; use Firebase Auth or session in production
  const cart_id = 1; // Hardcoded; fetch from database in production
  const orderData = {
    user_id,
    cart_id,
    items: cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    })),
    total: parseFloat(cartTotal.textContent)
  };
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await response.json();
    if (response.ok) {
      orderHistory.innerHTML = `
        <p><strong>Order #${result.order_id}</strong></p>
        <ul>
          ${cart.map(item => `
            <li>${item.name} (x${item.quantity}) - $${(item.quantity * item.price).toFixed(2)}</li>
          `).join('')}
        </ul>
        <p><strong>Total: $${orderData.total.toFixed(2)}</strong></p>
        <p><em>Placed on ${new Date().toLocaleString()}</em></p>
      `;
      // Clear cart
      cart = [];
      cartCount = 0;
      updateCart();
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Order placed successfully! Order ID: ${result.order_id}`);
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to place order. Please try again.');
    console.error('Error:', error);
  }
});

// Load products and cart on page load
window.onload = () => {
  loadProducts();
  updateCart();
};