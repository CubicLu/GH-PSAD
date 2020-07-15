import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import styles from './pie_chart.module.sass';
import Legend from './legend';

const colorPalette = [
  '#3A9CED',
  '#27CEBB',
  '#495259',
  '#DFE1E6',
  '#FB745B',
  '#FED83B',
  '#1C6B94',
  '#27CE6A',
  '#242E42',
  '#595249',
  '#F97714',
  '#A274E8',
  '#29D9EE',
  '#D978E3',
  '#1ED698'
];

const ReportsPieChart = ({ data, reportName }) => {
  if (!data.length) {
    return null;
  }
  return (
    <div className={styles.pieChart}>
      <div>
        <ResponsivePie
          data={data}
          colors={colorPalette}
          enableSlicesLabels={false}
          radialLabelsTextColor="#242E42"
          radialLabelsLinkColor="#E6E8F1"
          radialLabelsTextXOffset={4}
          radialLabelsLinkHorizontalLength={10}
          width={290}
          margin={{ top: 50, right: 0, bottom: 50, left: 0 }}
        />
      </div>
      <Legend
        data={data}
        colors={colorPalette}
        reportName={reportName}
      />
      <div />
    </div>
  );
};

ReportsPieChart.propTypes = {
  data: PropTypes.array.isRequired,
  reportName: PropTypes.string.isRequired
};

export default ReportsPieChart;
