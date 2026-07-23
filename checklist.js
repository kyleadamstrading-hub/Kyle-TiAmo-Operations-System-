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
