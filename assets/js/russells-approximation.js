
function solveRussell(problem) {

    const { costs, supply, demand } = problem;

    const s = [...supply];
    const d = [...demand];

    const allocation = createEmptyMatrix(s.length, d.length);
    const steps = [];

    while (
        s.some(value => value > 0) &&
        d.some(value => value > 0)
    ) {

        const rowMax = s.map((value, i) => {

            if (value <= 0) return null;

            return Math.max(
                ...costs[i].filter((_, j) => d[j] > 0)
            );
        });

        const colMax = d.map((value, j) => {

            if (value <= 0) return null;

            return Math.max(
                ...costs.map((row, i) => row[j])
                    .filter((_, i) => s[i] > 0)
            );
        });

        let selected = null;

        for (let i = 0; i < s.length; i++) {

            for (let j = 0; j < d.length; j++) {

                if (s[i] <= 0 || d[j] <= 0) continue;

                const delta =
                    costs[i][j] - rowMax[i] - colMax[j];

                if (!selected || delta < selected.delta) {
                    selected = { i, j, delta };
                }
            }
        }

        if (!selected) {
            throw new Error("No feasible allocation remains.");
        }

        const { i, j, delta } = selected;

        const quantity = Math.min(s[i], d[j]);

        allocation[i][j] += quantity;

        s[i] -= quantity;
        d[j] -= quantity;

        steps.push({
            source: i,
            destination: j,
            delta,
            quantity,
            remainingSupply: [...s],
            remainingDemand: [...d]
        });
    }

    return {
        method: "Russell's Approximation Method",
        allocation,
        steps,
        totalCost: calculateTotalCost(costs, allocation)
    };
}
