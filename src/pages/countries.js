import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import axios from 'axios';
import pp from 'papaparse';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import Chart from '../components/Chart';
import Helmet from 'react-helmet';
import { widths } from '../utils/constants';
import '../components/layout.css';
import { colors } from '../utils/constants';

dayjs.extend(utc);

const baseUrl = 'https://covid.ourworldindata.org/data';

const CountriesPage = () => {
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

  const formatNumber = (num) =>
    num
      ? parseInt(num, 10)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '0';

  const getLastEntry = (country) => country.data[country.data.length - 1] || {};

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
      </div>
      {countries && (
        <>
          <div className={css(styles.countryCharts)}>
            {Object.keys(countries)
              .filter((key) => key !== 'World')
              .map((c, index) => (
                <div className={css(styles.countryChart)} key={index}>
                  <h3 className={css(styles.h3)}>
                    {getLastEntry(countries[c]).location}
                  </h3>
                  <p>
                    <b>
                      {formatNumber(
                        getLastEntry(countries[c]).total_vaccinations
                      )}
                    </b>{' '}
                    vaccines given to{' '}
                    <b>
                      {formatNumber(
                        getLastEntry(countries[c]).people_vaccinated
                      )}
                    </b>{' '}
                    people
                  </p>
                  <Chart countryCode={c} countries={countries} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountriesPage;

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
  countryChart: {
    height: 280,
    width: 'calc(50% - 45px)',
    margin: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    fontSize: 20,
    [`@media ${widths.mobile}`]: {
      fontSize: 20,
    },
  },
  h3: {
    marginBottom: 0,
    [`@media ${widths.mobile}`]: {
      fontSize: 18,
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
  },
  legendRow: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
  },
});
