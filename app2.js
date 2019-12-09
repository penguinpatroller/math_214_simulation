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

const transition_matrix = [
[0.6509,0,0,0,1/6,0,0],
[0,0.225,0,0,1/6,0,0],
[0,0,0.29922,0,1/6,0,0],
[0.3491,0.775,0.30078,0.23,0,0,0],
[0,0,0,0.6377,0.5,0.4,0.4],
[0,0,0,0.1323,0,0.6,0],
[0,0,0.4,0,0,0,0.6]
];

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function filterMatrix(matrix_in)
{
  for(var row = 0; row < matrix_in.length; row++)
  {
    filterRow(matrix_in[row])
  }
}

function filterRow(row_in)
{
  for(var column = 0; column < row_in.length; column++)
  {
    row_in[column] = Math.round(row_in[column] * 10000) / 10000;
  }
}

if(math.eig){
  //Save Eigen Values into matrix called eigen_values
  var eigen_values = math.eig(transition_matrix).lambda.x;
  var eigen_matrix = math.eig(transition_matrix).E.x;

  filterRow(eigen_values);
  filterMatrix(eigen_matrix);
  console.log(`Eigen Values  = ${eigen_values}`);
  for(let i = 0; i < eigen_matrix.length; i++)
  {
    console.log(`Eigen Vector For ${eigen_values[i]} = [${eigen_matrix[i]}]`);
  }
}


var coordinate_matrix = [eigen_matrix[0], eigen_matrix[1], eigen_matrix[2], eigen_matrix[3], eigen_matrix[4], eigen_matrix[5], eigen_matrix[6], initial_state_vector];

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

  set_population(pop_val)
  {
    this.population = pop_val;
  }
}

var phy_equation_parameters  = new equa(eigen_values[0], coordinate[0], eigen_matrix[0]);
var cili_equation_parameters = new equa(eigen_values[1], coordinate[1], eigen_matrix[1]);
var zoo_equation_parameters  = new equa(eigen_values[2], coordinate[2], eigen_matrix[2]);
var zm_equation_parameters   = new equa(eigen_values[3], coordinate[3], eigen_matrix[3]);
var junk_equation_parameters = new equa(eigen_values[4], coordinate[4], eigen_matrix[4]);
var pump_equation_parameters = new equa(eigen_values[5], coordinate[5], eigen_matrix[5])
var herr_equation_parameters = new equa(eigen_values[6], coordinate[6], eigen_matrix[6]);

var equation_objs = [phy_equation_parameters, cili_equation_parameters, zoo_equation_parameters,
              zm_equation_parameters, junk_equation_parameters, pump_equation_parameters, herr_equation_parameters];

//Calculate individual population and return population amount
function calculate_population(week, index){
  let population = 0;
  equation_objs.forEach( function (item)
  {
    population += item.get_population(week, index);
  });
  return population;
}

//Calculate all populations and save them into population_array vector
function calculate_all_populations(week){
  let i = 0;
  equation_objs.forEach((item, index) =>
    item.set_population( calculate_population(week, index) )
 );
}

calculate_all_populations(time_in_weeks);

var population_names = ['phy pop: ', 'cili pop: ', 'zoo pop: ', 'zm pop: ', 'junk pop: ', 'pump pop: ','herr pop: '];
equation_objs.forEach((item, index) =>
  console.log(population_names[index].concat(item.population) )
);
