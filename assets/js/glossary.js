
document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("glossarySearch");

    if (!search) return;

    search.addEventListener("input", () => {

        const query = search.value.toLowerCase();

        document.querySelectorAll(".term").forEach(term => {

            const text = term.textContent.toLowerCase();

            term.style.display = text.includes(query)
                ? ""
                : "none";

        });

    });

});
