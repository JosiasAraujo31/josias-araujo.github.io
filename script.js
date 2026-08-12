/* =========================================================
   JA DIGITAL SYSTEMS
   MAIN JAVASCRIPT
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

const mouseLight =
    document.getElementById("mouseLight");

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");

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
   CIRCUIT BOARD CANVAS
========================================================= */

const ctx =
    circuitCanvas
        ? circuitCanvas.getContext("2d")
        : null;


let canvasWidth = 0;
let canvasHeight = 0;

let circuits = [];
let particles = [];


/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {

    return Math.random() *
        (max - min) +
        min;

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
            ? 25
            : 65;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const startX =
            random(
                0,
                canvasWidth
            );

        const startY =
            random(
                0,
                canvasHeight
            );


        const length =
            random(
                60,
                240
            );


        const horizontal =
            Math.random() > .5;


        const points = [];

        points.push({
            x: startX,
            y: startY
        });


        let currentX =
            startX;

        let currentY =
            startY;


        const segments =
            Math.floor(
                random(2, 5)
            );


        for (
            let j = 0;
            j < segments;
            j++
        ) {

            if (horizontal) {

                currentX +=
                    random(
                        -length,
                        length
                    );

            } else {

                currentY +=
                    random(
                        -length,
                        length
                    );

            }


            points.push({
                x: currentX,
                y: currentY
            });

        }


        circuits.push({

            points,

            alpha:
                random(
                    .08,
                    .28
                ),

            width:
                random(
                    .4,
                    1
                ),

            speed:
                random(
                    .001,
                    .003
                ),

            phase:
                Math.random()

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
            ? 20
            : 55;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        particles.push({

            x:
                random(
                    0,
                    canvasWidth
                ),

            y:
                random(
                    0,
                    canvasHeight
                ),

            size:
                random(
                    .5,
                    1.6
                ),

            speed:
                random(
                    .05,
                    .22
                ),

            alpha:
                random(
                    .15,
                    .55
                )

        });

    }

}


/* =========================================================
   DRAW CIRCUITS
========================================================= */

function drawCircuits(time) {

    if (!ctx) return;


    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /* CIRCUIT LINES */

    circuits.forEach(
        circuit => {

            const points =
                circuit.points;


            if (
                points.length < 2
            ) {
                return;
            }


            ctx.beginPath();


            ctx.moveTo(
                points[0].x,
                points[0].y
            );


            for (
                let i = 1;
                i < points.length;
                i++
            ) {

                ctx.lineTo(
                    points[i].x,
                    points[i].y
                );

            }


            ctx.strokeStyle =
                `rgba(124,108,255,${circuit.alpha})`;

            ctx.lineWidth =
                circuit.width;

            ctx.stroke();


            /* CONNECTION NODES */

            points.forEach(
                point => {

                    ctx.beginPath();

                    ctx.arc(
                        point.x,
                        point.y,
                        2,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        `rgba(124,108,255,${circuit.alpha + .05})`;

                    ctx.fill();

                }
            );


            /* MOVING LIGHT */

            const progress =
                (
                    time *
                    circuit.speed +
                    circuit.phase
                ) % 1;


            const segment =
                Math.floor(
                    progress *
                    (points.length - 1)
                );


            const localProgress =
                (
                    progress *
                    (points.length - 1)
                ) % 1;


            const start =
                points[segment];

            const end =
                points[
                    Math.min(
                        segment + 1,
                        points.length - 1
                    )
                ];


            if (
                !start ||
                !end
            ) {
                return;
            }


            const x =
                start.x +
                (
                    end.x -
                    start.x
                ) *
                localProgress;


            const y =
                start.y +
                (
                    end.y -
                    start.y
                ) *
                localProgress;


            const gradient =
                ctx.createRadialGradient(
                    x,
                    y,
                    0,
                    x,
                    y,
                    22
                );


            gradient.addColorStop(
                0,
                "rgba(155,145,255,.8)"
            );


            gradient.addColorStop(
                1,
                "rgba(124,108,255,0)"
            );


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                22,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                gradient;

            ctx.fill();


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255,255,255,.9)";

            ctx.fill();

        }
    );


    /* PARTICLES */

    particles.forEach(
        particle => {

            particle.y -=
                particle.speed;


            if (
                particle.y < -10
            ) {

                particle.y =
                    canvasHeight + 10;

            }


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(155,145,255,${particle.alpha})`;

            ctx.fill();

        }
    );


    requestAnimationFrame(
        drawCircuits
    );

}


/* =========================================================
   INITIALIZE CANVAS
========================================================= */

function initCanvas() {

    if (!circuitCanvas) {
        return;
    }

    resizeCanvas();

    createParticles();

    window.addEventListener(
        "resize",
        () => {

            resizeCanvas();

            createParticles();

        }
    );


    requestAnimationFrame(
        drawCircuits
    );

}


initCanvas();


/* =========================================================
   MOUSE
========================================================= */

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;


window.addEventListener(
    "mousemove",
    event => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;


        if (cursorDot) {

            cursorDot.style.left =
                `${mouseX}px`;

            cursorDot.style.top =
                `${mouseY}px`;

        }


        if (mouseLight) {

            mouseLight.style.left =
                `${mouseX}px`;

            mouseLight.style.top =
                `${mouseY}px`;

        }

    }
);


function animateCursor() {

    ringX +=
        (
            mouseX -
            ringX
        ) * .15;


    ringY +=
        (
            mouseY -
            ringY
        ) * .15;


    if (cursorRing) {

        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;

    }


    requestAnimationFrame(
        animateCursor
    );

}


animateCursor();


/* =========================================================
   CURSOR HOVER
========================================================= */

const interactiveElements =
    document.querySelectorAll(
        "a, button, input, .project, .tech-card, .about-card"
    );


interactiveElements.forEach(
    element => {

        element.addEventListener(
            "mouseenter",
            () => {

                body.classList.add(
                    "cursor-hover"
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                body.classList.remove(
                    "cursor-hover"
                );

            }
        );

    }
);


/* =========================================================
   HEADER SCROLL
========================================================= */

function updateHeader() {

    if (!header) return;


    if (
        window.scrollY > 50
    ) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateHeader
);


updateHeader();


/* =========================================================
   MOBILE MENU
========================================================= */

if (
    mobileMenu &&
    nav
) {

    mobileMenu.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle(
                    "open"
                );


            mobileMenu.classList.toggle(
                "active",
                isOpen
            );


            mobileMenu.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        nav.classList.remove(
                            "open"
                        );

                        mobileMenu.classList.remove(
                            "active"
                        );

                        mobileMenu.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        const id =
                            entry.target.id;


                        navLinks.forEach(
                            link => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${id}`
                                );

                            }
                        );

                    }

                }
            );

        },
        {
            threshold: .35
        }
    );


sections.forEach(
    section => {

        sectionObserver.observe(
            section
        );

    }
);


/* =========================================================
   REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   3D PROJECT TILT
========================================================= */

const tiltCards =
    document.querySelectorAll(
        "[data-tilt]"
    );


tiltCards.forEach(
    card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 800
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (
                        y -
                        centerY
                    ) /
                    centerY *
                    -2;


                const rotateY =
                    (
                        x -
                        centerX
                    ) /
                    centerX *
                    2;


                card.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-4px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    }
);


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

const magneticButtons =
    document.querySelectorAll(
        ".magnetic"
    );


magneticButtons.forEach(
    button => {

        button.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 800
                ) {
                    return;
                }


                const rect =
                    button.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;


                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                button.style.transform =
                    `translate(${x * .08}px, ${y * .08}px)`;

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "";

            }
        );

    }
);


/* =========================================================
   COMMAND CENTER
========================================================= */

function openCommandCenter() {

    if (!commandCenter) {
        return;
    }


    commandCenter.classList.add(
        "active"
    );


    body.classList.add(
        "no-scroll"
    );


    setTimeout(
        () => {

            if (commandInput) {

                commandInput.focus();

            }

        },
        150
    );

}


function closeCommandCenter() {

    if (!commandCenter) {
        return;
    }


    commandCenter.classList.remove(
        "active"
    );


    body.classList.remove(
        "no-scroll"
    );


    if (commandInput) {

        commandInput.value = "";

    }

}


/* CTRL + K */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            openCommandCenter();

        }


        if (
            event.key === "Escape"
        ) {

            closeCommandCenter();

        }

    }
);


/* CLOSE BUTTON */

if (closeCommand) {

    closeCommand.addEventListener(
        "click",
        closeCommandCenter
    );

}


/* CLICK OUTSIDE */

if (commandCenter) {

    commandCenter.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                commandCenter
            ) {

                closeCommandCenter();

            }

        }
    );

}


/* =========================================================
   COMMAND ACTIONS
========================================================= */

const commandButtons =
    document.querySelectorAll(
        "[data-command]"
    );


commandButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.command;


                closeCommandCenter();


                const section =
                    document.getElementById(
                        target
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }
);


/* =========================================================
   COMMAND SEARCH
========================================================= */

if (commandInput) {

    commandInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const value =
                commandInput.value
                    .trim()
                    .toLowerCase();


            const commands = {

                home: "home",

                inicio: "home",

                sobre: "sobre",

                about: "sobre",

                skills: "skills",

                stack: "skills",

                projetos: "projetos",

                projects: "projetos",

                experiencia: "experiencia",

                experience: "experiencia",

                contato: "contato",

                contact: "contato"

            };


            const target =
                commands[value];


            if (!target) {

                commandInput.value = "";

                commandInput.placeholder =
                    "Comando não encontrado...";

                setTimeout(
                    () => {

                        commandInput.placeholder =
                            "Digite um comando...";

                    },
                    1200
                );

                return;

            }


            closeCommandCenter();


            const section =
                document.getElementById(
                    target
                );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================================================
   HERO PARALLAX
========================================================= */

const heroVisual =
    document.querySelector(
        ".hero-visual"
    );


if (heroVisual) {

    window.addEventListener(
        "mousemove",
        event => {

            if (
                window.innerWidth < 900
            ) {
                return;
            }


            const x =
                (
                    event.clientX /
                    window.innerWidth
                ) -
                .5;


            const y =
                (
                    event.clientY /
                    window.innerHeight
                ) -
                .5;


            heroVisual.style.transform =
                `translate(
                    ${x * 8}px,
                    ${y * 8}px
                )`;

        }
    );

}


/* =========================================================
   DYNAMIC YEAR
========================================================= */

const footerCopy =
    document.querySelector(
        ".footer-copy"
    );


if (footerCopy) {

    footerCopy.textContent =
        `© ${new Date().getFullYear()} Josias Araújo`;

}


/* =========================================================
   PAGE READY
========================================================= */

console.log(
    "%c JA DIGITAL SYSTEMS ",
    "background:#7c6cff;color:#fff;padding:8px 14px;font-weight:bold;"
);

console.log(
    "System initialized."
);

console.log(
    "CTRL + K → Command Center"
);