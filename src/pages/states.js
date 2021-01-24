import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import pp from 'papaparse';
import Chart from '../components/Chart';
import Header from '../components/Header';
import { baseUrl, widths } from '../utils/constants';
import '../components/layout.css';

const StatesPage = () => {
  const [states, setStates] = useState(null);

  useEffect(() => {
    const countryObj = {};
    const getInitialData = async () => {
      pp.parse(`${baseUrl}/vaccinations/us_state_vaccinations.csv`, {
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
          setStates(countryObj);
        },
      });
    };

    getInitialData();
  }, []);

  return (
    <div className="App">
      <Header />
      {states && (
        <div className={css(styles.charts)}>
          {Object.keys(states).map((c, index) => (
            <Chart name={c} list={states} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatesPage;

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
