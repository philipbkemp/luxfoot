#!/bin/sh

export SHELL=/bin/sh

npm install -g terser chokidar-cli

chokidar "assets/js/raw/**/*.js" --polling -c "terser {path} --compress --mangle -o \"assets/js/min/\$(basename {path} .js).min.js\""
