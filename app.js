'use strict';

const fs = require('fs');

const { create, all } = require('mathjs')
const math = create(all);
const numeric = require('numeric');
math.import(numeric, { wrap: true, silent: true });
const numbers = require('numbers');
math.import(numbers, { wrap: true, silent: true });

var initial_state_vector = [];

const transition_matrix = math.matrix([.6509,0,0,0,0,0,0], [0,.225,0,0,0,0,0], [0,0,.29922,0,0,0,0],
  [.3491,.775,.30078,.23,0,0,0], [0,0,0,.6377,1,0,0], [0,0,0,.1323,0,0,1,0], [0,0,.4,0,0,0,1]
]);

function calculate_all_populations(weeks)
{
  if(weeks = 0)
  {
    return;
  }
  
}
