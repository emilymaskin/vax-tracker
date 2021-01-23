import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';

const getVaxDays = (countryCode, countries) => {
  const startIndex = countries[countryCode].data.findIndex(
    (day) => day.date === '2020-12-01'
  );

  let prevDay = 0;
  return countries[countryCode].data.slice(startIndex).map((day, index) => {
    if (day.total_vaccinations) {
      prevDay = day.total_vaccinations;
    }

    return {
      x: index,
      y: prevDay / 1000000,
    };
  });
};

const Chart = ({ countryCode, countries }) =>
  countries ? (
    <FlexibleXYPlot>
      <HorizontalGridLines />
      <LineSeries data={getVaxDays(countryCode, countries)} />
      <XAxis title="Days since Dec. 1, 2020" />
      <YAxis title="Vaccines (in millions)" />
    </FlexibleXYPlot>
  ) : (
    <div className={css(styles.loading)}>
      Loading data... (this may take several seconds)
    </div>
  );

export default Chart;

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    width: '100%',
    border: '1px solid #eee',
    backgroundColor: '#f8f8f8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
