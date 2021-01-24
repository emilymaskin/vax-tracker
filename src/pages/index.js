import React from 'react';
import Chart from '../components/Chart';
import Layout from '../components/Layout';
import '../components/layout.css';

const IndexPage = ({ pageContext: { res, time } }) => (
  <Layout>{res && <Chart name="World" list={res} large />}</Layout>
);

export default IndexPage;
