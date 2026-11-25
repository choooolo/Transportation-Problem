
function solveMODI(problem, initialAllocation) {

    const costs = problem.costs;
    const allocation = cloneMatrix(initialAllocation);

    const m = costs.length;
    const n = costs[0].length;

    const history = [];

    function calculatePotentials() {

        const u = Array(m).fill(null);
        const v = Array(n).fill(null);

        u[0] = 0;

        let changed = true;

        while (changed) {

            changed = false;

            for (let i = 0; i < m; i++) {

                for (let j = 0; j < n; j++) {

                    if (allocation[i][j] > 0) {

                        if (u[i] !== null && v[j] === null) {

                            v[j] = costs[i][j] - u[i];
                            changed = true;

                        } else if (v[j] !== null && u[i] === null) {

                            u[i] = costs[i][j] - v[j];
                            changed = true;
                        }
                    }
                }
            }
        }

        return { u, v };
    }

    function findClosedLoop(startI, startJ) {

        const path = [[startI, startJ]];

        function search(i, j, horizontal) {

            const limit = horizontal ? n : m;

            for (let k = 0; k < limit; k++) {

                const ni = horizontal ? i : k;
                const nj = horizontal ? k : j;

                if (ni === i && nj === j) continue;

                const isStart = ni === startI && nj === startJ;

                if (!isStart && allocation[ni][nj] <= 0) continue;

                if (isStart && path.length >= 4) {
                    return [...path, [ni, nj]];
                }

                if (path.some(([x, y]) => x === ni && y === nj)) {
                    continue;
                }

                path.push([ni, nj]);

                const result = search(ni, nj, !horizontal);

                if (result) return result;

                path.pop();
            }

            return null;
        }

        return search(startI, startJ, true) ||
               search(startI, startJ, false);
    }

    for (let iteration = 0; iteration < 100; iteration++) {

        const { u, v } = calculatePotentials();

        if (u.some(x => x === null) || v.some(x => x === null)) {
            return {
                allocation,
                optimal: false,
                error: "The basis is disconnected or degenerate. Complete the independent basis before using MODI."
            };
        }

        const reducedCosts = [];

        let entering = null;

        for (let i = 0; i < m; i++) {

            for (let j = 0; j < n; j++) {

                if (allocation[i][j] === 0) {

                    const delta = costs[i][j] - u[i] - v[j];

                    reducedCosts.push({ i, j, delta });

                    if (!entering || delta < entering.delta) {
                        entering = { i, j, delta };
                    }
                }
            }
        }

        history.push({
            iteration: iteration + 1,
            u: [...u],
            v: [...v],
            reducedCosts
        });

        if (!entering || entering.delta >= 0) {

            return {
                allocation,
                optimal: true,
                history,
                totalCost: calculateTotalCost(costs, allocation)
            };
        }

        const loop = findClosedLoop(entering.i, entering.j);

        if (!loop) {

            return {
                allocation,
                optimal: false,
                error: "A valid closed loop could not be constructed.",
                history
            };
        }

        // First cell is positive.
        // Subsequent cells alternate minus and plus.

        let theta = Infinity;

        for (let k = 1; k < loop.length - 1; k += 2) {

            const [i, j] = loop[k];

            theta = Math.min(theta, allocation[i][j]);
        }

        if (!Number.isFinite(theta)) {
            return {
                allocation,
                optimal: false,
                error: "Invalid loop adjustment."
            };
        }

        for (let k = 0; k < loop.length - 1; k++) {

            const [i, j] = loop[k];

            if (k % 2 === 0) {
                allocation[i][j] += theta;
            } else {
                allocation[i][j] -= theta;
            }

            if (Math.abs(allocation[i][j]) < 1e-9) {
                allocation[i][j] = 0;
            }
        }
    }

    return {
        allocation,
        optimal: false,
        error: "Maximum optimization iterations reached."
    };
}
