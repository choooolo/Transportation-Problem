
const TransportationCore = {

    validate(costs, supply, demand) {

        if (!costs.length || !costs[0].length) {
            throw new Error("Transportation matrix cannot be empty.");
        }

        if (costs.length !== supply.length) {
            throw new Error("Supply count does not match source count.");
        }

        if (costs[0].length !== demand.length) {
            throw new Error("Demand count does not match destination count.");
        }

        if (costs.some(row => row.length !== demand.length)) {
            throw new Error("Transportation matrix must be rectangular.");
        }

        if ([...supply, ...demand].some(v => !Number.isFinite(v) || v < 0)) {
            throw new Error("Supply and demand must be non-negative numbers.");
        }

        if (costs.some(row => row.some(v => !Number.isFinite(v) || v < 0))) {
            throw new Error("Costs must be non-negative numbers.");
        }

        return true;
    },

    balance(costs, supply, demand) {

        costs = cloneMatrix(costs);
        supply = [...supply];
        demand = [...demand];

        const totalSupply = supply.reduce((a, b) => a + b, 0);
        const totalDemand = demand.reduce((a, b) => a + b, 0);

        let status = "Balanced";

        if (totalSupply > totalDemand) {

            const difference = totalSupply - totalDemand;

            costs.forEach(row => row.push(0));
            demand.push(difference);

            status = "Supply exceeds demand";

        } else if (totalDemand > totalSupply) {

            const difference = totalDemand - totalSupply;

            costs.push(Array(demand.length).fill(0));
            supply.push(difference);

            status = "Demand exceeds supply";
        }

        return {
            costs,
            supply,
            demand,
            totalSupply,
            totalDemand,
            status
        };
    },

    emptyAllocation(rows, columns) {
        return createEmptyMatrix(rows, columns);
    },

    allocate(allocation, supply, demand, i, j) {

        const quantity = Math.min(supply[i], demand[j]);

        if (quantity <= 0) return 0;

        allocation[i][j] += quantity;

        supply[i] -= quantity;
        demand[j] -= quantity;

        return quantity;
    },

    checkFeasibility(allocation, supply, demand) {

        for (let i = 0; i < supply.length; i++) {

            const rowTotal = allocation[i].reduce((a, b) => a + b, 0);

            if (Math.abs(rowTotal - supply[i]) > 1e-9) {
                return false;
            }
        }

        for (let j = 0; j < demand.length; j++) {

            let columnTotal = 0;

            for (let i = 0; i < allocation.length; i++) {
                columnTotal += allocation[i][j];
            }

            if (Math.abs(columnTotal - demand[j]) > 1e-9) {
                return false;
            }
        }

        return true;
    },

    totalCost(costs, allocation) {
        return calculateTotalCost(costs, allocation);
    }

};
