// Step 5: Cart & Place Order

let cart = [];

function formatMoney(value) {
    return "₹" + Number(value).toFixed(2);
}

function addToCart(itemId) {

    const item = menuItems.find(m => m.id === itemId);

    if (!item) return;

    const existing = cart.find(c => c.id === itemId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: 1
        });
    }

    renderCart();
    showToast(`${item.name} added to order`);
}

function changeQty(itemId, change) {

    const line = cart.find(c => c.id === itemId);

    if (!line) return;

    line.qty += change;

    if (line.qty <= 0) {
        cart = cart.filter(c => c.id !== itemId);
    }

    renderCart();
}

function getCartTotal() {
    return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function renderCart() {

    const itemCount = cart.reduce((sum, c) => sum + c.qty, 0);

    document.getElementById("cartCount").textContent =
        itemCount + (itemCount === 1 ? " item" : " items");

    document.getElementById("cartItems").innerHTML =

        cart.length

            ? cart.map(c => `
                <div class="cart-item">

                    <div>
                        <b>${c.name}</b>
                        <small>${formatMoney(c.price)} each</small>
                    </div>

                    <div class="qty-control">
                        <button data-qty="-1" data-id="${c.id}">−</button>
                        <span>${c.qty}</span>
                        <button data-qty="1" data-id="${c.id}">+</button>
                    </div>

                </div>
            `).join("")

            : `<div class="empty-state">
                Your cart is empty.
                <br>
                Choose items from the menu.
              </div>`;

    const total = formatMoney(getCartTotal());

    document.getElementById("cartSubtotal").textContent = total;
    document.getElementById("cartTotal").textContent = total;
}

async function placeOrder() {

    if (!cart.length) {
        showToast("Add some items first");
        return;
    }

    const tableNumber = Number(
        document.getElementById("tableSelect").value
    );

    const lastId = orders.reduce(
        (max, o) => Math.max(max, Number(o.id) || 0),
        1000
    );

    const newOrder = {
        id: lastId + 1,
        table: tableNumber,
        items: cart.map(c => ({ ...c })),
        status: "Pending",
        createdAt: Date.now()
    };

    await apiSaveOrder(newOrder);

    setTableOccupied(tableNumber, true);

    cart = [];
    renderCart();

    await refreshOrders();

    showToast(`Order #${newOrder.id} placed for Table ${tableNumber}`);
}
