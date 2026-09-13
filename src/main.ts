import { type Problem, type Topic, type Difficulty } from "./types.js";
import { initialProblems } from "./data.js";

const problemsList: Problem[] = [...initialProblems];

const grid = document.getElementById("problems-grid") as HTMLDivElement;
const filterTopic = document.getElementById("filter-topic") as HTMLSelectElement;
const filterDifficulty = document.getElementById("filter-difficulty") as HTMLSelectElement;
const filterSource = document.getElementById("filter-source") as HTMLSelectElement;

const form = document.getElementById("suggest-form") as HTMLFormElement;
const inputName = document.getElementById("problem-name") as HTMLInputElement;
const inputLink = document.getElementById("problem-link") as HTMLInputElement;
const selectTopic = document.getElementById("form-topic") as HTMLSelectElement;
const selectDiff = document.getElementById("form-difficulty") as HTMLSelectElement;
const textDesc = document.getElementById("problem-desc") as HTMLTextAreaElement;
const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
const successBanner = document.getElementById("form-success") as HTMLDivElement;

const errorName = document.getElementById("error-name") as HTMLSpanElement;
const errorLink = document.getElementById("error-link") as HTMLSpanElement;
const errorTopic = document.getElementById("error-topic") as HTMLSpanElement;
const errorDiff = document.getElementById("error-difficulty") as HTMLSpanElement;
const errorDesc = document.getElementById("error-desc") as HTMLSpanElement;

function detectSource(url: string): string {
    const lower = url.toLowerCase();
    if (lower.includes("codeforces.com")) return "Codeforces";
    if (lower.includes("cses.fi")) return "CSES";
    if (lower.includes("atcoder.jp")) return "AtCoder";
    return "Community";
}

function getPlatformIcon(source: string): string {
    const icons: Record<string, { src: string; alt: string }> = {
        Codeforces: {
            src: "./assets/icons/codeforces.svg",
            alt: "Codeforces online judge icon"
        },
        CSES: {
            src: "./assets/icons/cses.png",
            alt: "CSES problem set official wooden logo"
        },
        AtCoder: {
            src: "./assets/icons/atcoder.svg",
            alt: "AtCoder contest platform icon"
        },
        Community: {
            src: "./assets/icons/community.svg",
            alt: "Community contribution problem icon"
        }
    };

    const iconData = icons[source] || icons.Community;
    return `<img src="${iconData!.src}" alt="${iconData!.alt}" class="platform-icon" width="16" height="16" loading="lazy">`;
}

function renderProblems(items: Problem[]): void {
    grid.innerHTML = "";

    if (items.length === 0) {
        grid.innerHTML = `<p class="empty-catalog">No problems match the selected filters.</p>`;
        return;
    }

    items.forEach((p) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
      <div>
        <div class="card-header">
          <h3 class="card-title">${p.name}</h3>
        </div>
        <div class="badges">
          <span class="badge badge-${p.topic}">${p.topic}</span>
          <span class="badge badge-${p.difficulty}">${p.difficulty}</span>
        </div>
        <p class="card-description">${p.description}</p>
      </div>
      <div class="card-footer">
        <span class="platform-tag">
            ${getPlatformIcon(p.source)}
            <span>${p.source}</span>
        </span>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="card-link" aria-label="View problem ${p.name} on external judge">
            View Problem &rarr;
        </a>
      </div>
    `;
        grid.appendChild(card);

        const descEl = card.querySelector(".card-description") as HTMLParagraphElement;
        if (descEl && descEl.scrollHeight > descEl.clientHeight) {
            descEl.classList.add("is-overflowing");
        }
    });
}

function applyFilters(): void {
    const selectedTopic = filterTopic.value;
    const selectedDiff = filterDifficulty.value;
    const selectedSource = filterSource ? filterSource.value : "all";

    const filtered = problemsList.filter((p) => {
        const matchesTopic = selectedTopic === "all" || p.topic === selectedTopic;
        const matchesDiff = selectedDiff === "all" || p.difficulty === selectedDiff;
        const matchesSource = selectedSource === "all" || p.source.toLowerCase() === selectedSource.toLowerCase();
        return matchesTopic && matchesDiff && matchesSource;
    });

    renderProblems(filtered);
}

function clearErrors(): void {
    errorName.textContent = "";
    errorLink.textContent = "";
    errorTopic.textContent = "";
    errorDiff.textContent = "";
    errorDesc.textContent = "";
}

function isValidHttpUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

filterTopic.addEventListener("change", applyFilters);
filterDifficulty.addEventListener("change", applyFilters);
if (filterSource) {
    filterSource.addEventListener("change", applyFilters);
}

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    clearErrors();
    successBanner.hidden = true;

    let isValid = true;

    if (!inputName.value.trim()) {
        errorName.textContent = "Problem name is required.";
        isValid = false;
    }

    if (!inputLink.value.trim()) {
        errorLink.textContent = "Problem URL is required.";
        isValid = false;
    } else if (!isValidHttpUrl(inputLink.value.trim())) {
        errorLink.textContent = "Enter a valid URL (e.g. https://...).";
        isValid = false;
    }

    if (!selectTopic.value) {
        errorTopic.textContent = "Please select a topic.";
        isValid = false;
    }

    if (!selectDiff.value) {
        errorDiff.textContent = "Please select a difficulty level.";
        isValid = false;
    }

    if (textDesc.value.trim().length < 20) {
        errorDesc.textContent = "Description must contain at least 20 characters.";
        isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    setTimeout(() => {
        const cleanLink = inputLink.value.trim();
        const newProblem: Problem = {
            id: problemsList.length + 1,
            name: inputName.value.trim(),
            topic: selectTopic.value as Topic,
            difficulty: selectDiff.value as Difficulty,
            source: detectSource(cleanLink),
            year: new Date().getFullYear(),
            link: cleanLink,
            description: textDesc.value.trim()
        };

        problemsList.unshift(newProblem);
        applyFilters();

        form.reset();
        successBanner.hidden = false;

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Problem";

        setTimeout(() => {
            successBanner.hidden = true;
        }, 3000);
    }, 1000);
});

renderProblems(problemsList);

// --- Theme Management ---
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const themeStatus = document.getElementById("theme-status") as HTMLSpanElement;

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme): void {
    document.documentElement.setAttribute("data-theme", theme);
    themeStatus.textContent = theme;
}

document.body.classList.add("preload");

let currentTheme: Theme = getPreferredTheme();
applyTheme(currentTheme);

requestAnimationFrame(() => {
    document.body.classList.remove("preload");
});

themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
});

window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
        currentTheme = e.matches ? "light" : "dark";
        applyTheme(currentTheme);
    }
});