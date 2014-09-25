var fs = require("fs"),
    d3 = require("d3");

fs.readFile("rfb_baby_names.csv","utf8",function(err,data){

  data = d3.csv.parse(data);

  var output = {},
      years = d3.keys(data[0]).filter(function(d){
        return d != "State";
      }).map(function(d){
        return +d;
      }).sort(function(a,b){
        return a - b;
      }),
      byYear = {};
      output = {
        "years": [],
        "states": {}
      };

  years.forEach(function(year){
    byYear[year] = [];
  });

  data.forEach(function(d){

    output.states[d.State] = years.map(function(year){
      byYear[year].push(d[year]);
      return d[year];
    });

  });

  output.years = years.map(function(year){

    //Get frequency of each name in that year
    var counts = {};

    byYear[year].forEach(function(name){

      if (!counts[name]) {
        counts[name] = 0;
      }

      counts[name]++;

    });

    counts = d3.entries(counts).sort(function(a,b){
      return b.value - a.value;
    }).map(function(d){
      return d.key;
    });

    return counts;

  });

  fs.writeFile("baby-names.json",JSON.stringify(output,null,"\t"));

});