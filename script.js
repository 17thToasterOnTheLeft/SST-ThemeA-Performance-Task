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
            throw new Error("Could not load timeline.json");
        }

        timeline = await response.json();

        await loadMap();

        buildTimelineNavigation();

        renderEvent();

    } catch (error) {

        console.error(error);

        elements.eraTitle.textContent =
            "Timeline failed to load";

        elements.eraSummary.textContent =
            "Check that timeline.json and india.svg are in the correct folder.";
    }
}


/* =========================================================
   LOAD SVG
   ========================================================= */

async function loadMap() {

    try {

        const response = await fetch("india.svg");

        if (!response.ok) {
            throw new Error("Could not load india.svg");
        }

        const svgText = await response.text();

        elements.indiaMap.innerHTML = svgText;

    } catch (error) {

        console.error(error);

        elements.indiaMap.innerHTML = `
            <div style="
                color:#777;
                text-align:center;
                font-size:12px;
            ">
                INDIA MAP COULD NOT BE LOADED
            </div>
        `;
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

function renderEvent() {

    if (!timeline.length) return;

    const era = timeline[currentIndex];

    elements.eraPeriod.textContent = era.period;
    elements.eraType.textContent = era.type;

    elements.eraTitle.textContent = era.title;
    elements.eraSummary.textContent = era.summary;

    elements.eventSymbol.textContent =
        era.symbol || "◈";

    elements.eventCategory.textContent =
        era.eventType || "POLITICAL CHANGE";

    elements.eventTitle.textContent =
        era.eventTitle;

    elements.controllerText.textContent =
        era.controlledBy;

    elements.changeText.textContent =
        era.change;

    elements.responseText.textContent =
        era.response;

    elements.eventDate.textContent =
        era.date || era.period;

    elements.eventLocation.textContent =
        era.location || "Indian subcontinent";

    elements.mapYear.textContent =
        era.period;

    elements.mapCaption.textContent =
        era.mapCaption ||
        "Highlighted regions are approximate modern geographic references.";

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

loadTimeline();
