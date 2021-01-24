import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import pp from 'papaparse';
import Chart from '../components/Chart';
import Header from '../components/Header';
import { baseUrl, widths } from '../utils/constants';
import '../components/layout.css';

const CountriesPage = () => {
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    const countryObj = {};
    const getInitialData = async () => {
      pp.parse(`${baseUrl}/vaccinations/vaccinations.csv`, {
        header: true,
        delimiter: ',',
        worker: true,
        download: true,
        complete(results) {
          results.data
            .filter((r) => !!r.location)
            .map((r) => {
              if (countryObj[r.location]) {
                countryObj[r.location].data.push(r);
              } else {
                countryObj[r.location] = { data: [r] };
              }
            });
          setCountries(countryObj);
        },
      });
    };

    getInitialData();
  }, []);

  return (
    <div className="App">
      <Header />
      {countries && (
        <div className={css(styles.charts)}>
          {Object.keys(countries)
            .filter((key) => key !== 'World')
            .map((c, index) => (
              <Chart name={c} list={countries} key={index} />
            ))}
        </div>
      )}
    </div>
  );
};

export default CountriesPage;

const styles = StyleSheet.create({
  charts: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 'auto',
    [`@media ${widths.device}`]: {
      width: '100%',
    },
  },
});
