
function solveVogel(problem) {

    const { costs, supply, demand } = problem;

    const s = [...supply];
    const d = [...demand];

    const allocation = createEmptyMatrix(s.length, d.length);
    const steps = [];

    while (
        s.some(value => value > 0) &&
        d.some(value => value > 0)
    ) {

        const penalties = [];

        // Calculate row penalties.

        for (let i = 0; i < s.length; i++) {

            if (s[i] <= 0) continue;

            const available = [];

            for (let j = 0; j < d.length; j++) {
                if (d[j] > 0) {
                    available.push({
                        cost: costs[i][j],
                        i,
                        j
                    });
                }
            }

            available.sort((a, b) => a.cost - b.cost);

            if (available.length) {

                const penalty = available.length > 1
                    ? available[1].cost - available[0].cost
                    : available[0].cost;

                penalties.push({
                    type: "row",
                    index: i,
                    penalty,
                    cheapest: available[0]
                });
            }
        }

        // Calculate column penalties.

        for (let j = 0; j < d.length; j++) {

            if (d[j] <= 0) continue;

            const available = [];

            for (let i = 0; i < s.length; i++) {
                if (s[i] > 0) {
                    available.push({
                        cost: costs[i][j],
                        i,
                        j
                    });
                }
            }

            available.sort((a, b) => a.cost - b.cost);

            if (available.length) {

                const penalty = available.length > 1
                    ? available[1].cost - available[0].cost
                    : available[0].cost;

                penalties.push({
                    type: "column",
                    index: j,
                    penalty,
                    cheapest: available[0]
                });
            }
        }

        penalties.sort((a, b) => {
            return b.penalty - a.penalty ||
                   a.cheapest.cost - b.cheapest.cost;
        });

        if (!penalties.length) {
            throw new Error("No feasible allocation remains.");
        }

        const chosen = penalties[0];

        const i = chosen.cheapest.i;
        const j = chosen.cheapest.j;

        const quantity = Math.min(s[i], d[j]);

        allocation[i][j] += quantity;

        s[i] -= quantity;
        d[j] -= quantity;

        steps.push({
            source: i,
            destination: j,
            penalty: chosen.penalty,
            quantity,
            remainingSupply: [...s],
            remainingDemand: [...d]
        });
    }

    return {
        method: "Vogel's Approximation Method",
        allocation,
        steps,
        totalCost: calculateTotalCost(costs, allocation)
    };
}
