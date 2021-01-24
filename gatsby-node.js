const csv = require('csv-stream');
const request = require('request');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  const csvStream = csv.createStream({});

  let url =
    'https://covid.ourworldindata.org/data/vaccinations/vaccinations.csv';
  if (page.path === '/states/') {
    url =
      'https://covid.ourworldindata.org/data/vaccinations/us_state_vaccinations.csv';
  }

  const results = [];
  const res = {};

  request(url)
    .pipe(csvStream)
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      results.map((r) => {
        if (res[r.location]) {
          res[r.location].data.push({
            total_vaccinations: r.total_vaccinations,
            people_vaccinated: r.people_vaccinated,
          });
        } else {
          res[r.location] = {
            data: [
              {
                total_vaccinations: r.total_vaccinations,
                people_vaccinated: r.people_vaccinated,
              },
            ],
          };
        }
      });

      deletePage(page);
      createPage({
        ...page,
        context: {
          res,
        },
      });
    });
};
