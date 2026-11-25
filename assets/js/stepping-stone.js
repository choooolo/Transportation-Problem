
function calculateSteppingStoneIndex(costs, loop) {

    let improvementIndex = 0;

    loop.forEach(([i, j], index) => {

        if (index % 2 === 0) {
            improvementIndex += costs[i][j];
        } else {
            improvementIndex -= costs[i][j];
        }

    });

    return improvementIndex;
}

function getSteppingStoneAdjustment(allocation, loop) {

    let theta = Infinity;

    loop.forEach(([i, j], index) => {

        if (index % 2 === 1) {
            theta = Math.min(theta, allocation[i][j]);
        }

    });

    return theta;
}

function applySteppingStoneLoop(allocation, loop) {

    const result = cloneMatrix(allocation);

    const theta = getSteppingStoneAdjustment(result, loop);

    loop.forEach(([i, j], index) => {

        if (index % 2 === 0) {
            result[i][j] += theta;
        } else {
            result[i][j] -= theta;
        }

        if (Math.abs(result[i][j]) < 1e-9) {
            result[i][j] = 0;
        }

    });

    return {
        allocation: result,
        adjustment: theta
    };
}
