// Step 4: Menu Management

const menuItems = [
    {
        id: 1,
        name: "Cappuccino",
        category: "Coffee",
        price: 140,
        emoji: "☕",
        description: "Espresso with steamed milk"
    },
    {
        id: 2,
        name: "Cold Coffee",
        category: "Coffee",
        price: 160,
        emoji: "🧋",
        description: "Chilled creamy coffee"
    },
    {
        id: 3,
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 130,
        emoji: "🍫",
        description: "Rich chocolate brownie"
    },
    {
        id: 4,
        name: "Chicken Sandwich",
        category: "Snacks",
        price: 220,
        emoji: "🥪",
        description: "Grilled chicken sandwich"
    },
    {
        id: 5,
        name: "Margherita Pizza",
        category: "Main Course",
        price: 280,
        emoji: "🍕",
        description: "Classic cheese pizza"
    },
    {
        id: 6,
        name: "French Fries",
        category: "Snacks",
        price: 120,
        emoji: "🍟",
        description: "Crispy golden fries"
    },
    {
        id: 7,
        name: "Fresh Lime Soda",
        category: "Beverages",
        price: 90,
        emoji: "🍋",
        description: "Refreshing lime soda"
    },
    {
        id: 8,
        name: "Chocolate Shake",
        category: "Beverages",
        price: 180,
        emoji: "🥤",
        description: "Thick chocolate milkshake"
    },
    {
        id: 9,
        name: "Pancake Stack",
        category: "Desserts",
        price: 190,
        emoji: "🥞",
        description: "Fluffy pancakes with syrup"
    }
];

let activeCategory = "All";

// Show menu categories
function renderCategories() {

    const categories = [
        "All",
        ...new Set(menuItems.map(item => item.category))
    ];

    document.getElementById("categoryTabs").innerHTML =
        categories.map(category => `
            <button
                class="category-tab ${
                    category === activeCategory ? "active" : ""
                }"
                data-category="${category}">
                ${category}
            </button>
        `).join("");
}

// Show menu items
function renderMenu() {

    const searchInput =
        document.getElementById("menuSearch");

    const searchText =
        (searchInput.value || "").toLowerCase();

    const filteredItems = menuItems.filter(item => {

        const categoryMatch =
            activeCategory === "All" ||
            item.category === activeCategory;

        const searchMatch =
            item.name.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    document.getElementById("menuGrid").innerHTML =

        filteredItems.length

            ? filteredItems.map(item => `
                <article class="menu-card">

                    <div class="food-visual">
                        ${item.emoji}
                    </div>

                    <div class="menu-card-body">

                        <h4>${item.name}</h4>

                        <p>${item.description}</p>

                        <div class="menu-card-bottom">

                            <span class="price">
                                ₹${item.price}
                            </span>

                            <button
                                class="add-button"
                                data-add="${item.id}">
                                ＋ Add
                            </button>

                        </div>

                    </div>

                </article>
            `).join("")

            : `<div class="empty-state">
                No menu items found.
              </div>`;
}
