
/* =====================================
   QUICKSERVE
   API CONNECTION
===================================== */

// JSON SERVER API URL

const API_URL = "http://localhost:3000";


// LOCAL STORAGE KEY

const STORAGE_KEY = "quickserve_orders_v1";


// DEMO ORDERS

const seedOrders = [

    {
        id: 1001,
        table: 3,

        items: [
            {
                id: 1,
                name: "Cappuccino",
                price: 140,
                qty: 2
            },

            {
                id: 4,
                name: "Chicken Sandwich",
                price: 220,
                qty: 1
            }
        ],

        status: "Preparing",
        createdAt: Date.now() - 18 * 60000
    },


    {
        id: 1002,
        table: 7,

        items: [
            {
                id: 2,
                name: "Cold Coffee",
                price: 160,
                qty: 1
            },

            {
                id: 6,
                name: "French Fries",
                price: 120,
                qty: 1
            }
        ],

        status: "Pending",
        createdAt: Date.now() - 8 * 60000
    },


    {
        id: 1003,
        table: 2,

        items: [
            {
                id: 3,
                name: "Chocolate Brownie",
                price: 130,
                qty: 2
            }
        ],

        status: "Ready",
        createdAt: Date.now() - 25 * 60000
    },


    {
        id: 1004,
        table: 11,

        items: [
            {
                id: 5,
                name: "Margherita Pizza",
                price: 280,
                qty: 1
            }
        ],

        status: "Delivered",
        createdAt: Date.now() - 55 * 60000
    }

];


// =====================================
// 1. GET ORDERS FROM LOCAL STORAGE
// =====================================

function readLocalOrders() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || seedOrders;

    }

    catch (error) {

        return seedOrders;

    }

}


// =====================================
// 2. SAVE ORDERS IN LOCAL STORAGE
// =====================================

function writeLocalOrders(orders) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orders)
    );

}


// =====================================
// 3. GET ALL ORDERS
// =====================================

async function apiGetOrders() {

    try {

        const response = await fetch(
            `${API_URL}/orders`,
            {
                signal: AbortSignal.timeout(700)
            }
        );

        if (!response.ok) {
            throw new Error("API Error");
        }

        return await response.json();

    }

    catch (error) {

        console.log(
            "JSON Server unavailable. Using Local Storage."
        );

        return readLocalOrders();

    }

}


// =====================================
// 4. SAVE NEW ORDER
// =====================================

async function apiSaveOrder(order) {

    try {

        const response = await fetch(
            `${API_URL}/orders`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(order),

                signal: AbortSignal.timeout(700)

            }
        );

        if (!response.ok) {
            throw new Error("Unable to save order");
        }

        return await response.json();

    }

    catch (error) {

        const allOrders = readLocalOrders();

        allOrders.unshift(order);

        writeLocalOrders(allOrders);

        return order;

    }

}


// =====================================
// 5. UPDATE EXISTING ORDER
// =====================================

async function apiUpdateOrder(updated) {

    try {

        const response = await fetch(
            `${API_URL}/orders/${updated.id}`,
            {

                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updated),

                signal: AbortSignal.timeout(700)

            }
        );

        if (!response.ok) {
            throw new Error("Unable to update order");
        }

        return await response.json();

    }

    catch (error) {

        const allOrders = readLocalOrders().map(
            order => {

                if (
                    String(order.id) ===
                    String(updated.id)
                ) {

                    return updated;

                }

                return order;

            }
        );

        writeLocalOrders(allOrders);

        return updated;

    }

}
