import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';
import { colors, widths } from '../utils/constants';
import AutoSizer from 'react-virtualized-auto-sizer';

const getTotalVaccines = (name, list) => {
  let prevDay = 0;

  return list[name].data.map((day, index) => {
    if (day.total_vaccinations) {
      prevDay = day.total_vaccinations;
    }

    return {
      x: index,
      y: prevDay / 1000000,
    };
  });
};

const getTotalPeople = (name, list) => {
  let prevDay = 0;

  return list[name].data.map((day, index) => {
    if (day.total_vaccinations) {
      prevDay = day.people_vaccinated;
    }

    return {
      x: index,
      y: prevDay / 1000000,
    };
  });
};

const formatNumber = (num) =>
  num
    ? parseInt(num, 10)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0';

const getLastEntry = (obj) => obj.data[obj.data.length - 1] || {};

const Chart = ({ name, list, large }) => (
  <div className={css(styles.wrapper)}>
    <h3 className={css(styles.h3)}>{name}</h3>
    <p>
      <b>{formatNumber(getLastEntry(list[name]).total_vaccinations)}</b>{' '}
      vaccines given to{' '}
      <b>{formatNumber(getLastEntry(list[name]).people_vaccinated)}</b> people
    </p>
    <div className={css(styles.chart, large && styles.large)}>
      <AutoSizer>
        {({ width, height }) => (
          <XYPlot width={width} height={height}>
            <HorizontalGridLines />
            <LineSeries
              data={getTotalPeople(name, list)}
              color={colors.purple}
            />
            <LineSeries
              data={getTotalVaccines(name, list)}
              color={colors.teal}
            />
            <XAxis title="Days since first recorded dose" />
            <YAxis title="Vaccines (in millions)" />
          </XYPlot>
        )}
      </AutoSizer>
    </div>
  </div>
);

export default Chart;

const styles = StyleSheet.create({
  wrapper: {
    width: 'calc(50% - 45px)',
    [`@media ${widths.mobile}`]: {
      width: '100%',
    },
  },
  chart: {
    height: 280,
    marginBottom: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [`@media ${widths.tablet}`]: {
      marginBottom: 50,
      height: 230,
      width: 'calc(50% - 30px)',
    },
    [`@media ${widths.mobile}`]: {
      height: 230,
      width: '100%',
      marginBottom: 40,
    },
  },
  large: {
    width: 900,
    height: 500,
    [`@media ${widths.tablet}`]: {
      width: '100%',
      height: 400,
    },
    [`@media ${widths.mobile}`]: {
      width: '100%',
      height: 230,
    },
  },
  h3: {
    marginBottom: 0,
    [`@media ${widths.mobile}`]: {
      fontSize: 18,
    },
  },
});
