import { type Problem, type Topic, type Difficulty } from "./types.js";
import { initialProblems } from "./data.js";

const problemsList: Problem[] = [...initialProblems];

const grid = document.getElementById("problems-grid") as HTMLDivElement;
const filterTopic = document.getElementById("filter-topic") as HTMLSelectElement;
const filterDifficulty = document.getElementById("filter-difficulty") as HTMLSelectElement;

const form = document.getElementById("suggest-form") as HTMLFormElement;
const inputName = document.getElementById("problem-name") as HTMLInputElement;
const inputLink = document.getElementById("problem-link") as HTMLInputElement;
const selectTopic = document.getElementById("form-topic") as HTMLSelectElement;
const selectDiff = document.getElementById("form-difficulty") as HTMLSelectElement;
const textDesc = document.getElementById("problem-desc") as HTMLTextAreaElement;
const successBanner = document.getElementById("form-success") as HTMLDivElement;

const errorName = document.getElementById("error-name") as HTMLSpanElement;
const errorLink = document.getElementById("error-link") as HTMLSpanElement;
const errorTopic = document.getElementById("error-topic") as HTMLSpanElement;
const errorDiff = document.getElementById("error-difficulty") as HTMLSpanElement;
const errorDesc = document.getElementById("error-desc") as HTMLSpanElement;

function renderProblems(items: Problem[]): void {
    grid.innerHTML = "";

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No problems match the selected filters.</p>`;
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
        <span>${p.source} (${p.year})</span>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="card-link">View Problem &rarr;</a>
      </div>
    `;
        grid.appendChild(card);
    });
}

function applyFilters(): void {
    const selectedTopic = filterTopic.value;
    const selectedDiff = filterDifficulty.value;

    const filtered = problemsList.filter((p) => {
        const matchesTopic = selectedTopic === "all" || p.topic === selectedTopic;
        const matchesDiff = selectedDiff === "all" || p.difficulty === selectedDiff;
        return matchesTopic && matchesDiff;
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
        errorLink.textContent = "Problem link is required.";
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

    const newProblem: Problem = {
        id: problemsList.length + 1,
        name: inputName.value.trim(),
        topic: selectTopic.value as Topic,
        difficulty: selectDiff.value as Difficulty,
        source: "Community",
        year: new Date().getFullYear(),
        link: inputLink.value.trim(),
        description: textDesc.value.trim()
    };

    problemsList.unshift(newProblem);
    applyFilters();

    form.reset();
    successBanner.hidden = false;
});

renderProblems(problemsList);