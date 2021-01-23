import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import Chart from '../components/Chart';
import Helmet from 'react-helmet';
import { widths } from '../utils/constants';
import '../components/layout.css';

dayjs.extend(utc);

const baseUrl = 'https://covid.ourworldindata.org/data';

const IndexPage = () => {
  const [countries, setCountries] = useState(null);
  const [time, setTime] = useState(null);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const getInitialData = async () => {
      const timeStamp = await axios.get(
        `${baseUrl}/owid-covid-data-last-updated-timestamp.txt`
      );
      setTime(
        dayjs.utc(timeStamp.data).local().format('h:mm a dddd, MMMM D, YYYY')
      );

      const latest = await axios.get(
        `${baseUrl}/latest/owid-covid-latest.json`
      );
      const latestObj = {};

      Object.keys(latest.data)
        .filter((key) => !!latest.data[key].total_vaccinations)
        .map((key) => (latestObj[key] = latest.data[key]));
      setLatest(latestObj);
    };

    getInitialData();
  }, []);

  useEffect(() => {
    if (latest) {
      const getFullData = async () => {
        const { data } = await axios.get(`${baseUrl}/owid-covid-data.json`);
        setCountries(data);
      };
      getFullData();
    }
  }, [latest]);

  const formatNumber = (num) =>
    num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

  return (
    <div className="App">
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-vis/dist/style.css"
        />
      </Helmet>
      <h1>Covid-19 vaccinations administered</h1>
      {time && <h2 className={css(styles.h2)}>Last updated at {time}</h2>}
      <p>
        Information courtesy of{' '}
        <a href="https://ourworldindata.org/">Our World In Data</a>
      </p>
      {latest && (
        <>
          <div className={css(styles.countryChart, styles.large)}>
            <Chart countryCode="OWID_WRL" countries={countries} />
            <h3 className={css(styles.h3)}>
              Worldwide ({formatNumber(latest.OWID_WRL.total_vaccinations)})
            </h3>
          </div>
          <div className={css(styles.countryCharts)}>
            {Object.keys(latest)
              .filter((key) => key !== 'OWID_WRL')
              .map((countryCode, index) => (
                <div className={css(styles.countryChart)} key={index}>
                  <Chart countryCode={countryCode} countries={countries} />
                  <h3 className={css(styles.h3)}>
                    {latest[countryCode].location} (
                    {formatNumber(latest[countryCode].total_vaccinations)})
                  </h3>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  countryCharts: {
    width: 900,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 'auto',
    [`@media ${widths.device}`]: {
      width: '100%',
    },
  },
  countryChart: {
    height: 280,
    width: 'calc(50% - 45px)',
    margin: '45px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [`@media ${widths.tablet}`]: {
      margin: '30px 0',
      height: 230,
      width: 'calc(50% - 30px)',
    },
    [`@media ${widths.mobile}`]: {
      height: 230,
      width: '100%',
    },
  },
  large: {
    width: 900,
    height: 500,
    margin: '45px auto',
    [`@media ${widths.tablet}`]: {
      width: '100%',
      height: 400,
    },
    [`@media ${widths.mobile}`]: {
      width: '100%',
      height: 230,
    },
  },
  h2: {
    [`@media ${widths.mobile}`]: {
      fontSize: 20,
    },
  },
  h3: {
    marginTop: 10,
    [`@media ${widths.mobile}`]: {
      fontSize: 18,
    },
  },
});
