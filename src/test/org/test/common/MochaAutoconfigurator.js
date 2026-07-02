const originalLogFunction = console.log;
let output;
module.exports = beforeEach(function() {
  output = '';
  console.log = (msg) => {
    output += msg + '\n';
  };
});

module.exports = afterEach(function() {
  console.log = originalLogFunction; // undo dummy log function
  if (this.currentTest.state === 'failed') {
    console.log("Log:");
    console.log(output);
  }
});

// module.exports = HtmlAutomation
