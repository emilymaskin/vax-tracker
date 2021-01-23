import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';
import { colors } from '../utils/constants';

const getTotalVaccines = (countryCode, countries) => {
  let prevDay = 0;

  return countries[countryCode].data.map((day, index) => {
    if (day.total_vaccinations) {
      prevDay = day.total_vaccinations;
    }

    return {
      x: index,
      y: prevDay / 1000000,
    };
  });
};

const getTotalPeople = (countryCode, countries) => {
  let prevDay = 0;

  return countries[countryCode].data.map((day, index) => {
    if (day.total_vaccinations) {
      prevDay = day.people_vaccinated;
    }

    return {
      x: index,
      y: prevDay / 1000000,
    };
  });
};

const Chart = ({ countryCode, countries }) => (
  <div className={css(styles.loading)}>
    <FlexibleXYPlot>
      <HorizontalGridLines />
      <LineSeries
        data={getTotalPeople(countryCode, countries)}
        color={colors.purple}
      />
      <LineSeries
        data={getTotalVaccines(countryCode, countries)}
        color={colors.teal}
      />
      <XAxis title="Days since first dose" />
      <YAxis title="Vaccines (in millions)" />
    </FlexibleXYPlot>
  </div>
);

export default Chart;

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    width: '100%',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
