document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "empher@gmail.com" && password === "empher@123") {
        alert("Login Success, you are redirecting to quiz page");
        window.location.href = "quiz.html";
    } else {
        alert("Invalid Credentials");
    }
});
const baseUrl = "https://your-json-server-url/questions/";

// Quiz page
const quizForm = document.getElementById("quiz-form");
const questionsContainer = document.getElementById("questions-container");

quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const questionData = {
        title: document.getElementById("question").value,
        optionA: document.getElementById("optionA").value,
        optionB: document.getElementById("optionB").value,
        optionC: document.getElementById("optionC").value,
        optionD: document.getElementById("optionD").value,
        correctOption: document.getElementById("correctOption").value,
        reviewStatus: false,
    };

    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
    });
    alert("Question Created");
    loadQuestions();
});

async function loadQuestions() {
    const res = await fetch(baseUrl);
    const questions = await res.json();
    questionsContainer.innerHTML = questions
        .map(
            (q) => `
        <div class="question-card" style="border: 2px solid ${q.reviewStatus ? "violet" : "blue"};">
            <h3>${q.title}</h3>
            <p>A: ${q.optionA}, B: ${q.optionB}, C: ${q.optionC}, D: ${q.optionD}</p>
            <button onclick="reviewQuestion(${q.id})">Review Question</button>
            <button onclick="deleteQuestion(${q.id})">Delete Question</button>
        </div>
    `
        )
        .join("");
}

async function reviewQuestion(id) {
    if (confirm("Are you sure to review the question?")) {
        await fetch(`${baseUrl}${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewStatus: true }),
        });
        loadQuestions();
    }
}

async function deleteQuestion(id) {
    if (confirm("Are you sure to delete?")) {
        await fetch(`${baseUrl}${id}`, { method: "DELETE" });
        loadQuestions();
    }
}

if (questionsContainer) loadQuestions();

// Reviewed Questions Page
const reviewedQuestionsContainer = document.getElementById("reviewed-questions-container");
async function loadReviewedQuestions() {
    const res = await fetch(baseUrl);
    const questions = await res.json();
    reviewedQuestionsContainer.innerHTML = questions
        .filter((q) => q.reviewStatus)
        .map(
            (q) => `
        <div class="question-card">
            <h3>${q.title}</h3>
            <p>A: ${q.optionA}, B: ${q.optionB}, C: ${q.optionC}, D: ${q.optionD}</p>
        </div>
    `
        )
        .join("");
}
if (reviewedQuestionsContainer) loadReviewedQuestions();
