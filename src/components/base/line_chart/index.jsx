import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import styles from './line_chart.module.sass';
import { displayMonthAndDay } from 'components/helpers';

// data example
// [{ x: '2018-01-01', y: 10 }, ...]

const LineChart = ({ data, xAxisTitle = '', yAxisTitle = '' }) => {
  if (!data.length) {
    return null;
  }
  const dataLine = [{ id: 'line', data }];
  return (
    <div className={styles.lineChart}>
      <ResponsiveLine
        data={dataLine}
        margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: '%Y-%m-%d' }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear' }}
        enableGridX={false}
        gridYValues={5}
        enablePoints={false}
        colors={['#3A9CED']}
        axisLeft={{
          tickValues: 5,
          tickSize: 4,
          tickPadding: 10,
          tickRotation: 0,
          legend: yAxisTitle,
          legendOffset: -46,
          legendPosition: 'middle'
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: 5,
          tickSize: 8,
          tickPadding: 0,
          tickRotation: 0,
          legend: xAxisTitle,
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        tooltip={({ point: { data: { x, y } } }) => (
          <div className={styles.tooltip}>
            <span className="general-text-1">{displayMonthAndDay(x)}&nbsp;-&nbsp;</span>
            <span className="general-text-1">{`${y} ${yAxisTitle}`}</span>
          </div>
        )}
        useMesh={true}
        theme={{
          grid: {
            line: {
              stroke: '#EFF1F6',
              strokeWidth: 1
            }
          },
          axis: {
            legend: {
              text: {
                fill: 'rgba(36, 46, 66, 0.9)',
                fontSize: 10
              }
            },
            ticks: {
              line: {
                stroke: 'rgba(73, 82, 89, 0.9)',
                strokeWidth: 1
              },
              text: {
                fontSize: 10,
                fill: '#495259',
                fontWeight: 300,
                opacity: 0.9
              }
            }
          }
        }}
      />
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string
};

export default LineChart;
