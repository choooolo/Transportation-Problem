
const TransportationSimplex = {

    getBasicCells(allocation) {

        const cells = [];

        allocation.forEach((row, i) => {

            row.forEach((quantity, j) => {

                if (quantity > 0) {
                    cells.push({ i, j, quantity });
                }

            });

        });

        return cells;
    },

    getRequiredBasisSize(rows, columns) {
        return rows + columns - 1;
    },

    checkDegeneracy(allocation) {

        const rows = allocation.length;
        const columns = allocation[0].length;

        const basicCells = this.getBasicCells(allocation);

        return {
            actual: basicCells.length,
            required: this.getRequiredBasisSize(rows, columns),
            degenerate: basicCells.length < rows + columns - 1
        };
    },

    calculateReducedCost(cost, u, v) {
        return cost - u - v;
    }

};
