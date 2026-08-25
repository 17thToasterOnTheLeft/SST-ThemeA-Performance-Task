/* =========================================================
   INDIA POLITICAL HISTORY
   ========================================================= */

let timeline = [];
let currentIndex = 0;

const elements = {

    introScreen: document.getElementById("introScreen"),
    timelineScreen: document.getElementById("timelineScreen"),
    endScreen: document.getElementById("endScreen"),

    beginButton: document.getElementById("beginButton"),
    restartButton: document.getElementById("restartButton"),

    previousButton: document.getElementById("previousButton"),
    nextButton: document.getElementById("nextButton"),

    progressEra: document.getElementById("progressEra"),
    progressNumber: document.getElementById("progressNumber"),
    progressBar: document.getElementById("progressBar"),

    eraPeriod: document.getElementById("eraPeriod"),
    eraType: document.getElementById("eraType"),
    eraTitle: document.getElementById("eraTitle"),
    eraSummary: document.getElementById("eraSummary"),

    eventSymbol: document.getElementById("eventSymbol"),
    eventCategory: document.getElementById("eventCategory"),
    eventTitle: document.getElementById("eventTitle"),

    controllerText: document.getElementById("controllerText"),
    changeText: document.getElementById("changeText"),
    responseText: document.getElementById("responseText"),

    eventDate: document.getElementById("eventDate"),
    eventLocation: document.getElementById("eventLocation"),

    mapYear: document.getElementById("mapYear"),
    mapCaption: document.getElementById("mapCaption"),

    timelineDots: document.getElementById("timelineDots"),
    timelineMarkers: document.getElementById("timelineMarkers")
};


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadTimeline() {
    try {

        const response = await fetch("timeline.json");

        if (!response.ok) {
            throw new Error(
                `Failed to load timeline.json: ${response.status}`
            );
        }

        const data = await response.json();

        timeline = data.eras;

        if (!Array.isArray(timeline)) {
            throw new Error(
                "timeline.json: 'eras' is not an array"
            );
        }

        buildTimelineNavigation();

        currentIndex = 0;
        renderEvent();

    } catch (error) {

        console.error("Failed to load timeline:", error);

    }
}


/* =========================================================
   BUILD NAVIGATION
   ========================================================= */

function buildTimelineNavigation() {

    if (elements.timelineDots) {
        elements.timelineDots.innerHTML = "";
    }

    if (elements.timelineMarkers) {
        elements.timelineMarkers.innerHTML = "";
    }

    timeline.forEach((era, index) => {

        /* DOT */

        if (elements.timelineDots) {

            const dot = document.createElement("div");

            dot.className = "timeline-dot";

            dot.addEventListener("click", () => {
                goTo(index);
            });

            elements.timelineDots.appendChild(dot);

        }


        /* MARKER */

        if (elements.timelineMarkers) {

            const marker = document.createElement("div");

            marker.className = "timeline-marker";

            marker.dataset.year = era.period;

            marker.addEventListener("click", () => {
                goTo(index);
            });

            elements.timelineMarkers.appendChild(marker);

        }

    });
}


/* =========================================================
   EVENT SYMBOL
   ========================================================= */

function getEventSymbol(type) {

    const symbols = {

        civilization: "🏺",
        ruler: "👑",
        death: "💀",
        empire: "🏰",
        battle: "⚔️",
        religion: "🔆",
        revolt: "✊",
        colonial: "⚓",
        law: "⚖️",
        reform: "📜",
        independence: "🕊️",
        politics: "🏛️",
        science: "🧪",
        technology: "🤖",
        space: "🚀"

    };

    return symbols[type] || "◈";
}


/* =========================================================
   RENDER EVENT
   ========================================================= */

function renderEvent() {

    if (!timeline.length) return;

    const era = timeline[currentIndex];

    /*
       Safely update an element.

       This prevents:
       Cannot set properties of null (setting 'textContent')

       if an element was removed from the HTML.
    */

    const setText = (element, value) => {

        if (element) {
            element.textContent = value ?? "";
        }

    };


    /* =========================
       BASIC ERA INFORMATION
       ========================= */

    setText(
        elements.eraPeriod,
        era.year
    );

    setText(
        elements.eraType,
        era.type?.toUpperCase() || "POLITICAL CHANGE"
    );

    setText(
        elements.eraTitle,
        era.title
    );

    setText(
        elements.eraSummary,
        era.subtitle
    );


    /* =========================
       EVENT INFORMATION
       ========================= */

    setText(
        elements.eventSymbol,
        getEventSymbol(era.type)
    );

    setText(
        elements.eventCategory,
        era.type?.toUpperCase() || "POLITICAL CHANGE"
    );

    setText(
        elements.eventTitle,
        era.change?.title || era.title
    );


    /* =========================
       CONTROL
       ========================= */

    setText(
        elements.controllerText,
        era.control?.description ||
        era.control?.name ||
        "Political authority is unclear."
    );


    /* =========================
       CHANGE
       ========================= */

    setText(
        elements.changeText,
        era.change?.description ||
        "The political situation changes."
    );


    /* =========================
       RESPONSE
       ========================= */

    setText(
        elements.responseText,
        era.response?.description ||
        "People respond to the changing political situation."
    );


    /* =========================
       DATE / LOCATION
       ========================= */

    setText(
        elements.eventDate,
        era.year
    );

    setText(
        elements.eventLocation,
        era.location || "Indian subcontinent"
    );


    /* =========================
       MAP
       ========================= */

    setText(
        elements.mapYear,
        era.year
    );

    setText(
        elements.mapCaption,
        era.mapCaption ||
        "Highlighted regions show the approximate modern-day areas affected by this political change."
    );


    updateProgress();
    updateNavigation();
    updateMarkers();

}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    const total = timeline.length;

    if (!total) return;

    const number =
        String(currentIndex + 1).padStart(2, "0");

    const totalNumber =
        String(total).padStart(2, "0");


    if (elements.progressNumber) {

        elements.progressNumber.textContent =
            `${number} / ${totalNumber}`;

    }


    if (elements.progressEra) {

        elements.progressEra.textContent =
            timeline[currentIndex].period;

    }


    const percentage =
        ((currentIndex + 1) / total) * 100;


    if (elements.progressBar) {

        elements.progressBar.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   NAVIGATION STATE
   ========================================================= */

function updateNavigation() {

    if (elements.previousButton) {

        elements.previousButton.disabled =
            currentIndex === 0;

    }


    if (elements.nextButton) {

        elements.nextButton.disabled =
            currentIndex === timeline.length - 1;

    }

}


/* =========================================================
   MARKERS
   ========================================================= */

function updateMarkers() {

    document
        .querySelectorAll(".timeline-dot")
        .forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });


    document
        .querySelectorAll(".timeline-marker")
        .forEach((marker, index) => {

            marker.classList.toggle(
                "active",
                index === currentIndex
            );

        });

}


/* =========================================================
   GO TO ERA
   ========================================================= */

function goTo(index) {

    if (
        index < 0 ||
        index >= timeline.length
    ) {
        return;
    }

    currentIndex = index;

    animateEvent();

}


/* =========================================================
   EVENT ANIMATION
   ========================================================= */

function animateEvent() {

    const panels = [

        document.querySelector(".history-panel"),
        document.querySelector(".event-panel"),
        document.querySelector(".map-panel")

    ];


    panels.forEach(panel => {

        if (!panel) return;

        panel.classList.remove("fade-in");

        panel.classList.add("fade-out");

    });


    setTimeout(() => {

        renderEvent();


        panels.forEach(panel => {

            if (!panel) return;

            panel.classList.remove("fade-out");

            void panel.offsetWidth;

            panel.classList.add("fade-in");

        });

    }, 250);

}


/* =========================================================
   BUTTONS
   ========================================================= */

if (elements.nextButton) {

    elements.nextButton.addEventListener(
        "click",
        () => {

            if (currentIndex < timeline.length - 1) {

                goTo(currentIndex + 1);

            }

        }
    );

}


if (elements.previousButton) {

    elements.previousButton.addEventListener(
        "click",
        () => {

            if (currentIndex > 0) {

                goTo(currentIndex - 1);

            }

        }
    );

}


/* =========================================================
   INTRO
   ========================================================= */

if (elements.beginButton) {

    elements.beginButton.addEventListener(
        "click",
        () => {

            if (elements.introScreen) {
                elements.introScreen.classList.add("hidden");
            }

            if (elements.timelineScreen) {
                elements.timelineScreen.classList.remove("hidden");
            }

            currentIndex = 0;

            renderEvent();

        }
    );

}


/* =========================================================
   RESTART
   ========================================================= */

if (elements.restartButton) {

    elements.restartButton.addEventListener(
        "click",
        () => {

            if (elements.endScreen) {
                elements.endScreen.classList.add("hidden");
            }

            if (elements.timelineScreen) {
                elements.timelineScreen.classList.remove("hidden");
            }

            currentIndex = 0;

            renderEvent();

        }
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight" ||
            event.key === " "
        ) {

            event.preventDefault();

            if (
                currentIndex <
                timeline.length - 1
            ) {

                goTo(currentIndex + 1);

            }

        }


        if (event.key === "ArrowLeft") {

            if (currentIndex > 0) {

                goTo(currentIndex - 1);

            }

        }

    }
);


/* =========================================================
   START
   ========================================================= */

async function startApp() {

    await loadTimeline();

}

startApp();
