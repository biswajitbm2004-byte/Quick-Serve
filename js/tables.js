// Step 8: Table Management

const TABLE_KEY = "quickserve_tables_v1";
const TOTAL_TABLES = 15;

function readTables() {

    try {
        const saved = JSON.parse(localStorage.getItem(TABLE_KEY));
        if (saved) return saved;
    } catch (error) {
        // ignore and use default
    }

    // Default: tables with demo active orders are occupied
    return { 2: true, 3: true, 7: true };
}

let tableState = readTables();

function saveTables() {
    try {
        localStorage.setItem(TABLE_KEY, JSON.stringify(tableState));
    } catch (error) {
        // ignore
    }
}

function isOccupied(number) {
    return Boolean(tableState[number]);
}

function setTableOccupied(number, occupied) {
    tableState[number] = occupied;
    saveTables();
}

// Dropdown on the ordering page
function refreshTableSelect() {

    const select = document.getElementById("tableSelect");

    const previous = select.value;

    let options = "";

    for (let n = 1; n <= TOTAL_TABLES; n++) {
        options += `
            <option value="${n}">
                Table ${n}${isOccupied(n) ? " (Occupied)" : ""}
            </option>`;
    }

    select.innerHTML = options;

    if (previous) {
        select.value = previous;
    } else {
        // pick first available table by default
        for (let n = 1; n <= TOTAL_TABLES; n++) {
            if (!isOccupied(n)) {
                select.value = n;
                break;
            }
        }
    }
}

// Small boxes on the dashboard
function renderMiniTables() {

    let html = "";

    for (let n = 1; n <= TOTAL_TABLES; n++) {
        html += `
            <div class="mini-table ${isOccupied(n) ? "occupied" : "available"}">
                ${n}
            </div>`;
    }

    document.getElementById("miniTables").innerHTML = html;
}

// Full table management page
function renderTableManagement() {

    let html = "";

    for (let n = 1; n <= TOTAL_TABLES; n++) {

        const occupied = isOccupied(n);

        html += `
            <div class="table-card ${occupied ? "occupied" : "available"}">

                <div class="table-icon">▥</div>

                <b>Table ${n}</b>

                <small>${occupied ? "Occupied" : "Available"}</small>

                <button data-table="${n}">
                    ${occupied ? "Mark Available" : "Mark Occupied"}
                </button>

            </div>`;
    }

    document.getElementById("tableManagementGrid").innerHTML = html;
}

function toggleTable(number) {

    setTableOccupied(number, !isOccupied(number));

    renderMiniTables();
    renderTableManagement();
    refreshTableSelect();

    showToast(
        `Table ${number} marked ${isOccupied(number) ? "occupied" : "available"}`
    );
}
