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
            .filter((r) => !!r.iso_code)
            .map((r) => {
              if (countryObj[r.iso_code]) {
                countryObj[r.iso_code].data.push(r);
              } else {
                countryObj[r.iso_code] = { data: [r] };
              }
            });
          setCountries(countryObj);
        },
      });
    };

    getInitialData();
  }, []);

  const formatNumber = (num) =>
    num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

  const getLastEntry = (country) => country.data[country.data.length - 1] || {};

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
      {countries && (
        <>
          <div className={css(styles.countryChart, styles.large)}>
            <Chart countryCode="OWID_WRL" countries={countries} />
            <h3 className={css(styles.h3)}>
              Worldwide (
              {formatNumber(
                getLastEntry(countries.OWID_WRL).total_vaccinations
              )}
              )
            </h3>
          </div>
          <div className={css(styles.countryCharts)}>
            {Object.keys(countries)
              .filter((key) => key !== 'OWID_WRL')
              .map((c, index) => (
                <div className={css(styles.countryChart)} key={index}>
                  <Chart countryCode={c} countries={countries} />
                  <h3 className={css(styles.h3)}>
                    {getLastEntry(countries[c]).location} (
                    {formatNumber(
                      getLastEntry(countries[c]).total_vaccinations
                    )}
                    )
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
  swatch: {
    width: 20,
    height: 20,
    marginRight: 5,
    border: '1px solid #eee',
  },
  legend: {
    display: 'inline-block',
  },
  legendRow: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
  },
});
