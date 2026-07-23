// ========================================
// DASHBOARD MODULE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    initialiseDashboard();

    createDashboardStats();

});

function initialiseDashboard() {

    buildDashboard();

    refreshDashboard();

}

// ========================================
// BUILD DASHBOARD
// ========================================

function buildDashboard() {

    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    dashboard.innerHTML = `

        <div class="dashboard-header">

            <h1>Operations Dashboard</h1>

            <p id="dashboardDate"></p>

            <p id="dashboardLastUpdated"></p>

        </div>

        <div class="dashboard-grid">

            <div class="dashboard-card">

                <h3>Today's Progress</h3>

                <div class="dashboard-progress">

                    <div id="dashboardProgressBar"></div>

                </div>

                <h2 id="dashboardProgressText">0%</h2>

            </div>

            <div class="dashboard-card">

                <h3>Daily Checklist</h3>

                <h2 id="dashboardChecklist">0 / 0</h2>

            </div>

            <div class="dashboard-card">

                <h3>Rooms Inspected</h3>

                <h2 id="dashboardRooms">0</h2>

            </div>

            <div class="dashboard-card">

                <h3>Consumables Low</h3>

                <h2 id="dashboardConsumables">0</h2>

            </div>

            <div class="dashboard-card">

                <h3>Reports Generated</h3>

                <h2 id="dashboardReports">0</h2>

            </div>

            <div class="dashboard-card">

                <h3>Staff On Duty</h3>

                <h2 id="dashboardStaff">0</h2>

            </div>

            <div class="dashboard-card">

                <h3>System Status</h3>

                <h2 id="systemStatus">🟢 Operational</h2>

            </div>

            <div class="dashboard-card">

                <h3>Quick Alerts</h3>

                <div id="dashboardAlerts">

                    <p>No alerts.</p>

                </div>

            </div>

        </div>

    `;

}
// ========================================
// REFRESH DASHBOARD
// ========================================

function refreshDashboard() {

    updateDashboardDate();

    updateDashboardTimestamp();

    updateDashboardProgress();

    updateDashboardRooms();

    updateDashboardReports();

    updateDashboardAlerts();

    updateSystemStatus();

}
// ========================================
// DATE
// ========================================

function updateDashboardDate() {

    const date = document.getElementById("dashboardDate");

    if (!date) return;

    const today = new Date();

    date.innerHTML = today.toLocaleDateString(
        "en-ZA",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}
// ========================================
// PROGRESS
// ========================================

function updateDashboardProgress() {

    const checklist = loadData("dailyChecklist") || [];

    const completed = checklist.filter(item => item).length;

    const total = checklist.length;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const bar = document.getElementById("dashboardProgressBar");

    const text = document.getElementById("dashboardProgressText");

    const stats = document.getElementById("dashboardChecklist");

    if(bar){

        bar.style.width = percent + "%";

    }

    if(text){

        text.innerHTML = percent + "%";

    }

    if(stats){

        stats.innerHTML = completed + " / " + total;

    }

}
// ========================================
// ROOMS INSPECTED
// ========================================

function updateDashboardRooms(){

    const inspections = loadData("roomInspections") || [];

    const today = new Date().toLocaleDateString();

    const todaysRooms = inspections.filter(function(item){

        return item.date === today;

    });

    const element = document.getElementById("dashboardRooms");

    if(element){

        element.innerHTML = todaysRooms.length;

    }

}
// ========================================
// REPORTS GENERATED
// ========================================

function updateDashboardReports(){

    const reports = loadData("savedReports") || [];

    const element = document.getElementById("dashboardReports");

    if(element){

        element.innerHTML = reports.length;

    }

}

  // ========================================
// QUICK ALERTS
// ========================================

function updateDashboardAlerts() {

    let alerts = [];

    // Daily Checklist
    const checklist = loadData("dailyChecklist") || [];

    if (checklist.length === 0) {

        alerts.push("Daily checklist has not been started.");

    }

    // Room Inspections
    const inspections = loadData("roomInspections") || [];

    const today = new Date().toLocaleDateString();

    const todaysInspections = inspections.filter(item => item.date === today);

    if (todaysInspections.length === 0) {

        alerts.push("No room inspections completed today.");

    }

    // Reports
    const reports = loadData("savedReports") || [];

    if (reports.length === 0) {

        alerts.push("No reports have been generated.");

    }

    const alertBox = document.getElementById("dashboardAlerts");

    if (!alertBox) return;

    if (alerts.length === 0) {

        alertBox.innerHTML = `
            <p style="color:green;">
                ✔ Everything is running smoothly.
            </p>
        `;

        return;

    }

    alertBox.innerHTML = "";

        alerts.forEach(alert => {

        const p = document.createElement("p");

        p.innerHTML = "⚠ " + alert;

        alertBox.appendChild(p);

    });

}
// ========================================
// AUTO REFRESH
// ========================================

setInterval(function () {

    refreshDashboard();

}, 5000);
// ========================================
// LAST UPDATED
// ========================================

function updateDashboardTimestamp() {

    const element = document.getElementById("dashboardLastUpdated");

    if (!element) return;

    const now = new Date();

    element.innerHTML =
        "Last Updated: " +
        now.toLocaleTimeString("en-ZA");

}
// ========================================
// SYSTEM STATUS
// ========================================

function updateSystemStatus() {

    const status = document.getElementById("systemStatus");

    if (!status) return;

    const checklist = loadData("dailyChecklist") || [];
    const inspections = loadData("roomInspections") || [];

    if (checklist.length === 0) {

        status.innerHTML = "🟡 Awaiting Daily Checklist";

        return;

    }

    if (inspections.length === 0) {

        status.innerHTML = "🟠 Awaiting Inspections";

        return;

    }

    status.innerHTML = "🟢 Operational";

}
// ========================================
// DASHBOARD STATISTICS
// ========================================

function createDashboardStats() {

    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    // Prevent duplicates
    if (document.getElementById("dashboardStats")) return;

    const stats = document.createElement("div");

    stats.className = "section-card";

    stats.id = "dashboardStats";

    stats.innerHTML = `

        <h2>Today's Summary</h2>

        <br>

        <div id="taskStats">

            <p><strong>Morning Tasks:</strong> <span id="morningCount">0</span></p>

            <p><strong>Afternoon Tasks:</strong> <span id="afternoonCount">0</span></p>

            <p><strong>Additional Tasks:</strong> <span id="extraCount">0</span></p>

            <p><strong>Total Tasks:</strong> <span id="totalCount">0</span></p>

        </div>

    `;

    dashboard.prepend(stats);

    updateDashboardStats();

}
// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboardStats() {

    const morningCount = document.getElementById("morningCount");
    const afternoonCount = document.getElementById("afternoonCount");
    const extraCount = document.getElementById("extraCount");
    const totalCount = document.getElementById("totalCount");

    if (!morningCount || !afternoonCount || !extraCount || !totalCount) return;

    const morning = document.querySelectorAll(".dailyTask").length;

    const extra = extraTasks.length;

    const total = morning + extra;

    morningCount.innerHTML = 10;

    afternoonCount.innerHTML = 5;

    extraCount.innerHTML = extra;

    totalCount.innerHTML = total;

}
