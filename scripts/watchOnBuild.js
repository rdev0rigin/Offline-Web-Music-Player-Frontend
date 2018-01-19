/*
 * Copyright (c) 2017. 1o1 :{P
 */
var fs =require('fs-extra');
function mutationCallback(evt){
    console.log('mutated', evt);
    require('./build');
}
const dir = fs.readdir()
const mutate = new MutationObserver(dir, (
    './../src'
), mutationCallback);
