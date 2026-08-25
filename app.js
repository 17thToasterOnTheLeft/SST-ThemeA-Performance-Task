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
    indiaMap: document.getElementById("indiaMap"),

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

    elements.timelineDots.innerHTML = "";
    elements.timelineMarkers.innerHTML = "";

    timeline.forEach((era, index) => {

        /* DOT */

        const dot = document.createElement("div");

        dot.className = "timeline-dot";

        dot.addEventListener("click", () => {
            goTo(index);
        });

        elements.timelineDots.appendChild(dot);


        /* MARKER */

        const marker = document.createElement("div");

        marker.className = "timeline-marker";

        marker.dataset.year = era.period;

        marker.addEventListener("click", () => {
            goTo(index);
        });

        elements.timelineMarkers.appendChild(marker);
    });
}


/* =========================================================
   RENDER EVENT
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
        space: "󠀠󠀠🚀"
    };

    return symbols[type] || "◈";
}

function renderEvent() {

    if (!timeline.length) return;

    const era = timeline[currentIndex];

    /* =========================
       BASIC ERA INFORMATION
       ========================= */

    elements.eraPeriod.textContent =
        era.year;

    elements.eraType.textContent =
        era.type?.toUpperCase() || "POLITICAL CHANGE";

    elements.eraTitle.textContent =
        era.title;

    elements.eraSummary.textContent =
        era.subtitle;


    /* =========================
       EVENT INFORMATION
       ========================= */

    elements.eventSymbol.textContent =
        getEventSymbol(era.type);

    elements.eventCategory.textContent =
        era.type?.toUpperCase() || "POLITICAL CHANGE";

    elements.eventTitle.textContent =
        era.change?.title || era.title;


    /* =========================
       CONTROL
       ========================= */

    elements.controllerText.textContent =
        era.control?.description ||
        era.control?.name ||
        "Political authority is unclear.";


    /* =========================
       CHANGE
       ========================= */

    elements.changeText.textContent =
        era.change?.description ||
        "The political situation changes.";


    /* =========================
       RESPONSE
       ========================= */

    elements.responseText.textContent =
        era.response?.description ||
        "People respond to the changing political situation.";


    /* =========================
       DATE / LOCATION
       ========================= */

    elements.eventDate.textContent =
        era.year;

    elements.eventLocation.textContent =
        elements.eventLocation.textContent =     era.location || "Indian subcontinent";


    /* =========================
       MAP
       ========================= */

    elements.mapYear.textContent =
        era.year;

    elements.mapCaption.textContent =
        era.mapCaption ||
        "Highlighted regions show the approximate modern-day areas affected by this political change.";


    updateProgress();
    updateNavigation();
    updateMap();
    updateMarkers();
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    const total = timeline.length;

    const number =
        String(currentIndex + 1).padStart(2, "0");

    const totalNumber =
        String(total).padStart(2, "0");

    elements.progressNumber.textContent =
        `${number} / ${totalNumber}`;

    elements.progressEra.textContent =
        timeline[currentIndex].period;

    const percentage =
        ((currentIndex + 1) / total) * 100;

    elements.progressBar.style.width =
        `${percentage}%`;
}


/* =========================================================
   NAVIGATION STATE
   ========================================================= */

function updateNavigation() {

    elements.previousButton.disabled =
        currentIndex === 0;

    elements.nextButton.disabled =
        currentIndex === timeline.length - 1;
}


/* =========================================================
   MAP
   ========================================================= */

function updateMap() {

    const svg = elements.indiaMap.querySelector("svg");

    if (!svg) return;

    /*
        Reset everything first.
    */

    svg.querySelectorAll(
        ".highlighted, .secondary"
    ).forEach(region => {

        region.classList.remove("highlighted");
        region.classList.remove("secondary");

    });


    const era = timeline[currentIndex];


    /*
        MAIN AREAS
    */

    if (era.map?.highlight) {

        era.map.highlight.forEach(id => {

            const region = findRegion(svg, id);

            if (region) {
                region.classList.add("highlighted");
            }

        });
    }


    /*
        SECONDARY AREAS
    */

    if (era.map?.secondary) {

        era.map.secondary.forEach(id => {

            const region = findRegion(svg, id);

            if (region) {
                region.classList.add("secondary");
            }

        });
    }
}


/* =========================================================
   FIND SVG REGION
   ========================================================= */

function findRegion(svg, id) {

    /*
        First try exact ID.
    */

    let region = svg.querySelector(`#${CSS.escape(id)}`);

    if (region) return region;


    /*
        Then try case-insensitive ID matching.
    */

    const all = svg.querySelectorAll("[id]");

    const target =
        id.toLowerCase().replace(/[\s_-]/g, "");

    for (const element of all) {

        const elementId =
            element.id
                .toLowerCase()
                .replace(/[\s_-]/g, "");

        if (elementId === target) {
            return element;
        }
    }


    return null;
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

        panel.classList.remove("fade-in");

        panel.classList.add("fade-out");

    });


    setTimeout(() => {

        renderEvent();

        panels.forEach(panel => {

            panel.classList.remove("fade-out");

            void panel.offsetWidth;

            panel.classList.add("fade-in");

        });

    }, 250);
}


/* =========================================================
   BUTTONS
   ========================================================= */

elements.nextButton.addEventListener(
    "click",
    () => {

        if (currentIndex < timeline.length - 1) {
            goTo(currentIndex + 1);
        }

    }
);


elements.previousButton.addEventListener(
    "click",
    () => {

        if (currentIndex > 0) {
            goTo(currentIndex - 1);
        }

    }
);


/* =========================================================
   INTRO
   ========================================================= */

elements.beginButton.addEventListener(
    "click",
    () => {

        elements.introScreen.classList.add("hidden");

        elements.timelineScreen.classList.remove("hidden");

        currentIndex = 0;

        renderEvent();

    }
);


/* =========================================================
   RESTART
   ========================================================= */

elements.restartButton.addEventListener(
    "click",
    () => {

        elements.endScreen.classList.add("hidden");

        elements.timelineScreen.classList.remove("hidden");

        currentIndex = 0;

        renderEvent();

    }
);


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

/* =========================================================
   START
   ========================================================= */

async function startApp() {
    await loadTimeline();
}

startApp();
