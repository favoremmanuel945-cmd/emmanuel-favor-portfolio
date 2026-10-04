/* ============================================================
   EMMANUEL FAVOR PORTFOLIO
   STAGE 3
   CURTAIN + PARTICLE GLOBE
============================================================ */


/* ============================================================
   ELEMENTS
============================================================ */

const body =
    document.body;

const hero =
    document.querySelector(".hero");

const portrait =
    document.getElementById("portrait");

const enterButton =
    document.getElementById("enterButton");

const enterText =
    document.querySelector(".enter-text");

const introScreen =
    document.getElementById("introScreen");

const canvas =
    document.getElementById("particleGlobe");

const ctx =
    canvas.getContext("2d");


/* ============================================================
   PAGE ENTRANCE
============================================================ */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                body.classList.add(
                    "loaded"
                );

            },
            120
        );

    }
);


/* ============================================================
   PORTRAIT PARALLAX
============================================================ */

const finePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    finePointer &&
    !reducedMotion
) {

    hero.addEventListener(
        "mousemove",
        (event) => {

            if (
                body.classList.contains(
                    "transitioning"
                )
            ) {
                return;
            }


            const bounds =
                hero.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    bounds.left
                ) /
                bounds.width;


            const y =
                (
                    event.clientY -
                    bounds.top
                ) /
                bounds.height;


            const moveX =
                (x - 0.5) * 13;

            const moveY =
                (y - 0.5) * 8;


            portrait.style.transform =
                `translate3d(
                    ${moveX}px,
                    ${moveY}px,
                    0
                ) scale(1.012)`;

        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            portrait.style.transform =
                "translate3d(0,0,0) scale(1)";

        }
    );

}


/* ============================================================
   CURTAIN TRANSITION — DETERMINISTIC VERSION
============================================================ */

let enteredPortfolio = false;

const curtainLeft =
    document.querySelector(".curtain-left");

const curtainRight =
    document.querySelector(".curtain-right");

const transitionMark =
    document.querySelector(".transition-mark");


function wait(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


enterButton.addEventListener(
    "click",
    async () => {

        if (enteredPortfolio) {
            return;
        }

        enteredPortfolio = true;

        enterText.textContent =
            "Entering...";

        enterButton.style.pointerEvents =
            "none";


        /* ---------------------------------------------
           1. PREPARE CURTAINS
        --------------------------------------------- */

        curtainLeft.style.animation =
            "none";

        curtainRight.style.animation =
            "none";

        curtainLeft.style.transition =
            "none";

        curtainRight.style.transition =
            "none";

        curtainLeft.style.transform =
            "translateX(-101%)";

        curtainRight.style.transform =
            "translateX(101%)";

        transitionMark.style.animation =
            "none";

        transitionMark.style.opacity =
            "0";


        /*
            Force browser to commit starting state.
        */

        void curtainLeft.offsetWidth;


        /* ---------------------------------------------
           2. CLOSE CURTAINS
        --------------------------------------------- */

        curtainLeft.style.transition =
            "transform 850ms cubic-bezier(.76,0,.24,1)";

        curtainRight.style.transition =
            "transform 850ms cubic-bezier(.76,0,.24,1)";

        curtainLeft.style.transform =
            "translateX(0)";

        curtainRight.style.transform =
            "translateX(0)";


        await wait(880);


        /* ---------------------------------------------
           3. SHOW EF MARK
        --------------------------------------------- */

        transitionMark.style.transition =
            "opacity 350ms ease, transform 350ms ease";

        transitionMark.style.transform =
            "translate(-50%, -50%) scale(.85)";

        transitionMark.style.opacity =
            "1";

        requestAnimationFrame(() => {

            transitionMark.style.transform =
                "translate(-50%, -50%) scale(1)";

        });


        await wait(450);


        /* ---------------------------------------------
           4. START PORTFOLIO BEHIND CURTAIN
        --------------------------------------------- */

        initGlobe();

        body.classList.add(
            "portfolio-open"
        );


        await wait(350);


        /* ---------------------------------------------
           5. REMOVE EF
        --------------------------------------------- */

        transitionMark.style.opacity =
            "0";

        transitionMark.style.transform =
            "translate(-50%, -50%) scale(.82)";


        await wait(300);


        /* ---------------------------------------------
           6. OPEN CURTAINS
        --------------------------------------------- */

        curtainLeft.style.transition =
            "transform 1150ms cubic-bezier(.76,0,.24,1)";

        curtainRight.style.transition =
            "transform 1150ms cubic-bezier(.76,0,.24,1)";

        curtainLeft.style.transform =
            "translateX(-101%)";

        curtainRight.style.transform =
            "translateX(101%)";


        await wait(1180);


        /* ---------------------------------------------
           7. LANDING PAGE IS FINISHED
        --------------------------------------------- */

        introScreen.style.visibility =
            "hidden";

        introScreen.style.pointerEvents =
            "none";

        body.style.overflow =
            "auto";

        console.log(
            "Portfolio transition complete."
        );

    }
);


/* ============================================================
   PARTICLE GLOBE
============================================================ */

let globeStarted = false;

let particles = [];

let animationFrame;

let rotation = 0;


/* Globe configuration */

const globe = {

    particleCount: 900,

    radius: 230,

    rotationSpeed: 0.0015,

    perspective: 650

};


/* ============================================================
   CANVAS RESIZE
============================================================ */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;


    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    globe.radius =
        Math.min(
            window.innerWidth,
            window.innerHeight
        ) * 0.29;

}


/* ============================================================
   CREATE SPHERE PARTICLES

   Fibonacci sphere distributes particles evenly
   across a 3D sphere.
============================================================ */

function createParticles() {

    particles = [];


    const count =
        window.innerWidth < 700
            ? 600
            : globe.particleCount;


    const goldenAngle =
        Math.PI *
        (3 - Math.sqrt(5));


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const y =
            1 -
            (i / (count - 1)) * 2;


        const radiusAtY =
            Math.sqrt(
                1 - y * y
            );


        const theta =
            goldenAngle * i;


        const x =
            Math.cos(theta) *
            radiusAtY;


        const z =
            Math.sin(theta) *
            radiusAtY;


        particles.push({

            x,
            y,
            z,

            size:
                Math.random() *
                1.25 +
                0.35,

            brightness:
                Math.random() *
                0.55 +
                0.3

        });

    }

}


/* ============================================================
   DRAW GLOBE
============================================================ */

function drawGlobe() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    /*
        Globe intentionally sits right of center
        so text can occupy the left side.
    */

    const centerX =
        window.innerWidth < 900
            ? window.innerWidth * 0.58
            : window.innerWidth * 0.70;


    const centerY =
        window.innerHeight * 0.50;


    rotation +=
        globe.rotationSpeed;


    const cos =
        Math.cos(rotation);

    const sin =
        Math.sin(rotation);


    /*
        Sort by depth so rear particles
        draw before front particles.
    */

    const projected =
        particles.map(
            (particle) => {

                const rotatedX =
                    particle.x * cos -
                    particle.z * sin;


                const rotatedZ =
                    particle.x * sin +
                    particle.z * cos;


                const scale =
                    globe.perspective /
                    (
                        globe.perspective -
                        rotatedZ *
                        globe.radius
                    );


                return {

                    x:
                        centerX +
                        rotatedX *
                        globe.radius *
                        scale,

                    y:
                        centerY +
                        particle.y *
                        globe.radius *
                        scale,

                    z:
                        rotatedZ,

                    scale,

                    size:
                        particle.size,

                    brightness:
                        particle.brightness

                };

            }
        );


    projected.sort(
        (a, b) =>
            a.z - b.z
    );


    for (
        const point
        of projected
    ) {

        /*
            Front particles are brighter.
        */

        const depth =
            (point.z + 1) / 2;


        const alpha =
            0.15 +
            depth *
            point.brightness;


        /*
            Small percentage of orange particles
            adds our portfolio accent.
        */

        const orange =
            Math.sin(
                point.x * 0.021 +
                point.y * 0.018
            ) > 0.985;


        ctx.beginPath();


        ctx.arc(
            point.x,
            point.y,
            point.size *
            point.scale,
            0,
            Math.PI * 2
        );


        if (orange) {

            ctx.fillStyle =
                `rgba(
                    255,
                    99,
                    53,
                    ${Math.min(alpha + 0.25, 1)}
                )`;

        } else {

            ctx.fillStyle =
                `rgba(
                    235,
                    238,
                    240,
                    ${alpha}
                )`;

        }


        ctx.fill();

    }


    /*
        Very subtle atmosphere around sphere.
    */

    const gradient =
        ctx.createRadialGradient(
            centerX,
            centerY,
            globe.radius * 0.4,
            centerX,
            centerY,
            globe.radius * 1.25
        );


    gradient.addColorStop(
        0,
        "rgba(255,99,53,0.018)"
    );


    gradient.addColorStop(
        0.7,
        "rgba(255,99,53,0.008)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.arc(
        centerX,
        centerY,
        globe.radius * 1.25,
        0,
        Math.PI * 2
    );


    ctx.fill();


    animationFrame =
        requestAnimationFrame(
            drawGlobe
        );

}


/* ============================================================
   START GLOBE
============================================================ */

function initGlobe() {

    if (globeStarted) {
        return;
    }


    globeStarted = true;


    resizeCanvas();

    createParticles();

    drawGlobe();

}


/* ============================================================
   RESIZE
============================================================ */

window.addEventListener(
    "resize",
    () => {

        if (!globeStarted) {
            return;
        }


        resizeCanvas();

        createParticles();

    }
);


/* ============================================================
   DEVELOPMENT KEYBOARD RESET

   Press R while developing to replay
   the landing page without restarting localhost.
============================================================ */

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key.toLowerCase() !== "r"
        ) {
            return;
        }


        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }


        window.location.reload();

    }
);
