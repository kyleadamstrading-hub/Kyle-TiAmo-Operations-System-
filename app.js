// ========================================
// SPA OPERATIONS MANAGER
// app.js
// ========================================

// ---------- Global Variables ----------

let completedTasks = 0;
let totalTasks = 0;

document.addEventListener("DOMContentLoaded", function () {

    initialiseApp();

});

// ---------- Initialise ----------

function initialiseApp() {

    displayCurrentDate();

    setupNavigation();

    updateProgress(0);

    loadNotes();

    console.log("Spa Operations Manager Loaded");

}

// ---------- Display Current Date ----------

function displayCurrentDate() {

    const dateElement = document.getElementById("todayDate");

    if (!dateElement) return;

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    dateElement.textContent = today.toLocaleDateString("en-ZA", options);

}

// ---------- Sidebar Navigation ----------

function setupNavigation() {

    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const page = this.dataset.page;

            showPage(page);

        });

    });

}

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active-page");

    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }

    document.querySelectorAll(".nav-btn").forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === pageName) {

            button.classList.add("active");

        }

    });

}

// Make function available to HTML buttons

window.showPage = showPage;


// ========================================
// PROGRESS BAR
// ========================================

function updateProgress(percent) {

    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");

    if (!bar || !text) return;

    percent = Math.max(0, Math.min(percent, 100));

    bar.style.width = percent + "%";
    text.innerHTML = percent + "% Complete";

}

// ========================================
// LOCAL STORAGE
// ========================================

function saveData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

function loadData(key) {

    const value = localStorage.getItem(key);

    if (!value) return null;

    return JSON.parse(value);

}

// ========================================
// NOTES
// ========================================

function loadNotes() {

    const notesBox = document.querySelector("textarea");

    if (!notesBox) return;

    const savedNotes = loadData("spaNotes");

    if (savedNotes) {

        notesBox.value = savedNotes;

    }

    notesBox.addEventListener("keyup", function () {

        saveData("spaNotes", notesBox.value);

    });

}

// ========================================
// SIMPLE ALERT
// ========================================

function showMessage(message) {

    alert(message);

}



// ========================================



// ========================================
// DASHBOARD STATISTICS
// ========================================

document.addEventListener("DOMContentLoaded",function(){

    setTimeout(createDashboardStats,500);

});

function createDashboardStats(){

    const dashboard=document.getElementById("dashboard");

    if(!dashboard) return;

    const stats=document.createElement("div");

    stats.className="section-card";

    stats.id="dashboardStats";

    stats.innerHTML=`

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

function updateDashboardStats(){

    const morning=document.querySelectorAll(".dailyTask").length;

    const extra=extraTasks.length;

    const total=morning+extra;

    if(document.getElementById("morningCount")){

        document.getElementById("morningCount").innerHTML=10;

        document.getElementById("afternoonCount").innerHTML=5;

        document.getElementById("extraCount").innerHTML=extra;

        document.getElementById("totalCount").innerHTML=total;

    }

}
