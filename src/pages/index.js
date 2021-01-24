import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link } from 'gatsby';
import axios from 'axios';
import pp from 'papaparse';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import Chart from '../components/Chart';
import Helmet from 'react-helmet';
import { colors, widths } from '../utils/constants';
import '../components/layout.css';

dayjs.extend(utc);

const baseUrl = 'https://covid.ourworldindata.org/data';

const IndexPage = () => {
  const [countries, setCountries] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const countryObj = {};
    const getInitialData = async () => {
      const timeStamp = await axios.get(
        `${baseUrl}/owid-covid-data-last-updated-timestamp.txt`
      );
      setTime(
        dayjs.utc(timeStamp.data).local().format('h:mm a dddd, MMMM D, YYYY')
      );
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
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-vis/dist/style.css"
        />
        <title>Covid-19 vaccine tracker</title>
      </Helmet>
      <div className={css(styles.header)}>
        <h1>Covid-19 vaccine tracker</h1>
        {time && <h2 className={css(styles.h2)}>Last updated at {time}</h2>}
        <p>
          Information courtesy of{' '}
          <a href="https://ourworldindata.org/">Our World In Data</a>
        </p>
        <div className={css(styles.legend)}>
          <div className={css(styles.legendRow)}>
            <div
              className={css(styles.swatch)}
              style={{ backgroundColor: colors.teal }}
            />{' '}
            <div>Total vaccines administered</div>
          </div>
          <div className={css(styles.legendRow)}>
            <div
              className={css(styles.swatch)}
              style={{ backgroundColor: colors.purple }}
            />{' '}
            <div>Total people vaccinated</div>
          </div>
        </div>
        <div>
          <Link to="/countries">View by country</Link> |{' '}
          <Link to="/states">View by state (USA)</Link>
        </div>
      </div>
      {countries && <Chart name="World" list={countries} large />}
    </div>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  countryCharts: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 'auto',
    [`@media ${widths.device}`]: {
      width: '100%',
    },
  },
  h2: {
    fontSize: 20,
    [`@media ${widths.mobile}`]: {
      fontSize: 20,
    },
  },
  swatch: {
    width: 20,
    height: 20,
    marginRight: 5,
    border: '1px solid #eee',
  },
  legend: {
    display: 'inline-block',
    marginTop: 20,
    marginBottom: 20,
  },
  legendRow: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
  },
});
