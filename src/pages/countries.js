import React from 'react';
import Chart from '../components/Chart';
import Layout from '../components/Layout';
import '../components/layout.css';

const CountriesPage = ({ pageContext: { res } }) => (
  <Layout>
    {Object.keys(res)
      .filter((key) => key !== 'World')
      .map((c, index) => (
        <Chart name={c} list={res} key={index} />
      ))}
  </Layout>
);

export default CountriesPage;
