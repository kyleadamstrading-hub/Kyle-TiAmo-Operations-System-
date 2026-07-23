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

    setupInspectionButton();

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
// CALCULATE PROGRESS
// ========================================

function calculateChecklistProgress() {

    const checkboxes = document.querySelectorAll(".dailyTask");

    let completed = 0;

    checkboxes.forEach(box => {

        if (box.checked) {

            completed++;

        }

    });

    const total = checkboxes.length;

    let percent = 0;

    if (total > 0) {

        percent = Math.round((completed / total) * 100);

    }

    updateProgress(percent);

}

// ========================================
// START CHECKLIST
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {

        initialiseChecklist();

    }, 100);

});
// ========================================
// EXTRA TASKS
// ========================================

function buildExtraTaskSection() {

    const checklistPage = document.getElementById("checklist");

    const extraCard = document.createElement("div");

    extraCard.className = "section-card";

    extraCard.innerHTML = `

        <h3>Additional Tasks</h3>

        <p>Add tasks that are unique to today.</p>

        <div style="display:flex; gap:10px; margin-bottom:20px;">

            <input
                type="text"
                id="newTaskInput"
                placeholder="Enter additional task..."
                style="flex:1;"
            >

            <button id="addTaskButton">

                Add Task

            </button>

        </div>

        <div id="extraTasksContainer"></div>

    `;

    checklistPage.appendChild(extraCard);

    document
        .getElementById("addTaskButton")
        .addEventListener("click", addExtraTask);

    loadExtraTasks();

}

// ========================================

function addExtraTask() {

    const input = document.getElementById("newTaskInput");

    const text = input.value.trim();

    if (text === "") return;

    extraTasks.push({

        task: text,

        completed: false

    });

    input.value = "";

    saveData("extraTasks", extraTasks);

    renderExtraTasks();

}

// ========================================

function loadExtraTasks() {

    const saved = loadData("extraTasks");

    if (saved) {

        extraTasks = saved;

    }

    renderExtraTasks();

}

// ========================================

function renderExtraTasks() {

    const container = document.getElementById("extraTasksContainer");

    if (!container) return;

    container.innerHTML = "";

    extraTasks.forEach(function(task, index){

        const row = document.createElement("div");

        row.className = "extra-task-row";

        row.style.marginBottom = "10px";

        row.innerHTML = `

            <label>

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                ${task.task}

            </label>

            <button
                onclick="deleteExtraTask(${index})"
                style="margin-left:20px;"
            >

                Delete

            </button>

        `;

        const checkbox = row.querySelector("input");

        checkbox.addEventListener("change", function(){

            extraTasks[index].completed = checkbox.checked;

            saveData("extraTasks", extraTasks);

        });

        container.appendChild(row);

    });

}

// ========================================

function deleteExtraTask(index){

    extraTasks.splice(index,1);

    saveData("extraTasks",extraTasks);

    renderExtraTasks();

}
// ========================================
// DAILY CHECKLIST ACTION BUTTONS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    setTimeout(addChecklistButtons, 300);

});

function addChecklistButtons() {

    const checklist = document.getElementById("checklist");

    if (!checklist) return;

    // Prevent duplicates
    if (document.getElementById("checklistButtons")) return;

    const controls = document.createElement("div");

    controls.id = "checklistButtons";

    controls.style.marginTop = "25px";

    controls.innerHTML = `

        <button id="saveChecklistBtn">
            💾 Save Checklist
        </button>

        <button id="printChecklistBtn">
            🖨 Print
        </button>

        <button id="pdfChecklistBtn">
            📄 Generate PDF
        </button>

    `;

    checklist.appendChild(controls);

    document
        .getElementById("saveChecklistBtn")
        .addEventListener("click", saveChecklistReport);

    document
        .getElementById("printChecklistBtn")
        .addEventListener("click", function(){

            window.print();

        });

    document
        .getElementById("pdfChecklistBtn")
        .addEventListener("click", generateChecklistPDF);

}
// ========================================
// SAVE DAILY REPORT
// ========================================

function saveChecklistReport(){

    const today = new Date().toLocaleDateString();

    const report = {

        date: today,

        checklist: loadData("dailyChecklist"),

        extraTasks: extraTasks

    };

    let history = loadData("savedReports");

    if(!history){

        history = [];

    }

    history.push(report);

    saveData("savedReports", history);

    alert("Daily report saved successfully.");

}
// ========================================
// PDF PLACEHOLDER
// ========================================

function generateChecklistPDF(){

    alert(

        "PDF generation will be connected in the next step."

    );

}
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
