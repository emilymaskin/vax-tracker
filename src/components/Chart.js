import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis';
import { colors } from '../utils/constants';
import AutoSizer from 'react-virtualized-auto-sizer';

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
  <AutoSizer>
    {({ width, height }) => (
      <XYPlot width={width} height={height}>
        <HorizontalGridLines />
        <LineSeries
          data={getTotalPeople(countryCode, countries)}
          color={colors.purple}
        />
        <LineSeries
          data={getTotalVaccines(countryCode, countries)}
          color={colors.teal}
        />
        <XAxis title="Days since first recorded dose" />
        <YAxis title="Vaccines (in millions)" />
      </XYPlot>
    )}
  </AutoSizer>
);

export default Chart;
