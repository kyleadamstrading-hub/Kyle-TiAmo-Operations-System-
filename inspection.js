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
