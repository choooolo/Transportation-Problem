
function solveLeastCost(problem) {

    const { costs, supply, demand } = problem;

    const s = [...supply];
    const d = [...demand];

    const allocation = createEmptyMatrix(s.length, d.length);
    const steps = [];

    while (
        s.some(value => value > 0) &&
        d.some(value => value > 0)
    ) {

        let selected = null;

        for (let i = 0; i < s.length; i++) {

            for (let j = 0; j < d.length; j++) {

                if (s[i] <= 0 || d[j] <= 0) continue;

                const candidate = {
                    i,
                    j,
                    cost: costs[i][j],
                    quantity: Math.min(s[i], d[j])
                };

                if (
                    selected === null ||
                    candidate.cost < selected.cost ||
                    (
                        candidate.cost === selected.cost &&
                        candidate.quantity > selected.quantity
                    )
                ) {
                    selected = candidate;
                }
            }
        }

        if (!selected) {
            throw new Error("No available route for remaining supply and demand.");
        }

        const { i, j, cost, quantity } = selected;

        allocation[i][j] += quantity;

        s[i] -= quantity;
        d[j] -= quantity;

        steps.push({
            source: i,
            destination: j,
            cost,
            quantity,
            remainingSupply: [...s],
            remainingDemand: [...d]
        });
    }

    return {
        method: "Least Cost Method",
        allocation,
        steps,
        totalCost: calculateTotalCost(costs, allocation)
    };
}
