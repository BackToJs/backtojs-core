#!/usr/bin/env node
const supervisor = require('supervisor');
supervisor.run(["-e", 'js|html', __dirname+"/run_dev.js"]);
