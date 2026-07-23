// ========================================
// SPA OPERATIONS MANAGER
// staff.js
// ========================================

let staffMembers = [];

let editingStaffId = null;

// ========================================
// INITIALISE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    initialiseStaff();

});

// ========================================
// INITIALISE STAFF
// ========================================

function initialiseStaff() {

    loadStaff();

    renderStaff();

    setupStaffEvents();

}

// ========================================
// EVENTS
// ========================================

function setupStaffEvents() {

    const saveButton = document.getElementById("saveStaffBtn");
    const searchBox = document.getElementById("staffSearch");

    if (saveButton) {

        saveButton.addEventListener("click", saveStaffMember);

    }

    if (searchBox) {

        searchBox.addEventListener("input", function () {

            const results = searchStaff(this.value);

            renderStaff(results);

        });

    }

}

// ========================================
// SAVE STAFF MEMBER
// ========================================

function saveStaffMember() {

    const name = document.getElementById("staffName").value.trim();
    const position = document.getElementById("staffPosition").value.trim();
    const phone = document.getElementById("staffPhone").value.trim();
    const email = document.getElementById("staffEmail").value.trim();
    const status = document.getElementById("staffStatus").value;

    if (!name || !position) {

        alert("Please enter at least a name and position.");

        return;

    }

    if (editingStaffId === null) {

        staffMembers.push({

            id: Date.now(),

            name,

            position,

            phone,

            email,

            status

        });

    } else {

        const member = staffMembers.find(m => m.id === editingStaffId);

        if (member) {

            member.name = name;
            member.position = position;
            member.phone = phone;
            member.email = email;
            member.status = status;

        }

        editingStaffId = null;

        document.getElementById("saveStaffBtn").textContent = "Save Staff Member";

    }

    saveStaff();

    renderStaff();

    clearStaffForm();

}

// ========================================
// RENDER STAFF
// ========================================

function renderStaff(list = staffMembers) {

    const container = document.getElementById("staffList");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = "<p>No staff members found.</p>";

        return;

    }

    list.forEach(member => {

        const card = document.createElement("div");

        card.className = "staff-card";

        card.innerHTML = `

            <h3>${member.name}</h3>

            <p><strong>Position:</strong> ${member.position}</p>

            <p><strong>Phone:</strong> ${member.phone || "-"}</p>

            <p><strong>Email:</strong> ${member.email || "-"}</p>

            <p><strong>Status:</strong> ${member.status}</p>

            <div class="staff-actions">

                <button class="edit-btn" data-id="${member.id}">

                    Edit

                </button>

                <button class="delete-btn" data-id="${member.id}">

                    Delete

                </button>

            </div>

        `;

        container.appendChild(card);

    });

    container.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", function () {

            editStaffMember(Number(this.dataset.id));

        });

    });

    container.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", function () {

            deleteStaffMember(Number(this.dataset.id));

        });

    });

}

// ========================================
// EDIT
// ========================================

function editStaffMember(id) {

    const member = staffMembers.find(m => m.id === id);

    if (!member) return;

    editingStaffId = id;

    document.getElementById("staffName").value = member.name;
    document.getElementById("staffPosition").value = member.position;
    document.getElementById("staffPhone").value = member.phone;
    document.getElementById("staffEmail").value = member.email;
    document.getElementById("staffStatus").value = member.status;

    document.getElementById("saveStaffBtn").textContent = "Update Staff Member";

}

// ========================================
// DELETE
// ========================================

function deleteStaffMember(id) {

    if (!confirm("Delete this staff member?")) return;

    staffMembers = staffMembers.filter(member => member.id !== id);

    saveStaff();

    renderStaff();

}

// ========================================
// SEARCH
// ========================================

function searchStaff(term) {

    term = term.toLowerCase();

    return staffMembers.filter(member =>

        member.name.toLowerCase().includes(term) ||

        member.position.toLowerCase().includes(term) ||

        member.status.toLowerCase().includes(term)

    );

}

// ========================================
// CLEAR FORM
// ========================================

function clearStaffForm() {

    document.getElementById("staffName").value = "";
    document.getElementById("staffPosition").value = "";
    document.getElementById("staffPhone").value = "";
    document.getElementById("staffEmail").value = "";
    document.getElementById("staffStatus").selectedIndex = 0;

}

// ========================================
// SAVE
// ========================================

function saveStaff() {

    localStorage.setItem(

        "spaStaff",

        JSON.stringify(staffMembers)

    );

}

// ========================================
// LOAD
// ========================================

function loadStaff() {

    const saved = localStorage.getItem("spaStaff");

    if (!saved) {

        staffMembers = [];

        return;

    }

    staffMembers = JSON.parse(saved);

}
