
document.addEventListener("DOMContentLoaded", () => {

    const sources = document.getElementById("sources");
    const destinations = document.getElementById("destinations");

    const matrix = document.getElementById("matrixInputs");

    const generateButton = document.getElementById("generateTable");
    const solveButton = document.getElementById("solveButton");
    const loadExample = document.getElementById("loadExample");
    const resetButton = document.getElementById("resetButton");

    function generateMatrix(defaults = false) {

        const m = Math.max(1, Math.min(8, Number(sources.value)));
        const n = Math.max(1, Math.min(8, Number(destinations.value)));

        let html = `
            <div class="table-wrapper">
            <table class="matrix-table">
                <tr>
                    <th>From / To</th>
        `;

        for (let j = 0; j < n; j++) {
            html += `
                <th>
                    Destination ${j + 1}
                    <input
                        class="matrix-input"
                        data-demand="${j}"
                        type="number"
                        min="0"
                        value="${defaults ? [300,200,200][j] || 100 : 100}"
                    >
                </th>
            `;
        }

        html += `<th>Supply</th></tr>`;

        for (let i = 0; i < m; i++) {

            html += `<tr><th>Source ${i + 1}</th>`;

            for (let j = 0; j < n; j++) {

                const sample = [
                    [5,4,3],
                    [8,4,3],
                    [9,7,5]
                ];

                const value = defaults
                    ? sample[i]?.[j] ?? 4
                    : 1;

                html += `
                    <td>
                        <input
                            class="matrix-input"
                            data-cost="${i},${j}"
                            type="number"
                            min="0"
                            value="${value}"
                        >
                    </td>
                `;
            }

            html += `
                <td>
                    <input
                        class="matrix-input"
                        data-supply="${i}"
                        type="number"
                        min="0"
                        value="${defaults ? [100,300,300][i] ?? 100 : 100}"
                    >
                </td>
            </tr>`;
        }

        html += `</table></div>`;

        matrix.innerHTML = html;

    }

    function getData() {

        const m = Number(sources.value);
        const n = Number(destinations.value);

        const costs = [];
        const supply = [];
        const demand = [];

        for (let i = 0; i < m; i++) {

            const row = [];

            for (let j = 0; j < n; j++) {

                row.push(
                    Number(matrix.querySelector(
                        `[data-cost="${i},${j}"]`
                    ).value)
                );

            }

            costs.push(row);

            supply.push(
                Number(matrix.querySelector(
                    `[data-supply="${i}"]`
                ).value)
            );

        }

        for (let j = 0; j < n; j++) {

            demand.push(
                Number(matrix.querySelector(
                    `[data-demand="${j}"]`
                ).value)
            );

        }

        return { costs, supply, demand };

    }

    generateButton.addEventListener("click", () => generateMatrix());

    loadExample.addEventListener("click", () => {
        sources.value = 3;
        destinations.value = 3;
        generateMatrix(true);
    });

    resetButton.addEventListener("click", () => {
        sources.value = 3;
        destinations.value = 3;
        generateMatrix(true);
        document.getElementById("output").innerHTML = "";
        document.getElementById("problemStatus").innerHTML = "";
    });

    solveButton.addEventListener("click", () => {

        try {

            const data = getData();

            TransportationCore.validate(
                data.costs,
                data.supply,
                data.demand
            );

            const problem = TransportationCore.balance(
                data.costs,
                data.supply,
                data.demand
            );

            if (problem.status !== "Balanced") {

                document.getElementById("problemStatus").innerHTML = `
                    <div class="callout warning">
                        <b>Unbalanced Transportation Problem</b>
                        <p>${problem.status}</p>
                        <p>Total supply: ${problem.totalSupply}</p>
                        <p>Total demand: ${problem.totalDemand}</p>
                        <p>The system automatically added a dummy row or column.</p>
                    </div>
                `;

            } else {

                document.getElementById("problemStatus").innerHTML = `
                    <div class="callout success">
                        <b>Balanced Transportation Problem</b>
                        <p>Total supply equals total demand.</p>
                    </div>
                `;

            }

            const method = document.getElementById("method").value;

            let result;

            if (method === "nw") {
                result = solveNorthWestCorner(problem);
            }

            if (method === "lc") {
                result = solveLeastCost(problem);
            }

            if (method === "vam") {
                result = solveVogel(problem);
            }

            if (method === "ram") {
                result = solveRussell(problem);
            }

            if (method === "modi") {

                const initial = solveLeastCost(problem);

                const optimized = solveMODI(
                    problem,
                    initial.allocation
                );

                if (!optimized.optimal) {
                    throw new Error(
                        optimized.error || "MODI could not confirm optimality."
                    );
                }

                result = {
                    method: "Least Cost + MODI",
                    allocation: optimized.allocation,
                    steps: initial.steps,
                    totalCost: optimized.totalCost,
                    history: optimized.history,
                    optimal: true
                };

            }

            displayResult(result, problem);

        } catch (error) {

            document.getElementById("output").innerHTML = `
                <div class="callout warning">
                    <b>Unable to solve:</b> ${error.message}
                </div>
            `;

        }

    });

    generateMatrix(true);

});

function displayResult(result, problem) {

    const output = document.getElementById("output");

    let html = `
        <div class="panel">
            <h2>${result.method}</h2>

            <h3>Final Allocation Table</h3>

            ${createTransportationTable(
                problem.costs,
                problem.supply,
                problem.demand,
                result.allocation
            )}

            <div class="solver-result">
                <h3>Total Transportation Cost</h3>
                <h2>${formatNumber(result.totalCost)}</h2>
                ${result.optimal ? "<b>Optimality confirmed by MODI.</b>" : "Initial feasible solution; optimality has not been established."}
            </div>
        </div>
    `;

    html += `<h2>Step-by-Step Solution</h2>`;

    result.steps.forEach((step, index) => {

        html += `
            <div class="allocation-step">
                <h4>Step ${index + 1}</h4>

                <p>
                    Allocate <b>${step.quantity}</b> units
                    from Source ${step.source + 1}
                    to Destination ${step.destination + 1}.
                </p>

                <p>
                    Remaining supply:
                    ${step.remainingSupply.join(", ")}
                </p>

                <p>
                    Remaining demand:
                    ${step.remainingDemand.join(", ")}
                </p>
            </div>
        `;

    });

    if (result.history) {

        html += `<h2>MODI Calculations</h2>`;

        result.history.forEach(iteration => {

            html += `
                <div class="allocation-step">
                    <h4>Iteration ${iteration.iteration}</h4>

                    <p>U values: ${iteration.u.join(", ")}</p>
                    <p>V values: ${iteration.v.join(", ")}</p>

                    <div class="table-wrapper">
                        <table>
                            <tr>
                                <th>Cell</th>
                                <th>Reduced Cost</th>
                            </tr>

                            ${iteration.reducedCosts.map(cell => `
                                <tr>
                                    <td>${cell.i + 1}, ${cell.j + 1}</td>
                                    <td>${cell.delta}</td>
                                </tr>
                            `).join("")}
                        </table>
                    </div>
                </div>
            `;

        });

    }

    output.innerHTML = html;

}
