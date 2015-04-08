'use strict';

module.exports = function (grunt) {
    require('grunt-commons')(grunt, {
        name: 'ko-entry',
        main: 'binding',
        internalMain: 'binding',

        shims: {
            knockout: 'window.ko'
        }
    }).initialize({});
};
