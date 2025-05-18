let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCounter = document.getElementById('cartCounter');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');

// Hardcoded product IDs for demo purposes (in a real app, these would come from a backend)
const productIdMap = {
  "Pinky Cream Cherry Milk": "1",
  "Gummy Triple-iced Flavors": "2",
  "Blushing Strawberry Cream": "3",
  "Honey Rose Choco": "4"
};

function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = totalItems;
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.className = 'd-flex justify-content-between align-items-center mb-2';
    cartItem.innerHTML = `
      <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productName) {
  const productId = productIdMap[productName] || `temp_${Date.now()}`; // Fallback ID if not in map
  const existingItem = cart.find(item => item.product_id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product_id: productId,
      name: productName,
      price: 9.00,
      quantity: 1
    });
  }
  updateCartDisplay();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function toggleFavorite(element) {
  element.classList.toggle('favorited');
  element.textContent = element.classList.contains('favorited') ? '💖' : '❤️';
}

document.querySelectorAll('.order-btn').forEach(button => {
  button.addEventListener('click', () => {
    const productName = button.getAttribute('data-product');
    addToCart(productName);
  });
});

updateCartDisplay();