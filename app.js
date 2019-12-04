'use strict';

var eigen_values = [1, 2, 3, 4, 5, 6];

class eig{
  constructor(val, vec){
    this.val = val;
    this.vec = vec;
  }
}

var eig1 = new eig(3, [1,2,3,4,5]);
var eig2 = new eig(0.5, [1,2,3,4,5]);
var eig3 = new eig(3, [1,2,3,4,5]);
var eig4 = new eig(3, [1,2,3,4,5]);
var eig5 = new eig(3, [1,2,3,4,5]);
var eig6 = new eig(3, [1,2,3,4,5]);



var eig_objs = [eig1, eig2, eig3, eig4, eig5, eig6];

eig_objs.forEach( (item) =>
console.log(item.val)
);
