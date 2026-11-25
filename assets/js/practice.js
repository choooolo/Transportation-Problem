
document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("checkPractice");

    if (!button) return;

    button.addEventListener("click", () => {

        const answer = Number(
            document.getElementById("practiceAnswer").value
        );

        const feedback = document.getElementById("practiceFeedback");

        if (Math.abs(answer - 4100) < 0.001) {

            feedback.textContent =
                "Correct! Your total transportation cost is 4,100.";

            feedback.style.color = "green";

        } else {

            feedback.textContent =
                "Incorrect. Multiply each allocation by its corresponding unit cost and add the results.";

            feedback.style.color = "red";

        }

    });

});
