'use strict';

//For reading from command line
const fs = require('fs');

//To track time
const { PerformanceObserver, performance } = require('perf_hooks');

//For math functiosn
const { create, all } = require('mathjs')
const math = create(all);
const numeric = require('numeric');
math.import(numeric, { wrap: true, silent: true });
const numbers = require('numbers');
math.import(numbers, { wrap: true, silent: true });

const initial_state_vector = [6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12),
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3), 8.184*Math.pow(10,3)];

const transition_matrix = [
[.6509,0,0,0,1/6,0,0],
[0,.225,0,0,1/6,0,0],
[0,0,.29922,0,1/6,0,0],
[.3491,.775,.30078,.23,0,0,0],
[0,0,0,.6377,0.5,0.4,0.4],
[0,0,0,.1323,0,0.6,0],
[0,0,.4,0,0,0,0.6]
];

var t0 = performance.now();
function calculate_all_populations(weeks, vec)
{
  //Base Case
  if(weeks === 0)
  {
    return vec;
  }
  //Multipy vector by transition matrix
  const output_vector = math.multiply(transition_matrix, vec);
  return calculate_all_populations(weeks - 1, output_vector);
}
var t1 = performance.now()

var eigen_values = math.eig(transition_matrix).lambda.x;

//console.log(eigen_values);
var population_array = calculate_all_populations(8000, initial_state_vector);
console.log(`Phytoplankton Population: ${population_array[0]} Net Change ${Math.round((population_array[0]/initial_state_vector[0]) * 10000)/10000}`);
console.log(`Ciliates      Population: ${population_array[1]} Net Change ${Math.round((population_array[1]/initial_state_vector[1]) * 10000)/10000}`);
console.log(`Zooplankton   Population: ${population_array[2]} Net Change ${Math.round((population_array[2]/initial_state_vector[2]) * 10000)/10000}`);
console.log(`Zebra Mussels Population: ${population_array[3]} Net Change ${Math.round((population_array[3]/initial_state_vector[3]) * 10000)/10000}`);
console.log(`Junk          Population: ${population_array[4]} Net Change ${Math.round((population_array[4]/initial_state_vector[4]) * 10000)/10000}`);
console.log(`Pumpkinseed   Population: ${population_array[5]} Net Change ${Math.round((population_array[5]/initial_state_vector[5]) * 10000)/10000}`);
console.log(`Lake Herring  Population: ${population_array[6]} Net Change ${Math.round((population_array[6]/initial_state_vector[6]) * 10000)/10000}`);

console.log(`Time: ${t1 - t0}s`);
