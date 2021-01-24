import React, { useEffect, useState } from 'react';
import pp from 'papaparse';
import Chart from '../components/Chart';
import Layout from '../components/Layout';
import { baseUrl } from '../utils/constants';
import '../components/layout.css';

const StatesPage = () => {
  const [data, setData] = useState(null);

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
          setData(countryObj);
        },
      });
    };

    getInitialData();
  }, []);

  return (
    <Layout>
      {data &&
        Object.keys(data).map((c, index) => (
          <Chart name={c} list={data} key={index} />
        ))}
    </Layout>
  );
};

export default StatesPage;
