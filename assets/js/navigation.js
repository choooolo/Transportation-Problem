
const navigation = [
    {
        title: "GETTING STARTED",
        links: [
            ["Introduction", "pages/introduction.html"],
            ["Terminologies", "pages/terminology.html"],
            ["Mathematical Formulation", "pages/formulation.html"],
            ["Transportation Table", "pages/transportation-table.html"],
            ["Balanced Problems", "pages/balanced.html"],
            ["Unbalanced Problems", "pages/unbalanced.html"]
        ]
    },
    {
        title: "INITIAL SOLUTION METHODS",
        links: [
            ["North-West Corner", "pages/methods/north-west-corner.html"],
            ["Least Cost Method", "pages/methods/least-cost.html"],
            ["Vogel's Approximation", "pages/methods/vogels-approximation.html"],
            ["Russell's Approximation", "pages/methods/russells-approximation.html"]
        ]
    },
    {
        title: "OPTIMIZATION METHODS",
        links: [
            ["Stepping Stone", "pages/methods/stepping-stone.html"],
            ["MODI / U-V Method", "pages/methods/modi.html"],
            ["Transportation Simplex", "pages/methods/transportation-simplex.html"]
        ]
    },
    {
        title: "SPECIAL CASES",
        links: [
            ["Degeneracy", "pages/special-cases/degeneracy.html"],
            ["Multiple Optimal Solutions", "pages/special-cases/multiple-optimum.html"],
            ["Maximization", "pages/special-cases/maximization.html"],
            ["Prohibited Routes", "pages/special-cases/prohibited-routes.html"],
            ["Dummy Sources / Destinations", "pages/special-cases/dummy-sources-destinations.html"]
        ]
    },
    {
        title: "PRACTICE AND TOOLS",
        links: [
            ["Interactive Solver", "pages/solver.html"],
            ["Worked Examples", "pages/examples.html"],
            ["Practice Exercises", "pages/practice.html"],
            ["Formula Reference", "pages/formulas.html"],
            ["Glossary", "pages/glossary.html"]
        ]
    }
];

const siteRoot = new URL("../../", document.currentScript.src);

function renderNavigation() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    let html = `
        <a href="${new URL("index.html", siteRoot).href}" class="sidebar-brand">
            TRANSPORTATION<br>PROBLEMS
            <small>Quantitative Methods Toolkit</small>
        </a>
    `;

    navigation.forEach(group => {
        html += `
            <div class="nav-group">
                <div class="nav-heading">${group.title}</div>
        `;

        group.links.forEach(([label, path]) => {
            html += `
                <a href="${new URL(path, siteRoot).href}" class="nav-link">
                    ${label}
                </a>
            `;
        });

        html += `</div>`;
    });

    sidebar.innerHTML = html;

    sidebar.querySelectorAll(".nav-link").forEach(link => {
        if (new URL(link.href).pathname === location.pathname) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {

    renderNavigation();

    const toggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (toggle && sidebar) {
        const isOpen = sidebar.classList.contains("open");
        toggle.type = "button";
        toggle.setAttribute("aria-controls", sidebar.id);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

        toggle.addEventListener("click", () => {
            const isOpen = sidebar.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });
    }

});
