document.getElementById("submitBtn").addEventListener("click", checkAnswers);

function checkAnswers() {
  let score = 0;
  let totalMarks = 0;

  const questions = document.querySelectorAll(".question");

  questions.forEach(q => {
    const selected = q.querySelector('input[type="radio"]:checked');
    const mark = parseInt(q.getAttribute("data-mark"));
    totalMarks += mark;

    if (selected && selected.value === "1") {
      score += mark;
    }
  });

  let percentage = ((score / totalMarks) * 100).toFixed(2);
  let msg = "";

  if (percentage >= 90) msg = "Excellent 🎉";
  else if (percentage >= 70) msg = "Good 👍";
  else msg = "Keep Practicing 💪";

  document.getElementById("result").innerHTML = `
    You scored <strong>${score}</strong> out of <strong>${totalMarks}</strong> marks<br>
    (${percentage}%)
    <br>${msg}
  `;
}
