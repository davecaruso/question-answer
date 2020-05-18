const fs = require('fs-extra');

if(fs.pathExistsSync('./src/implementation')) fs.removeSync('./src/implementation')
fs.copySync('../implementation', './src/implementation');
