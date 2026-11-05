// Step 9: App Start (navigation + events)

let orders = [];

const PAGE_TITLES = {
    dashboard: "Dashboard",
    menu: "Menu & Ordering",
    orders: "Active Orders",
    kitchen: "Kitchen Display",
    tables: "Table Management",
    billing: "Billing & Receipt"
};

// Toast message
let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

// Switch page
function goTo(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.toggle("active", p.id === `page-${page}`);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.page === page);
    });

    document.getElementById("pageTitle").textContent = PAGE_TITLES[page];

    document.getElementById("sidebar").classList.remove("open");

    window.scrollTo({ top: 0 });
}

// Load orders and redraw everything
async function refreshOrders() {

    orders = await apiGetOrders();

    renderAll();
}

function renderAll() {

    renderStats();
    renderRecentOrders();
    renderMiniTables();
    renderOrders();
    renderKitchen();
    renderTableManagement();
    renderBillingList();
    refreshTableSelect();
}

function setupEvents() {

    // Sidebar navigation
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => goTo(link.dataset.page));
    });

    // Buttons with data-go (quick actions, view all...)
    document.addEventListener("click", event => {

        const goButton = event.target.closest("[data-go]");

        if (goButton) goTo(goButton.dataset.go);
    });

    // Mobile menu
    document.getElementById("mobileMenu").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
    });

    // Menu: category tabs
    document.getElementById("categoryTabs").addEventListener("click", event => {

        const tab = event.target.closest("[data-category]");

        if (!tab) return;

        activeCategory = tab.dataset.category;

        renderCategories();
        renderMenu();
    });

    // Menu: search
    document.getElementById("menuSearch").addEventListener("input", renderMenu);

    // Menu: add to cart
    document.getElementById("menuGrid").addEventListener("click", event => {

        const button = event.target.closest("[data-add]");

        if (button) addToCart(Number(button.dataset.add));
    });

    // Cart: quantity buttons
    document.getElementById("cartItems").addEventListener("click", event => {

        const button = event.target.closest("[data-qty]");

        if (button) {
            changeQty(Number(button.dataset.id), Number(button.dataset.qty));
        }
    });

    // Cart: place order
    document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

    // Orders: filter chips
    document.querySelectorAll("[data-order-filter]").forEach(chip => {

        chip.addEventListener("click", () => {

            orderFilter = chip.dataset.orderFilter;

            document.querySelectorAll("[data-order-filter]").forEach(c => {
                c.classList.toggle("selected", c === chip);
            });

            renderOrders();
        });
    });

    // Orders: status dropdown
    document.getElementById("ordersGrid").addEventListener("change", event => {

        const select = event.target.closest("[data-order-status]");

        if (select) {
            changeOrderStatus(select.dataset.orderStatus, select.value);
        }
    });

    // Kitchen: action buttons
    document.getElementById("page-kitchen").addEventListener("click", event => {

        const button = event.target.closest("[data-kitchen]");

        if (button) {
            changeOrderStatus(button.dataset.kitchen, button.dataset.next);
        }
    });

    // Tables: toggle
    document.getElementById("tableManagementGrid").addEventListener("click", event => {

        const button = event.target.closest("[data-table]");

        if (button) toggleTable(Number(button.dataset.table));
    });

    // Billing: choose order
    document.getElementById("billingOrders").addEventListener("click", event => {

        const button = event.target.closest("[data-bill]");

        if (!button) return;

        selectedBillId = button.dataset.bill;

        renderBillingList();
    });

    // Billing: print
    document.getElementById("receiptWrap").addEventListener("click", event => {

        if (event.target.closest("#printReceiptBtn")) window.print();
    });
}

// Start the app
async function init() {

    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    renderCategories();
    renderMenu();
    renderCart();
    setupEvents();

    await refreshOrders();

    // Keep "x min ago" fresh
    setInterval(() => {
        renderOrders();
        renderKitchen();
    }, 60000);
}

document.addEventListener("DOMContentLoaded", init);
