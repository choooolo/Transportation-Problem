
function formatNumber(value) {
    return Number(value).toLocaleString("en-PH", {
        maximumFractionDigits: 2
    });
}

function calculateTotalCost(costs, allocations) {
    let total = 0;

    for (let i = 0; i < allocations.length; i++) {
        for (let j = 0; j < allocations[i].length; j++) {
            total += costs[i][j] * allocations[i][j];
        }
    }

    return total;
}

function cloneMatrix(matrix) {
    return matrix.map(row => [...row]);
}

function createEmptyMatrix(rows, columns) {
    return Array.from(
        { length: rows },
        () => Array(columns).fill(0)
    );
}

function createTransportationTable(costs, supply, demand, allocations = null) {

    let html = `
        <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>From / To</th>
    `;

    for (let j = 0; j < demand.length; j++) {
        html += `<th>${String.fromCharCode(65 + j)}</th>`;
    }

    html += `<th>Supply</th></tr></thead><tbody>`;

    for (let i = 0; i < supply.length; i++) {

        html += `<tr><th>${String.fromCharCode(68 + i)}</th>`;

        for (let j = 0; j < demand.length; j++) {

            const allocation = allocations
                ? allocations[i][j]
                : 0;

            html += `
                <td class="${allocation > 0 ? "allocated" : ""}">
                    ${costs[i][j]}
                    ${allocation > 0 ? `<br><b>${allocation}</b>` : ""}
                </td>
            `;
        }

        html += `<td><b>${supply[i]}</b></td></tr>`;
    }

    html += `<tr><th>Demand</th>`;

    demand.forEach(value => {
        html += `<th>${value}</th>`;
    });

    html += `<th>${supply.reduce((a, b) => a + b, 0)}</th></tr>`;

    html += `</tbody></table></div>`;

    return html;
}

function showMessage(element, message, type = "info") {

    const colors = {
        info: "#eff6ff",
        success: "#f0fdf4",
        error: "#fef2f2"
    };

    element.innerHTML = `
        <div style="
            padding:15px;
            background:${colors[type]};
            border-radius:8px;
            margin:15px 0;
        ">
            ${message}
        </div>
    `;
}
