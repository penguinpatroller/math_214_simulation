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

let time_in_weeks = process.argv[2];

const initial_state_vector = [6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12), 6.4089*Math.pow(10,12),
2.9371*Math.pow(10,9), 0, 8.184*Math.pow(10,3), 8.184*Math.pow(10,3)];

const transition_matrix = [ [.6509,0,0,0,0,0,0], [0,.225,0,0,0,0,0], [0,0,.29922,0,0,0,0],
    [.3491,.775,.30078,.23,0,0,0], [0,0,0,.6377,1,0,0], [0,0,0,.1323,0,1,0], [0,0,.4,0,0,0,1] ];

//Identity Matrix 7 x 7
const identity_7 = math.identity(7);

if(math.eig){
  //Save Eigen Values into matrix called eigen_values
  var eigen_values = math.eig(transition_matrix).lambda.x;

  //Filter Out Really Low Eigen Values that should be zero

  for(var i = 0; i < 7; i++)
  {
    eigen_values[i] = Math.round(eigen_values[i] * 100000) / 100000;
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
  let return_matrix = [];

  //Return last column times negative one
  math.transpose(a_minus_lambda_In._data).forEach(function (item){
    //console.log(item);
    if(math.norm(item) > 1)
    {
      return_matrix = math.concat(return_matrix, item, 0);
    }
  });

  return math.multiply(return_matrix, -1);
}
console.log(eigen_values);
//var eigen_matrix = [calculate_eigen_vector(0), [0,0,0,0,0,0,1], calculate_eigen_vector(2), calculate_eigen_vector(3), calculate_eigen_vector(4), [0,0,0,0,0,1,0], [0,0,0,0,1,0,0,]];
var eigen_matrix = [];

var coordinate_matrix = [calculate_eigen_vector(0), [0,0,0,0,0,0,1], calculate_eigen_vector(2), calculate_eigen_vector(3), calculate_eigen_vector(4), [0,0,0,0,0,1,0], [0,0,0,0,1,0,0,], initial_state_vector];

coordinate_matrix = math.clone(math.transpose(coordinate_matrix));
rref(coordinate_matrix);

var coordinate = math.transpose(coordinate_matrix)[coordinate_matrix.length];

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

var phy_equation_parameters = new equa(eigen_values[0], coordinate[0], eigen_matrix[0]);
var cili_equation_parameters = new equa(eigen_values[1], coordinate[1], eigen_matrix[1]);
var zoo_equation_parameters = new equa(eigen_values[2], coordinate[2], eigen_matrix[2]);
var zm_equation_parameters = new equa(eigen_values[3], coordinate[3], eigen_matrix[3]);
var junk_equation_parameters = new equa(eigen_values[4], coordinate[4], eigen_matrix[4]);
var pump_equation_parameters = new equa(eigen_values[5], coordinate[5], eigen_matrix[5])
var herr_equation_parameters = new equa(eigen_values[6], coordinate[6], eigen_matrix[6]);

//Populations are saved in each index. Index 0 corresponds
var population_array = [0, 0, 0, 0, 0, 0, 0];

var equation_objs = [phy_equation_parameters, cili_equation_parameters, zoo_equation_parameters,
              zm_equation_parameters, junk_equation_parameters, pump_equation_parameters, herr_equation_parameters];

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
  for(; i < (population_array.length - 1); i++)
  {
    population_array[i] = calculate_population(week, i);
  }
}

calculate_all_populations(time_in_weeks);

var population_names = ['phy pop: ', 'cili pop: ', 'zoo pop: ', 'zm pop: ', 'junk pop: ', 'pump pop: ','herr pop: '];

population_array.forEach((item, index) =>
  console.log( population_names[index].concat(item) )
);

console.log(eigen_matrix);
