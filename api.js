const BASE_URL = "https://your-json-server-link/questions/";

// Add Question
document.getElementById("quizForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const questionData = {
        title: document.getElementById("question").value,
        optionA: document.getElementById("optionA").value,
        optionB: document.getElementById("optionB").value,
        optionC: document.getElementById("optionC").value,
        optionD: document.getElementById("optionD").value,
        correctOption: document.getElementById("correctOption").value,
        reviewStatus: false,
    };
    await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
    });
    alert("Question Created");
    fetchQuestions();
});

// Fetch Questions
async function fetchQuestions() {
    const response = await fetch(BASE_URL);
    const questions = await response.json();
    renderQuestions(questions);
}

// Render Questions
function renderQuestions(questions) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    questions.forEach((q) => {
        const card = document.createElement("div");
        card.className = q.reviewStatus ? "reviewed" : "unreviewed";
        card.innerHTML = `
            <h3>${q.title}</h3>
            <button onclick="reviewQuestion(${q.id})">Review Question</button>
            <button onclick="deleteQuestion(${q.id})">Delete Question</button>
        `;
        container.appendChild(card);
    });
}

// Review Question
async function reviewQuestion(id) {
    if (confirm("Are you sure to review the question?")) {
        await fetch(`${BASE_URL}${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewStatus: true }),
        });
        fetchQuestions();
    }
}

// Delete Question
async function deleteQuestion(id) {
    if (confirm("Are you sure to delete?")) {
        await fetch(`${BASE_URL}${id}`, { method: "DELETE" });
        fetchQuestions();
    }
}

fetchQuestions();
