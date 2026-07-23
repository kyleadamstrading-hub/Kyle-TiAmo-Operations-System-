// ========================================
// SPA OPERATIONS MANAGER
// app.js
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    initialiseApp();

});

// ========================================
// INITIALISE APP
// ========================================

function initialiseApp() {

    displayCurrentDate();

    setupNavigation();

    updateProgress(0);

    loadNotes();

    console.log("Spa Operations Manager Loaded");

}

// ========================================
// DISPLAY CURRENT DATE
// ========================================

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

// ========================================
// SIDEBAR NAVIGATION
// ========================================

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

// Make function available globally
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
// LOCAL STORAGE HELPERS
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
