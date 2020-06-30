import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styles from './bar_chart.module.sass';
import { displayMonthAndDay } from 'components/helpers';

// data example
// [{ x: '2018-01-01', y: 10 }, ...]

const BarChart = ({ data, xAxisTitle = '', yAxisTitle = '' }) => {
  if (!data.length) {
    return null;
  }
  return (
    <div className={styles.barChart}>
      <ResponsiveBar
        data={data}
        keys={['y']}
        indexBy='x'
        margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
        padding={0.43}
        enableLabel={false}
        enableGridX={false}
        gridYValues={5}
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
          format: value => displayMonthAndDay(value),
          tickValues: 12,
          tickSize: 4,
          tickPadding: 4,
          tickRotation: 0,
          legend: xAxisTitle,
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        tooltip={({ indexValue, value }) => (
          <div className={styles.tooltip}>
            <span className="general-text-1">{displayMonthAndDay(indexValue)}&nbsp;-&nbsp;</span>
            <span className="general-text-1">{`${value} ${yAxisTitle}`}</span>
          </div>
        )}
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
          },
          tooltip: {
            container: {
              borderRadius: 2,
              padding: 10,
              boxShadow: '0px 1px 4px rgba(183, 189, 200, 0.34)'
            }
          }
        }}
      />
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string
};

export default BarChart;
