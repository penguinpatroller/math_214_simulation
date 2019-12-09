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

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function filterMatrix(matrix_in)
{
  for(var row = 0; row < matrix_in.length; row++)
  {
    for(var column = 0; column < matrix_in[row].length; column++)
    {
      matrix_in[row][column] = Math.round(matrix_in[row][column] * 10000) / 10000;
    }
  }
}

const matrix = [
  [0.6509,0,0,0,1/6,0,0],
  [0,0.225,0,0,1/6,0,0],
  [0,0,0.29922,0,1/6,0,0],
  [0.3491,0.775,0.30078,0.23,0,0,0],
  [0,0,0,0.6377,0.5,0.4,0.4],
  [0,0,0,0.1323,0,0.6,0],
  [0,0,0.4,0,0,0,0.6]
  ];

const temp_mat_real = math.eig(matrix).E.x;
const temp_mat_imag = math.eig(matrix).E.y;
filterMatrix(temp_mat_imag);
filterMatrix(temp_mat_real);
console.log(temp_mat_real);
console.log(temp_mat_imag);
