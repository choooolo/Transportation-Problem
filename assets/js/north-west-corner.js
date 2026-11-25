
function solveNorthWestCorner(problem) {

    const { costs, supply, demand } = problem;

    const s = [...supply];
    const d = [...demand];

    const allocation = createEmptyMatrix(s.length, d.length);
    const steps = [];

    let i = 0;
    let j = 0;

    while (i < s.length && j < d.length) {

        const quantity = Math.min(s[i], d[j]);

        if (quantity > 0) {

            allocation[i][j] = quantity;

            steps.push({
                source: i,
                destination: j,
                quantity,
                remainingSupply: [...s],
                remainingDemand: [...d]
            });

            s[i] -= quantity;
            d[j] -= quantity;
        }

        const supplyFinished = Math.abs(s[i]) < 1e-9;
        const demandFinished = Math.abs(d[j]) < 1e-9;

        if (supplyFinished && demandFinished) {
            i++;
            j++;
        } else if (supplyFinished) {
            i++;
        } else if (demandFinished) {
            j++;
        } else {
            break;
        }
    }

    return {
        method: "North-West Corner Method",
        allocation,
        steps,
        totalCost: calculateTotalCost(costs, allocation),
        remainingSupply: s,
        remainingDemand: d
    };
}
