var tabtab = require('tabtab');
var fs = require('fs');

exports.init = function (program, binName) {
  if(process.argv.slice(2)[0] === 'completion') return tabtab.complete(binName, function(err, data) {
    // simply return here if there's an error or data not provided.
    // stderr not showing on completions
    if(err || !data) return;

    // Log all Generic Long Options
    if(/^--\w?/.test(data.last)) return tabtab.log(program.options.map(function (data) {
      return data.long;
    }), data);

    // Log all Generic Short Options
    if(/^-\w?/.test(data.last)) return tabtab.log(program.options.map(function (data) {
      return data.short;
    }), data);

    var outData = [];
    var isCommandPresent = false;
    var path = process.cwd();

    program.commands.map(function (data){
        if (process.argv.indexOf(data._name) !== -1 && !isCommandPresent ) {
            isCommandPresent = true;
        }
    });

    if (isCommandPresent) {
        fs.readdir(path, function(err, items) {
            tabtab.log(items.map(function (data) {
                return data;
            }), data);
        });
    } else {
        tabtab.log(program.commands.map(function (data){
            return data._name;
        }), data);
    }

  });
}
