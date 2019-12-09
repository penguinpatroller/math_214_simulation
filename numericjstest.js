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

const matrix = [[3,9], [-4,3]];

console.log(math.eig(matrix).E);
