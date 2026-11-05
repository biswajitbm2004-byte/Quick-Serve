// Step 7: Kitchen Display

const KITCHEN_NEXT = {
    Pending: { next: "Preparing", label: "Start Preparing" },
    Preparing: { next: "Ready", label: "Mark Ready" },
    Ready: { next: "Delivered", label: "Mark Delivered" }
};

function kitchenCard(order) {

    const action = KITCHEN_NEXT[order.status];

    return `
        <div class="kitchen-card">

            <div class="kitchen-card-head">
                <span>Order #${order.id}</span>
                <span>Table ${order.table}</span>
            </div>

            <div class="kitchen-card-time">${timeAgo(order.createdAt)}</div>

            <ul>
                ${order.items.map(i => `<li>${i.qty} × ${i.name}</li>`).join("")}
            </ul>

            <button data-kitchen="${order.id}" data-next="${action.next}">
                ${action.label}
            </button>

        </div>
    `;
}

function renderKitchen() {

    const columns = [
        { status: "Pending", list: "kPending", count: "kPendingCount" },
        { status: "Preparing", list: "kPreparing", count: "kPreparingCount" },
        { status: "Ready", list: "kReady", count: "kReadyCount" }
    ];

    columns.forEach(col => {

        const items = orders
            .filter(o => o.status === col.status)
            .sort((a, b) => a.createdAt - b.createdAt);

        document.getElementById(col.count).textContent = items.length;

        document.getElementById(col.list).innerHTML =
            items.length
                ? items.map(kitchenCard).join("")
                : `<div class="mini-note">No orders</div>`;
    });
}
