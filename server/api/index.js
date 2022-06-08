const express = require('express');
const router = express.Router();
const path = require('path');

// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
  const fs = require('fs');
  const path = require('path');
  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = {};
    function readDirectory(directory) {
      fs.readdirSync(directory).forEach(file => {
        const fullPath = path.resolve(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);
          return;
        }
        if (!regularExpression.test(fullPath)) return;
        files[fullPath] = true;
      });
    }
    readDirectory(path.resolve(__dirname, base));
    function Module(file) {
      return require(file);
    }
    Module.keys = () => Object.keys(files);
    return Module;
  };
}
importAll(require.context('.', true, /\.js$/));

function importAll(r) {
  r.keys().forEach(key => {
    let m = r(key);
    let prefix = combindFilePath(key);
    Object.entries(m).forEach(register(prefix));
  });
}
function combindFilePath(key) {
  let localPath = key.replace(__dirname, '');
  let splashPath = localPath.split(path.sep).join('/');
  return splashPath.split('.').shift();
}
function register(prefix) {
  return function ([key, handler]) {
    let [method, url = ''] = key.split(' ');
    // console.log(method, prefix + url);
    if (Array.isArray(handler)) {
      router[method](prefix + url, ...handler);
    } else {
      router[method](prefix + url, handler);
    }
  };
}

module.exports = router;
/**
 *
 * @typedef {Object.<string,import('express').RequestHandler>} NormalApi
 */

/**
 * @typedef {(req:import('express').Request<P,,B,Q>,
 * res:import('express').Response<R>,
 * next:import('express').NextFunction)=>void} Fn
 * @template P
 * @template R
 * @template B
 * @template Q
 * @type {Fn<{id:number},{code:number},{name:string},{location:string}>}
 */
//  function x (req,res){

//  }
