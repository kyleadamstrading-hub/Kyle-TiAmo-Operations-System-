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
// ROOM INSPECTION
// ========================================

function setupInspectionButton() {

    const startButton = document.getElementById("startInspection");
    const options = document.getElementById("inspectionChoice");

    if (!startButton || !options) return;

    startButton.addEventListener("click", function () {

        if (options.style.display === "none" || options.style.display === "") {

            options.style.display = "block";
            startButton.textContent = "Hide Inspection Options";

        } else {

            options.style.display = "none";
            startButton.textContent = "Start Inspection";

        }

    });

}

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
// DAILY CHECKLIST
// ========================================

// These are your daily operational tasks.
// We will later separate them into Morning and Afternoon.

const dailyTasks = {

    morning: [

        "Stocktake & Balance",

        "Check Consumables",

        "Phones Charged & Tested",

        "WhatsApp Statuses Posted",

        "Emails & Messages Replied",

        "Daily Reels Requested",

        "Daily Specials Posted",

        "Therapist Grooming Checklist",

        "Therapists Active",

        "Morning Room Inspection"

    ],

    afternoon: [

        "Reception Follow-up",

        "Afternoon WhatsApp Check",

        "Afternoon Email Check",

        "Therapists Active Check",

        "Afternoon Room Inspection"

    ]

};

// Additional tasks added by you

let extraTasks = [];


// ========================================
// CREATE CHECKLIST
// ========================================

function buildChecklist() {

    const checklistPage = document.getElementById("checklist");

    if (!checklistPage) return;

    checklistPage.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Daily Checklist";

    checklistPage.appendChild(heading);

   // ---------- Morning ----------

const morningCard = document.createElement("div");
morningCard.className = "section-card";

morningCard.innerHTML = "<h3>🌅 Morning Tasks</h3>";

dailyTasks.morning.forEach(function(task,index){

    const row=document.createElement("div");

    row.style.marginBottom="10px";

    row.innerHTML=`

        <label>

            <input
                type="checkbox"
                class="dailyTask"
                data-index="${index}"
            >

            ${task}

        </label>

    `;

    morningCard.appendChild(row);

});

checklistPage.appendChild(morningCard);


// ---------- Afternoon ----------

const afternoonCard=document.createElement("div");

afternoonCard.className="section-card";

afternoonCard.innerHTML="<h3>🌇 Afternoon Follow-up</h3>";

dailyTasks.afternoon.forEach(function(task,index){

    const row=document.createElement("div");

    row.style.marginBottom="10px";

    row.innerHTML=`

        <label>

            <input
                type="checkbox"
                class="dailyTask"
                data-index="${index+100}"
            >

            ${task}

        </label>

    `;

    afternoonCard.appendChild(row);

});

checklistPage.appendChild(afternoonCard);
    buildExtraTaskSection();

}

document.addEventListener("DOMContentLoaded", buildChecklist);
// ========================================
// CHECKLIST EVENTS
// ========================================

function initialiseChecklist() {

    const checkboxes = document.querySelectorAll(".dailyTask");

    // Restore saved state
    const saved = loadData("dailyChecklist");

    if (saved) {

        checkboxes.forEach((checkbox, index) => {

            if (saved[index] === true) {

                checkbox.checked = true;

            }

        });

    }

    // Calculate progress immediately
    calculateChecklistProgress();

    // Save whenever a checkbox changes
    checkboxes.forEach(checkbox => {

        checkbox.addEventListener("change", function () {

            saveChecklist();

            calculateChecklistProgress();

        });

    });

}

// ========================================
// SAVE CHECKLIST
// ========================================

function saveChecklist() {

    const checkboxes = document.querySelectorAll(".dailyTask");

    let data = [];

    checkboxes.forEach(box => {

        data.push(box.checked);

    });

    saveData("dailyChecklist", data);

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
// ========================================
// ROOM INSPECTION DATA
// ========================================

const standardRooms = [
    "Room 1",
    "Room 2",
    "Room 3",
    "Room 3B",
    "Room 5",
    "Room 6",
    "Room 8",
    "Room 10",
    "Shared Bathroom"
];

const executiveRooms = [
    "Gold Room",
    "Silver Room",
    "Blue Room",
    "Purple Room",
    "Green Room",
    "Executive Bathroom"
];

let currentInspectionType = "";
let currentRoom = "";

document.addEventListener("DOMContentLoaded", function () {

    setTimeout(buildInspectionMenu,500);

});

function buildInspectionMenu(){

    const area=document.getElementById("inspectionChoice");

    if(!area) return;

    area.innerHTML="";

    const standardBtn=document.createElement("button");
    standardBtn.innerHTML="🏠 Standard Suites";

    const executiveBtn=document.createElement("button");
    executiveBtn.innerHTML="⭐ Executive Suites";

    area.appendChild(standardBtn);
    area.appendChild(executiveBtn);

    standardBtn.addEventListener("click",function(){

        currentInspectionType="standard";

        buildRoomSelection(standardRooms);

    });

    executiveBtn.addEventListener("click",function(){

        currentInspectionType="executive";

        buildRoomSelection(executiveRooms);

    });

}
// ========================================
// ROOM SELECTION
// ========================================

function buildRoomSelection(roomList){

    const area=document.getElementById("inspectionChoice");

    area.innerHTML="<h3>Select Room</h3>";

    roomList.forEach(function(room){

        const button=document.createElement("button");

        button.style.display="block";
        button.style.marginBottom="10px";
        button.style.width="100%";

        button.innerHTML=room;

        button.addEventListener("click",function(){

            currentRoom=room;

            startRoomInspection(room);

        });

        area.appendChild(button);

    });

}
// ========================================
// START INSPECTION
// ========================================

function startRoomInspection(room){

    const area=document.getElementById("inspectionChoice");

    area.innerHTML="";

    const title=document.createElement("h2");

    title.innerHTML=room;

    area.appendChild(title);

   const checklist = document.createElement("div");

checklist.className = "section-card";

inspectionItems.forEach(function(item){

    const row = document.createElement("div");

    row.style.marginBottom = "12px";

    row.innerHTML = `

        <label>

            <input
                type="checkbox"
                class="inspectionCheck"
            >

            ${item}

        </label>

    `;

    checklist.appendChild(row);

});

addInspectionComments(checklist);

area.appendChild(checklist);

createInspectionButtons();

}
// ========================================
// INSPECTION BUTTONS
// ========================================

function createInspectionButtons(){

    const area=document.getElementById("inspectionChoice");

    const save=document.createElement("button");

    save.innerHTML="💾 Save Inspection";

    const report=document.createElement("button");

    report.innerHTML="📱 Generate WhatsApp Report";

    const pdf=document.createElement("button");

    pdf.innerHTML="📄 Generate PDF";

    area.appendChild(save);
    area.appendChild(report);
    area.appendChild(pdf);

  save.onclick=function(){

    saveRoomInspection();

};

    report.onclick=function(){

        alert("WhatsApp Report Coming Next");

    };

    pdf.onclick=function(){

        alert("PDF Generation Coming Next");

    };

}
// ========================================
// ROOM INSPECTION CHECKLIST ITEMS
// ========================================

const inspectionItems = [

    "Floor Vacuumed",

    "Floor Mopped",

    "Mirror Clean",

    "Bed Made Perfectly",

    "Fresh Towels",

    "Oil Bottles Filled",

    "Candles Working",

    "Music Working",

    "Bin Emptied",

    "Room Smells Fresh",

    "Overall Presentation"

];
// ========================================
// COMMENTS BOX
// ========================================

function addInspectionComments(container){

    const heading=document.createElement("h3");

    heading.innerHTML="Inspector Comments";

    container.appendChild(heading);

    const textarea=document.createElement("textarea");

    textarea.id="inspectionComments";

    textarea.rows=5;

    textarea.style.width="100%";

    textarea.placeholder="Write any observations here...";

    container.appendChild(textarea);

}
// ========================================
// SAVE ROOM INSPECTION
// ========================================

function saveRoomInspection(){

    const checks=[];

    document.querySelectorAll(".inspectionCheck").forEach(function(box){

        checks.push(box.checked);

    });

    const comments=document.getElementById("inspectionComments")?.value || "";

    const inspection={

        room:currentRoom,

        building:currentInspectionType,

        date:new Date().toLocaleDateString(),

        time:new Date().toLocaleTimeString(),

        checklist:checks,

        comments:comments

    };

    let history=loadData("roomInspections");

    if(!history){

        history=[];

    }

    history.push(inspection);

    saveData("roomInspections",history);

    alert("Inspection saved successfully.");

}
// ========================================
// LAST INSPECTION
// ========================================

document.addEventListener("DOMContentLoaded", function(){

    setTimeout(showLastInspection,700);

});

function showLastInspection(){

    const inspections = loadData("roomInspections");

    if(!inspections) return;

    if(inspections.length===0) return;

    const latest = inspections[inspections.length-1];

    const dashboard = document.getElementById("dashboard");

    if(!dashboard) return;

    const card = document.createElement("div");

    card.className = "section-card";

    card.id = "latestInspectionCard";

    card.innerHTML = `

        <h2>Latest Inspection</h2>

        <p><strong>Room:</strong> ${latest.room}</p>

        <p><strong>Building:</strong> ${latest.building}</p>

        <p><strong>Date:</strong> ${latest.date}</p>

        <p><strong>Time:</strong> ${latest.time}</p>

    `;

    dashboard.prepend(card);

}
