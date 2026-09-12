/* =========================================================
   JA DIGITAL SYSTEMS
   MAIN JAVASCRIPT (PERFORMANCE OPTIMIZED)
========================================================= */

/* =========================================================
   DOM
========================================================= */

const body = document.body;

const bootScreen =
    document.getElementById("bootScreen");

const bootProgressBar =
    document.getElementById("bootProgressBar");

const bootPercent =
    document.getElementById("bootPercent");

const circuitCanvas =
    document.getElementById("circuitCanvas");

const header =
    document.querySelector(".header");

const mobileMenu =
    document.getElementById("mobileMenu");

const nav =
    document.querySelector(".nav");

const commandCenter =
    document.getElementById("commandCenter");

const closeCommand =
    document.getElementById("closeCommand");

const commandInput =
    document.getElementById("commandInput");


/* =========================================================
   BOOT SYSTEM
========================================================= */

function startBoot() {

    if (!bootScreen) return;

    let progress = 0;

    const interval = setInterval(() => {

        progress += Math.floor(
            Math.random() * 5
        ) + 1;

        if (progress >= 100) {

            progress = 100;

            clearInterval(interval);

            setTimeout(() => {

                bootScreen.classList.add("hide");

                document.body.classList.remove(
                    "no-scroll"
                );

            }, 500);

        }

        if (bootProgressBar) {

            bootProgressBar.style.width =
                `${progress}%`;

        }

        if (bootPercent) {

            bootPercent.textContent =
                `${progress}%`;

        }

    }, 45);

}


document.body.classList.add("no-scroll");

window.addEventListener(
    "load",
    startBoot
);


/* =========================================================
   CIRCUIT BOARD CANVAS (OPTIMIZED 30 FPS)
========================================================= */

const ctx =
    circuitCanvas
        ? circuitCanvas.getContext("2d", { alpha: false })
        : null;


let canvasWidth = 0;
let canvasHeight = 0;

let circuits = [];
let particles = [];

let lastTime = 0;
const fpsInterval = 1000 / 30;


/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    if (!circuitCanvas || !ctx) {
        return;
    }

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvasWidth =
        window.innerWidth;

    canvasHeight =
        window.innerHeight;

    circuitCanvas.width =
        canvasWidth * dpr;

    circuitCanvas.height =
        canvasHeight * dpr;

    circuitCanvas.style.width =
        `${canvasWidth}px`;

    circuitCanvas.style.height =
        `${canvasHeight}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createCircuits();

}


/* =========================================================
   CIRCUIT GENERATOR
========================================================= */

function createCircuits() {

    circuits = [];

    const count =
        window.innerWidth < 700
            ? 10
            : 30;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const startX =
            random(0, canvasWidth);

        const startY =
            random(0, canvasHeight);

        const length =
            random(60, 200);

        const horizontal =
            Math.random() > .5;

        const points = [];

        points.push({
            x: startX,
            y: startY
        });

        let currentX = startX;
        let currentY = startY;

        const segments =
            Math.floor(random(2, 4));

        for (let j = 0; j < segments; j++) {

            if (horizontal) {
                currentX += random(-length, length);
            } else {
                currentY += random(-length, length);
            }

            points.push({
                x: currentX,
                y: currentY
            });

        }

        circuits.push({
            points,
            alpha: random(.08, .25),
            width: random(.4, 1),
            speed: random(.0008, .002),
            phase: Math.random()
        });

    }

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    particles = [];

    const count =
        window.innerWidth < 700
            ? 8
            : 25;


    for (let i = 0; i < count; i++) {

        particles.push({
            x: random(0, canvasWidth),
            y: random(0, canvasHeight),
            size: random(.5, 1.5),
            speed: random(.04, .15),
            alpha: random(.15, .4)
        });

    }

}


/* =========================================================
   DRAW CIRCUITS
========================================================= */

function drawCircuits(currentTime) {

    requestAnimationFrame(drawCircuits);

    if (!ctx) return;

    const elapsed = currentTime - lastTime;
    if (elapsed < fpsInterval) return;
    
    lastTime = currentTime - (elapsed % fpsInterval);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    circuits.forEach(circuit => {
        const points = circuit.points;

        if (points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = `rgba(124,108,255,${circuit.alpha})`;
        ctx.lineWidth = circuit.width;
        ctx.stroke();

        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124,108,255,${circuit.alpha + .05})`;
            ctx.fill();
        });
    });

    particles.forEach(particle => {
        particle.y -= particle.speed;

        if (particle.y < -10) {
            particle.y = canvasHeight + 10;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,145,255,${particle.alpha})`;
        ctx.fill();
    });

}


/* =========================================================
   INITIALIZE CANVAS
========================================================= */

function initCanvas() {

    if (!circuitCanvas) return;

    resizeCanvas();
    createParticles();

    let resizeTimeout;
    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                createParticles();
            }, 200);
        }
    );

    requestAnimationFrame(drawCircuits);

}

initCanvas();


/* =========================================================
   HEADER SCROLL
========================================================= */

function updateHeader() {
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   MOBILE MENU
========================================================= */

if (mobileMenu && nav) {

    mobileMenu.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        mobileMenu.classList.toggle("active", isOpen);
        mobileMenu.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            mobileMenu.classList.remove("active");
            mobileMenu.setAttribute("aria-expanded", "false");
        });
    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${id}`
                    );
                });
            }
        });
    },
    { threshold: .35 }
);

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* =========================================================
   REVEAL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: .12 }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =========================================================
   COMMAND CENTER
========================================================= */

function openCommandCenter() {
    if (!commandCenter) return;
    commandCenter.classList.add("active");
    body.classList.add("no-scroll");
    setTimeout(() => {
        if (commandInput) commandInput.focus();
    }, 150);
}

function closeCommandCenter() {
    if (!commandCenter) return;
    commandCenter.classList.remove("active");
    body.classList.remove("no-scroll");
    if (commandInput) commandInput.value = "";
}

document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommandCenter();
    }
    if (event.key === "Escape") {
        closeCommandCenter();
    }
});

if (closeCommand) {
    closeCommand.addEventListener("click", closeCommandCenter);
}

if (commandCenter) {
    commandCenter.addEventListener("click", event => {
        if (event.target === commandCenter) {
            closeCommandCenter();
        }
    });
}


/* =========================================================
   COMMAND ACTIONS & SEARCH
========================================================= */

const commandButtons = document.querySelectorAll("[data-command]");

commandButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.command;
        closeCommandCenter();
        const section = document.getElementById(target);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
});

if (commandInput) {
    commandInput.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        const value = commandInput.value.trim().toLowerCase();
        const commands = {
            home: "home", inicio: "home",
            sobre: "sobre", about: "sobre",
            skills: "skills", stack: "skills",
            projetos: "projetos", projects: "projetos",
            experiencia: "experiencia", experience: "experiencia",
            contato: "contato", contact: "contato"
        };

        const target = commands[value];

        if (!target) {
            commandInput.value = "";
            commandInput.placeholder = "Comando não encontrado...";
            setTimeout(() => {
                commandInput.placeholder = "Digite um comando...";
            }, 1200);
            return;
        }

        closeCommandCenter();
        const section = document.getElementById(target);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
}


/* =========================================================
   DYNAMIC YEAR
========================================================= */

const footerCopy = document.querySelector(".footer-copy");

if (footerCopy) {
    footerCopy.textContent = `© ${new Date().getFullYear()} Josias Araújo`;
}


/* =========================================================
   PAGE READY
========================================================= */

console.log(
    "%c JA DIGITAL SYSTEMS ",
    "background:#7c6cff;color:#fff;padding:8px 14px;font-weight:bold;"
);

console.log("System initialized (High Performance Mode).");