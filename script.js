const motto = "Створюємо цифрові продукти, які працюють на людей.";
const mottoText = document.getElementById("mottoText");
let mottoIndex = 0;

function typeMotto() {
    if (mottoIndex <= motto.length) {
        mottoText.textContent = motto.slice(0, mottoIndex);
        mottoIndex += 1;
        window.setTimeout(typeMotto, 55);
        return;
    }
    window.setTimeout(() => {
        mottoText.textContent = "";
        mottoIndex = 0;
        typeMotto();
    }, 2400);
}

function startMotto() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        mottoText.textContent = motto;
        return;
    }
    typeMotto();
}

const pageLinks = document.querySelectorAll("[data-page-link]");

function pageFromHash() {
    const page = window.location.hash.replace("#", "");
    return ["home", "projects", "feedback"].includes(page) ? page : "home";
}

function showPage(pageName) {
    const sections = document.getElementsByTagName("section");
    for (const section of sections) {
        if (!section.dataset.page) {
            continue;
        }
        section.hidden = section.dataset.page !== pageName;
    }
    for (const link of pageLinks) {
        if (link.dataset.pageLink === pageName) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    }
    document.body.dataset.currentPage = pageName;
    if (pageName === "projects") {
        startCarousel();
    } else {
        stopCarousel();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

for (const link of pageLinks) {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const pageName = link.dataset.pageLink;
        if (window.location.hash === `#${pageName}`) {
            showPage(pageName);
            return;
        }
        window.location.hash = pageName;
    });
}

window.addEventListener("hashchange", () => {
    showPage(pageFromHash());
});

const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const carouselCounter = document.getElementById("carouselCounter");
const carouselSlides = document.getElementsByClassName("carousel-slide");
let carouselIndex = 0;
let carouselTimer = null;

function renderDots() {
    while (carouselDots.firstChild) {
        carouselDots.removeChild(carouselDots.firstChild);
    }
    for (let index = 0; index < carouselSlides.length; index += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Слайд ${index + 1}`);
        if (index === carouselIndex) {
            dot.classList.add("is-active");
        }
        dot.addEventListener("click", () => {
            goToSlide(index);
        });
        carouselDots.appendChild(dot);
    }
}

function goToSlide(index) {
    carouselIndex = (index + carouselSlides.length) % carouselSlides.length;
    carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    carouselCounter.textContent = `${carouselIndex + 1} / ${carouselSlides.length}`;
    renderDots();
}

function startCarousel() {
    stopCarousel();
    carouselTimer = window.setInterval(() => {
        goToSlide(carouselIndex + 1);
    }, 5000);
}

function stopCarousel() {
    if (carouselTimer !== null) {
        window.clearInterval(carouselTimer);
        carouselTimer = null;
    }
}

document.getElementById("prevSlide").addEventListener("click", () => {
    goToSlide(carouselIndex - 1);
});

document.getElementById("nextSlide").addEventListener("click", () => {
    goToSlide(carouselIndex + 1);
});

const founderImage = document.getElementById("founderImage");
const riddleModal = document.getElementById("riddleModal");
const riddleForm = document.getElementById("riddleForm");
const riddleAnswer = document.getElementById("riddleAnswer");
const riddleFeedback = document.getElementById("riddleFeedback");

function openRiddle() {
    riddleModal.hidden = false;
    document.body.classList.add("modal-open");
    riddleFeedback.textContent = "";
    riddleFeedback.className = "riddle-feedback";
    riddleForm.reset();
    window.setTimeout(() => {
        riddleAnswer.focus();
    }, 40);
}

function closeRiddle() {
    riddleModal.hidden = true;
    document.body.classList.remove("modal-open");
    riddleForm.reset();
    riddleFeedback.textContent = "";
    riddleFeedback.className = "riddle-feedback";
}

function normalizeAnswer(value) {
    return value.toLowerCase().replace(/[^a-zа-яіїєґ0-9]/gi, "");
}

founderImage.onmouseenter = openRiddle;
founderImage.onfocus = openRiddle;

riddleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalizeAnswer(riddleAnswer.value);
    if (["javascript", "js", "джаваскрипт"].includes(answer)) {
        riddleFeedback.textContent = "Правильно! JavaScript оживляє сторінку.";
        riddleFeedback.className = "riddle-feedback is-success";
        window.setTimeout(closeRiddle, 1200);
        return;
    }
    riddleFeedback.textContent = "Ще не те. Підказка: це мова, яка працює в браузері.";
    riddleFeedback.className = "riddle-feedback is-error";
});

riddleModal.addEventListener("click", (event) => {
    if (event.target === riddleModal) {
        closeRiddle();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !riddleModal.hidden) {
        closeRiddle();
    }
});

const feedbackForm = document.getElementById("feedbackForm");
const detailField = document.getElementById("detailField");

function showDetailHint() {
    detailField.classList.add("is-active");
}

function hideDetailHint() {
    detailField.classList.remove("is-active");
}

detailField.addEventListener("mouseenter", showDetailHint);
detailField.addEventListener("mouseleave", hideDetailHint);
detailField.addEventListener("focusin", showDetailHint);
detailField.addEventListener("focusout", hideDetailHint);

function setFeedbackMessage(text, type) {
    const oldMessage = document.getElementById("feedbackMessage");
    const newMessage = document.createElement("p");
    newMessage.id = "feedbackMessage";
    newMessage.className = `form-message ${type}`;
    newMessage.setAttribute("role", "status");
    newMessage.setAttribute("aria-live", "polite");
    newMessage.textContent = text;
    oldMessage.parentNode.replaceChild(newMessage, oldMessage);
}

feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestTypes = document.getElementsByName("requestType");
    const selectedType = Array.from(requestTypes).find((radio) => radio.checked);
    if (!selectedType) {
        setFeedbackMessage("Оберіть тему звернення.", "is-error");
        return;
    }
    const fullName = document.getElementById("fullName").value.trim();
    feedbackForm.reset();
    detailField.classList.remove("is-active");
    setFeedbackMessage(`Дякуємо, ${fullName}! Звернення «${selectedType.value}» прийнято.`, "is-success");
});

feedbackForm.addEventListener("reset", () => {
    detailField.classList.remove("is-active");
    setFeedbackMessage("", "");
});

const nightPreviewButton = document.getElementById("nightPreview");
const nightStatus = document.getElementById("nightStatus");
let nightPreview = null;

function isNightTime() {
    const hour = new Date().getHours();
    return hour >= 21 || hour < 6;
}

function darkenColor(color) {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) {
        return null;
    }
    const parts = match[1].split(",").map((part) => part.trim());
    const red = Number(parts[0]);
    const green = Number(parts[1]);
    const blue = Number(parts[2]);
    const alpha = parts[3] === undefined ? "1" : parts[3];
    if (Number(alpha) === 0) {
        return null;
    }
    return `rgba(${Math.round(red * 0.6)}, ${Math.round(green * 0.6)}, ${Math.round(blue * 0.6)}, ${alpha})`;
}

function clearNightStyles() {
    const darkened = document.querySelectorAll("[data-night-darkened]");
    for (const element of darkened) {
        element.style.removeProperty("background-color");
        element.removeAttribute("data-night-darkened");
    }
}

function applyNightMode() {
    clearNightStyles();
    const night = nightPreview === null ? isNightTime() : nightPreview;
    document.body.classList.toggle("night-mode", night);
    if (night) {
        const elements = document.querySelectorAll("body, body *");
        for (const element of elements) {
            const darker = darkenColor(getComputedStyle(element).backgroundColor);
            if (darker !== null) {
                element.style.backgroundColor = darker;
                element.setAttribute("data-night-darkened", "true");
            }
        }
    }
    nightStatus.textContent = night ? "Зараз: нічний режим (21:00–06:00)" : "Зараз: денний режим";
    nightPreviewButton.textContent = night ? "Показати денний вигляд" : "Перевірити нічний режим";
}

nightPreviewButton.addEventListener("click", () => {
    const current = nightPreview === null ? isNightTime() : nightPreview;
    nightPreview = !current;
    applyNightMode();
});

window.setInterval(() => {
    if (nightPreview === null) {
        applyNightMode();
    }
}, 60000);

goToSlide(0);
showPage(pageFromHash());
applyNightMode();
startMotto();