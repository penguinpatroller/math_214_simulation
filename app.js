'use strict';

//For reading from command line
const fs = require('fs');

//To track time
const { PerformanceObserver, performance } = require('perf_hooks');

//For linear regression
const regression = require('regression');

//For math functiosn
const { create, all } = require('mathjs')
const math = create(all);
const numeric = require('numeric');
math.import(numeric, { wrap: true, silent: true });
const numbers = require('numbers');
math.import(numbers, { wrap: true, silent: true });

const initial_state_vector_with_pumpkinseed = [6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12),
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3), 8.184*Math.pow(10,3)];

const initial_state_vector_without_pumpkinseed = [6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12),
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3), 8.184*Math.pow(10,3)];

const transition_matrix_with_pumpkin_seed = [
[.6509,0,0,0,1/6,0,0],
[0,.225,0,0,1/6,0,0],
[0,0,.29922,0,1/6,0,0],
[.3491,.775,.30078,.23,0,0,0],
[0,0,0,.6377,0.5,0.4,0.4],
[0,0,0,.1323,0,0.6,0],
[0,0,.4,0,0,0,0.6]
];


/*const transition_matrix_with_pumpkin_seed = [
[.6509,0,0,0,1/6,0,0],
[0,.225,0,0,1/6,0,0],
[0,0,.29922,0,1/6,0,0],
[.3491,.775,.30078,.23,0,0,0],
[0,0,0,.6377,0.5,0.4,0.4],
[0,0,0,0.1323,0,0.6,0],
[0,0,.4,0,0,0,0.6]
];*/

console.log(math.eig(transition_matrix_with_pumpkin_seed).E.x);



const transition_matrix_without_pumpkin_seed = [
[.6509,0,0,0,1/6,0],
[0,.225,0,0,1/6,0],
[0,0,.29922,0,1/6,0],
[.3491,.775,.30078,.44,0,0],
[0,0,0,0.56,0.5,0.4],
[0,0,.4,0,0,0,0.6]
];



var t0 = performance.now();

let reg_vals = [];
let reg_index = 0;

function calculate_all_populations(matrix, weeks, vec)
{
  //Base Case
  if(weeks === 0)
  {
    return vec;
  }
  //Multipy vector by transition matrix
  const output_vector = math.multiply(matrix, vec);

  reg_vals.push([reg_index, output_vector[3]]);
  reg_index++;

  return calculate_all_populations(matrix, weeks - 1, output_vector);
}
var t1 = performance.now()

function comparePopulation(population)
{
  return Math.round((population/initial_state_vector_with_pumpkinseed[0]) * 10000)/10000;
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

exportToCsv('out.csv', reg_vals);

var population_array = calculate_all_populations(transition_matrix_with_pumpkin_seed, process.argv[2], initial_state_vector_with_pumpkinseed);
var sum = 0;
population_array.forEach( (item) =>
  sum+=item
)
console.log(`Phytoplankton Population: ${Math.floor(population_array[0]/1000000000)}B Net Change ${comparePopulation(population_array[0])}`);
console.log(`Ciliates      Population: ${Math.floor(population_array[1]/1000000000)}B Net Change ${comparePopulation(population_array[1])}`);
console.log(`Zooplankton   Population: ${Math.floor(population_array[2]/1000000000)}B Net Change ${comparePopulation(population_array[2])}`);
console.log(`Zebra Mussels Population: ${Math.floor(population_array[3]/1000000000)}B Net Change ${comparePopulation(population_array[3])}`);
console.log(`Junk          Population: ${Math.floor(population_array[4]/1000000000)}B Net Change ${comparePopulation(population_array[4])}`);
console.log(`Pumpkinseed   Population: ${Math.floor(population_array[5]/1000000000)}B Net Change ${comparePopulation(population_array[5])}`);
console.log(`Lake Herring  Population: ${Math.floor(population_array[6]/1000000000)}B Net Change ${comparePopulation(population_array[6])}`);
console.log(`Total Populations: ${Math.floor(sum)}`);
console.log(`Equation: ${regression.polynomial(reg_vals).string}`);
console.log(`R^2 value: ${regression.polynomial(reg_vals).r2}`);

console.log(`Time: ${t1 - t0}s`);
