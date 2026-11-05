// Step 6: Orders, Dashboard & Billing

const STATUS_FLOW = ["Pending", "Preparing", "Ready", "Delivered"];

let orderFilter = "All";
let selectedBillId = null;

function orderTotal(order) {
    return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function itemCount(order) {
    return order.items.reduce((sum, i) => sum + i.qty, 0);
}

function timeAgo(timestamp) {

    const minutes = Math.max(
        0,
        Math.round((Date.now() - timestamp) / 60000)
    );

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    return `${hours} hr ${minutes % 60} min ago`;
}

function badge(status) {
    return `<span class="badge ${status.toLowerCase()}">${status}</span>`;
}

// Change status (used by orders page and kitchen page)
async function changeOrderStatus(orderId, newStatus) {

    const order = orders.find(
        o => String(o.id) === String(orderId)
    );

    if (!order) return;

    const updated = { ...order, status: newStatus };

    await apiUpdateOrder(updated);

    if (newStatus === "Delivered") {
        setTableOccupied(order.table, false);
    }

    await refreshOrders();

    showToast(`Order #${order.id} is now ${newStatus}`);
}

// Dashboard cards
function renderStats() {

    const count = status =>
        orders.filter(o => o.status === status).length;

    document.getElementById("statTotal").textContent = orders.length;
    document.getElementById("statPending").textContent = count("Pending");
    document.getElementById("statReady").textContent = count("Ready");
    document.getElementById("statCompleted").textContent = count("Delivered");
}

// Dashboard recent orders table
function renderRecentOrders() {

    const recent = [...orders]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    document.getElementById("recentOrders").innerHTML =

        recent.length

            ? recent.map(o => `
                <tr>
                    <td><b>#${o.id}</b></td>
                    <td>Table ${o.table}</td>
                    <td>${itemCount(o)}</td>
                    <td>${formatMoney(orderTotal(o))}</td>
                    <td>${badge(o.status)}</td>
                </tr>
            `).join("")

            : `<tr><td colspan="5" class="mini-note">No orders yet</td></tr>`;
}

// Active orders page
function renderOrders() {

    const list = [...orders]
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter(o => orderFilter === "All" || o.status === orderFilter);

    document.getElementById("ordersGrid").innerHTML =

        list.length

            ? list.map(o => `
                <article class="order-card">

                    <div class="order-card-top">
                        <div>
                            <h3>Order #${o.id}</h3>
                            <p>Table ${o.table} · ${timeAgo(o.createdAt)}</p>
                        </div>
                        ${badge(o.status)}
                    </div>

                    <div class="order-items-list">
                        ${o.items.map(i => `
                            <div class="order-line">
                                <span>${i.qty} × ${i.name}</span>
                                <span>${formatMoney(i.price * i.qty)}</span>
                            </div>
                        `).join("")}
                    </div>

                    <div class="order-card-bottom">

                        <strong>${formatMoney(orderTotal(o))}</strong>

                        <select class="small-select" data-order-status="${o.id}">
                            ${STATUS_FLOW.map(s => `
                                <option value="${s}" ${s === o.status ? "selected" : ""}>
                                    ${s}
                                </option>
                            `).join("")}
                        </select>

                    </div>

                </article>
            `).join("")

            : `<div class="empty-state">No orders in this view.</div>`;
}

// Billing: list of orders on the left
function renderBillingList() {

    const list = [...orders].sort((a, b) => b.createdAt - a.createdAt);

    document.getElementById("billingOrders").innerHTML =

        list.length

            ? list.map(o => `
                <button
                    class="bill-order ${String(o.id) === String(selectedBillId) ? "selected" : ""}"
                    data-bill="${o.id}">
                    <b>Order #${o.id} · Table ${o.table}</b>
                    <small>${itemCount(o)} items · ${formatMoney(orderTotal(o))} · ${o.status}</small>
                </button>
            `).join("")

            : `<div class="mini-note">No orders yet</div>`;

    renderReceipt();
}

// Billing: receipt on the right
function renderReceipt() {

    const wrap = document.getElementById("receiptWrap");

    const order = orders.find(
        o => String(o.id) === String(selectedBillId)
    );

    if (!order) {
        wrap.innerHTML = `
            <div class="empty-state">
                Select an order to view its receipt.
            </div>`;
        return;
    }

    const date = new Date(order.createdAt);

    wrap.innerHTML = `
        <div class="receipt">

            <div class="receipt-brand">
                <h2>QuickServe</h2>
                <p>Cafe Management System</p>
            </div>

            <div class="receipt-meta">
                <span>Order #${order.id} · Table ${order.table}</span>
                <span>${date.toLocaleDateString("en-IN")} ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td>${i.name}</td>
                            <td>${i.qty}</td>
                            <td>${formatMoney(i.price)}</td>
                            <td>${formatMoney(i.price * i.qty)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <div class="receipt-total">
                <div><span>Subtotal</span><span>${formatMoney(orderTotal(order))}</span></div>
                <div><span>Tax & Service</span><span>${formatMoney(0)}</span></div>
                <div class="total"><span>Total</span><span>${formatMoney(orderTotal(order))}</span></div>
            </div>

            <p class="receipt-note">Thank you for visiting QuickServe ☕</p>

            <button class="print-button" id="printReceiptBtn">
                🖨 Print Receipt
            </button>

        </div>
    `;
}
