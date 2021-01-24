import React from 'react';
import Chart from '../components/Chart';
import Layout from '../components/Layout';
import '../components/layout.css';

const StatesPage = ({ pageContext: { res } }) => (
  <Layout>
    {Object.keys(res).map((c, index) => (
      <Chart name={c} list={res} key={index} />
    ))}
  </Layout>
);

export default StatesPage;
