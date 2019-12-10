'use strict';

//For reading from command line
const fs = require('fs');

//For outputting to csv file
const ObjectsToCsv = require('objects-to-csv');

//To track time
const { PerformanceObserver, performance } = require('perf_hooks');
var t0 = performance.now();

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
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3)];

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

//console.log(math.eig(transition_matrix_with_pumpkin_seed).E.x);



const transition_matrix_without_pumpkin_seed = [
[.6509,0,0,0,1/6,0],
[0,.225,0,0,1/6,0],
[0,0,.29922,0,1/6,0],
[.3491,.775,.30078,.44,0,0],
[0,0,0,0.56,0.5,0.4],
[0,0,.4,0,0,0.6]
];




var reg_vals = [];
var reg_index = 0;


function calculate_all_populations(matrix, weeks, vec)
{
  //Base Case
  if(weeks === 0)
  {
    return vec;
  }
  //Multipy vector by transition matrix
  const output_vector = math.multiply(matrix, vec);
  reg_vals.push(
    {"week": reg_index, "Phytoplankton Population": output_vector[0],
    "Ciliate Population": output_vector[1],
    "Zooplankton Population": output_vector[2],
    "Zebra Mussel Population": output_vector[3],
    "Junk": output_vector[4],
    "Pumpkinseed Population": output_vector[5],
    "Lake Herring": output_vector[6],
});
  reg_index++;

  return calculate_all_populations(matrix, weeks - 1, output_vector);
}

function comparePopulation(population, in_vec)
{
  return Math.round((population/in_vec * 10000))/10000;
}

var population_array = calculate_all_populations(transition_matrix_with_pumpkin_seed, process.argv[2], initial_state_vector_with_pumpkinseed);
new ObjectsToCsv(reg_vals).toDisk('./populations.csv');

var population_array_original = calculate_all_populations(transition_matrix_without_pumpkin_seed, process.argv[2], initial_state_vector_without_pumpkinseed);

console.log(`Original Matrix`);
console.log(`Phytoplankton Population: ${Math.floor(population_array_original[0]/1000000000)}B Scalar Change ${comparePopulation(population_array_original[0], initial_state_vector_without_pumpkinseed[0], 0)}`);
console.log(`Ciliates      Population: ${Math.floor(population_array_original[1]/1000000000)}B Scalar Change ${comparePopulation(population_array_original[1], initial_state_vector_without_pumpkinseed[1], 1)}`);
console.log(`Zooplankton   Population: ${Math.floor(population_array_original[2]/1000000000)}B Scalar Change ${comparePopulation(population_array_original[2], initial_state_vector_without_pumpkinseed[2], 2)}`);
console.log(`Zebra Mussels Population: ${Math.floor(population_array_original[3]/1000000000)}B Scalar Change ${comparePopulation(population_array_original[3], initial_state_vector_without_pumpkinseed[3], 3)}`);
console.log(`Junk          Population: ${Math.floor(population_array_original[4]/1000000000)}B Scalar Change N/A`);
console.log(`Lake Herring  Population: ${Math.floor(population_array_original[5]/1000000000)}B Scalar Change ${comparePopulation(population_array_original[5], initial_state_vector_without_pumpkinseed[5], 5)}`);
for(var i = 0; i < 5; i++)
{
  console.log('.........................................................');
}

console.log(`Solution Matrix`);
console.log(`Phytoplankton Population: ${Math.floor(population_array[0]/1000000000)}B Scalar Change ${comparePopulation(population_array[0], initial_state_vector_with_pumpkinseed[0], 0)}`);
console.log(`Ciliates      Population: ${Math.floor(population_array[1]/1000000000)}B Scalar Change ${comparePopulation(population_array[1], initial_state_vector_with_pumpkinseed[1], 1)}`);
console.log(`Zooplankton   Population: ${Math.floor(population_array[2]/1000000000)}B Scalar Change ${comparePopulation(population_array[2], initial_state_vector_with_pumpkinseed[2], 2)}`);
console.log(`Zebra Mussels Population: ${Math.floor(population_array[3]/1000000000)}B Scalar Change ${comparePopulation(population_array[3], initial_state_vector_with_pumpkinseed[3], 3)}`);
console.log(`Junk          Population: ${Math.floor(population_array[4]/1000000000)}B Scalar Change N/A`);
console.log(`Pumpkinseed   Population: ${Math.floor(population_array[5]/1000000000)}B Scalar Change ${comparePopulation(population_array[5], initial_state_vector_with_pumpkinseed[5], 5)}`);
console.log(`Lake Herring  Population: ${Math.floor(population_array[6]/1000000000)}B Scalar Change ${comparePopulation(population_array[6], initial_state_vector_with_pumpkinseed[6], 6)}`);
console.log(`Weeks Elapsed: ${process.argv[2] * 5}`);
var t1 = performance.now()
//console.log(`Equation: ${regression.polynomial(reg_vals).string}`);
//console.log(`R^2 value: ${regression.polynomial(reg_vals).r2}`);

console.log(`Program runtime: ${(t1 - t0)/1000}s`);
