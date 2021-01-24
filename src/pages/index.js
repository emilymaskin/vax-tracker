import React, { useEffect, useState } from 'react';
import pp from 'papaparse';
import Header from '../components/Header';
import Chart from '../components/Chart';
import '../components/layout.css';
import { baseUrl } from '../utils/constants';

const IndexPage = () => {
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
      {countries && <Chart name="World" list={countries} large />}
    </div>
  );
};

export default IndexPage;
