const Octokit = require('@octokit/rest');
const minimist = require('minimist');
const collect = require('collect.js');

const args = minimist(process.argv.slice(2))

const puts = console.log;

var octokit = new Octokit({ auth() {return `token ${args.k}`}});
var query = octokit.search.issuesAndPullRequests({q: "is:open+is:pr+archived:false+draft:false+user:paymentspring+-label:blocked+-label:WIP"});

// a bit sloppy, but build up the output object as we go
var output = {};

const groupedResult = query.then(result => {
  const items = result.data.items;
  puts(`Total Count: ${items.length}`);
  return items;
}).then(items => {
  const grouped = collect(items).groupBy(function (item, key) {
    return item.user.login;
  }).all();
  return grouped;
});

const addTotalsToOutput = groupedResult.then(grouped => {
  Object.keys(grouped).forEach(function(key) {
    output[key] = {};
    output[key].total = grouped[key].items.length;
  });
  return grouped;
});

addTotalsToOutput.then(grouped => {
  var allUserReviews = Object.keys(grouped).map(function(key) {
    var reviewResults = grouped[key].items.map(item => {
      const path = item.html_url.split('/');

      return octokit.pulls.listReviews({owner: path[3], repo: path[4], number: path[6]}).then(result => {
        if (result.data == []) return 0;
        return result.data.filter(x => x.state == "APPROVED").length;
      }).then(current => {
        var required = item.labels.some(x => x.name.toLowerCase() == 'high-risk') ? 3 : 2;
        return required - current;
      });
    });

    return Promise.all(reviewResults).then(values => {
      return { key: key, count: collect(values).sum() };
    })
  });
  Promise.all(allUserReviews).then((items) => {
    items.map(item => {
      output[item.key].reviews_needed = item.count;
    });
    puts(output);
  })
});
