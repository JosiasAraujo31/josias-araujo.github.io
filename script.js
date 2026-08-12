/* =========================================================
   CIRCUITO DIGITAL ANIMADO
========================================================= */

const canvas = document.getElementById("circuitCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

let nodes = [];
let connections = [];
let particles = [];


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    createCircuit();

}

window.addEventListener("resize", resizeCanvas);


/* =========================================================
   CRIAR CIRCUITO
========================================================= */

function createCircuit() {

    nodes = [];
    connections = [];
    particles = [];

    const spacing = 120;

    const columns = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);


    for (let y = 0; y <= rows; y++) {

        for (let x = 0; x <= columns; x++) {

            if (Math.random() > 0.45) {

                nodes.push({

                    x: x * spacing +
                        (Math.random() - .5) * 40,

                    y: y * spacing +
                        (Math.random() - .5) * 40,

                    radius:
                        Math.random() * 2 + 1

                });

            }

        }

    }


    /* conectar pontos próximos */

    nodes.forEach((node, index) => {

        let nearest = [];

        nodes.forEach((other, otherIndex) => {

            if (index === otherIndex)
                return;

            const dx = node.x - other.x;
            const dy = node.y - other.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 170) {

                nearest.push({
                    index: otherIndex,
                    distance
                });

            }

        });


        nearest
            .sort((a,b) => a.distance - b.distance)
            .slice(0,2)
            .forEach(target => {

                if (
                    !connections.some(
                        c =>
                            c.a === target.index &&
                            c.b === index
                    )
                ) {

                    connections.push({

                        a: index,
                        b: target.index

                    });

                }

            });

    });


    /* partículas elétricas */

    for(let i = 0; i < 35; i++) {

        const connection =
            connections[
                Math.floor(
                    Math.random() *
                    connections.length
                )
            ];

        if(!connection)
            continue;

        particles.push({

            connection,

            progress: Math.random(),

            speed:
                .0015 +
                Math.random() * .003

        });

    }

}


/* =========================================================
   DESENHAR
========================================================= */

function drawCircuit() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* trilhas */

    connections.forEach(connection => {

        const a =
            nodes[connection.a];

        const b =
            nodes[connection.b];


        ctx.beginPath();

        ctx.moveTo(a.x,a.y);

        /*
            linhas com aparência de placa-mãe
        */

        const middleX =
            a.x +
            (b.x - a.x) / 2;


        ctx.lineTo(
            middleX,
            a.y
        );


        ctx.lineTo(
            middleX,
            b.y
        );


        ctx.lineTo(
            b.x,
            b.y
        );


        ctx.strokeStyle =
            "rgba(0,255,102,.07)";

        ctx.lineWidth = 1;

        ctx.stroke();

    });


    /* nós */

    nodes.forEach(node => {

        ctx.beginPath();

        ctx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,255,102,.4)";

        ctx.fill();

    });


    /* energia */

    particles.forEach(particle => {

        const a =
            nodes[particle.connection.a];

        const b =
            nodes[particle.connection.b];


        particle.progress +=
            particle.speed;


        if(particle.progress > 1) {

            particle.progress = 0;

        }


        const t =
            particle.progress;


        const x =
            a.x +
            (b.x - a.x) * t;

        const y =
            a.y +
            (b.y - a.y) * t;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            2,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#00ff66";


        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#00ff66";


        ctx.fill();

        ctx.shadowBlur = 0;

    });


    requestAnimationFrame(drawCircuit);

}


resizeCanvas();
drawCircuit();


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow =
    document.querySelector(".cursor-glow");


window.addEventListener(
    "mousemove",
    event => {

        cursorGlow.animate(

            {

                left:
                    `${event.clientX}px`,

                top:
                    `${event.clientY}px`

            },

            {

                duration: 500,

                fill: "forwards"

            }

        );

    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if(entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {

            threshold: .12

        }

    );


revealElements.forEach(
    element =>
        observer.observe(element)
);


/* =========================================================
   NAV ACTIVE
========================================================= */

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 200;

            if(
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            if(
                link.getAttribute("href") ===
                `#${current}`
            ) {

                link.classList.add("active");

            }

        });

    }
);


/* =========================================================
   TILT DOS CARDS
========================================================= */

const cards =
    document.querySelectorAll(
        ".project-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;


            const rotateX =
                ((y / rect.height) - .5) * -6;

            const rotateY =
                ((x / rect.width) - .5) * 6;


            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
            `;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* =========================================================
   MENU MOBILE
========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );


const nav =
    document.querySelector(".nav");


menuButton.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
            "mobile-open"
        );

    }
);


/* =========================================================
   EFEITO DE TEXTO NO TERMINAL
========================================================= */

const terminalOutput =
    document.querySelector(
        ".terminal-output"
    );


let terminalTexts = [

    "Josias Araújo",

    "building_the_future...",

    "AI + Automation",

    "system.online"

];


let terminalIndex = 0;


setInterval(() => {

    terminalIndex++;

    if(
        terminalIndex >=
        terminalTexts.length
    ) {

        terminalIndex = 0;

    }


    if(terminalOutput) {

        terminalOutput.textContent =
            terminalTexts[
                terminalIndex
            ];

    }

}, 3000);