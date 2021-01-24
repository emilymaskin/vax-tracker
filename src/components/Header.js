import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { StyleSheet, css } from 'aphrodite/no-important';
import Helmet from 'react-helmet';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import { colors, widths } from '../utils/constants';

dayjs.extend(utc);

const Header = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const getInitialData = async () => {
      const timeStamp = await axios.get(
        'https://covid.ourworldindata.org/data/owid-covid-data-last-updated-timestamp.txt'
      );
      setTime(
        dayjs.utc(timeStamp.data).local().format('h:mm a dddd, MMMM D, YYYY')
      );
    };

    getInitialData();
  }, []);

  return (
    <div className={css(styles.header)}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-vis/dist/style.css"
        />
        <title>Covid-19 vaccine tracker</title>
      </Helmet>
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
        <Link to="/" activeClassName={css(styles.current)}>
          Home
        </Link>{' '}
        |{' '}
        <Link to="/countries" activeClassName={css(styles.current)}>
          View by country
        </Link>{' '}
        |{' '}
        <Link to="/states" activeClassName={css(styles.current)}>
          View by state (USA)
        </Link>
      </div>
    </div>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 40,
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
  current: {
    fontWeight: 'bold',
  },
});
