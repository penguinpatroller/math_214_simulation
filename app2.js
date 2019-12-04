'use strict';

//For reading command line
const fs = require('fs');

//For reduced row echelon form
const rref = require('rref');

const { create, all } = require('mathjs')
const math = create(all);
const numeric = require('numeric');
math.import(numeric, { wrap: true, silent: true });
const numbers = require('numbers');
math.import(numbers, { wrap: true, silent: true });

const initial_state_vector = [6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12),
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3), 8.184*Math.pow(10,3)];

const transition_matrix = [ [.6509,0,0,0,0,0,0], [0,.225,0,0,0,0,0], [0,0,.29922,0,0,0,0],
    [.3491,.775,.30078,.23,0,0,0], [0,0,0,.6377,1,0,0], [0,0,0,.1323,0,1,0], [0,0,.4,0,0,0,1] ];

//Identity Matrix 7 x 7
const identity_7 = math.identity(7);

if(math.eig)
{
  //Save Eigen Values into matrix called eigen_values
  var eigen_values = math.eig(transition_matrix).lambda.x;

  //Filter Out Really Low Eigen Values that should be zero
  for(var i = 0; i < 7; i++)
  {
    eigen_values[i] = Math.round(eigen_values[i] * 10000) / 10000;
  }
}

function calculate_eigen_vector(lambda_index){
  //A
  let transition_matrix_copy = math.clone(transition_matrix);
  //-In
  let lambda_In = math.multiply(identity_7, -1 * eigen_values[lambda_index]);
  //A - In
  let a_minus_lambda_In = math.add(transition_matrix_copy, lambda_In);

  rref(a_minus_lambda_In._data);
  //let temp_matrix = rref([[0.5,2], [0.5,4]]);
  console.log(a_minus_lambda_In._data);
  console.log(math.transpose(a_minus_lambda_In._data));
  //Return last column times negative one
  return math.multiply(math.transpose(a_minus_lambda_In._data)[5], -1);
}

let time_in_weeks = process.argv[2];


class equa{
  constructor(val, coordinate, vec){
    this.val = val;
    this.cord = coordinate;
    this.vec = vec;
  }

  get_population(week, index)
  {
    //cord * eigen_val^t *
    return this.cord * Math.pow(this.val,week) * this.vec[index];
  }
}

var phy_equation_parameters = new equa(.6509, 30, [0,0,0,1,0,1]);
var cili_equation_parameters = new equa(.225, 40, [0,-1,-1,0,1,1]);
var zoo_equation_parameters = new equa(.29922, 30, [2,4,0,0,5,6]);
var zm_equation_parameters = new equa(.44, -10, [5,6,0,1,1,1]);
var junk_equation_parameters = new equa(1, 60, [2,0,2,0,2,0]);
var herr_equation_parameters = new equa(1, 20, [-1,-1,-1,1,0,0]);

//Populations are saved in each index. Index 0 corresponds
var population_array = [0, 0, 0, 0, 0, 0];

var equation_objs = [phy_equation_parameters, cili_equation_parameters, zoo_equation_parameters,
              zm_equation_parameters, junk_equation_parameters, herr_equation_parameters];

//Calculate individual population and return this
function calculate_population(week, index){
  var population = 0;
  equation_objs.forEach( function (item)
  {
    population += item.get_population(week, index);
  });
  return population;
}

//Calculate all populations and save them into population_array vector
function calculate_all_populations(week){
  let i = 0;
  for(; i < 6; i++)
  {
    population_array[i] = calculate_population(week, i);
  }
}

calculate_all_populations(time_in_weeks);

var population_names = ['phy pop: ', 'cili pop: ', 'zoo pop: ', 'zm pop: ', 'junk pop: ', 'herr pop: '];

population_array.forEach((item, index) =>
  console.log( population_names[index].concat(item) )
);

console.log(calculate_eigen_vector(2));
