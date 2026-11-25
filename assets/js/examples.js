
const exampleProblems = [

    {
        name: "Balanced Transportation Example",

        costs: [
            [5, 4, 3],
            [8, 4, 3],
            [9, 7, 5]
        ],

        supply: [100, 300, 300],

        demand: [300, 200, 200]
    },

    {
        name: "Supply Exceeds Demand",

        costs: [
            [4, 6],
            [3, 5]
        ],

        supply: [400, 400],

        demand: [300, 300]
    },

    {
        name: "Demand Exceeds Supply",

        costs: [
            [5, 8],
            [6, 4]
        ],

        supply: [250, 250],

        demand: [300, 400]
    }

];

function getExample(index) {

    if (!exampleProblems[index]) {
        throw new Error("Example not found.");
    }

    return JSON.parse(JSON.stringify(exampleProblems[index]));

}
