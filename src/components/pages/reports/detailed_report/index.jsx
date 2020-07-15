import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

/* Custom Components */
import Button from 'components/base/button';
import Toggle from 'components/base/toggle';
import PieChart from 'components/base/pie_chart';
import CheckBox from 'components/base/check_box';
import IndividualLot from './individual_lot/index';
import Configuration from './configuration';
import NoData from './no_data/index';

/* Actions */
import DetailReportsAction from 'actions/detailed_reports';
import { invoke } from 'actions';

/* API */
import DetailedReportApi from 'api/detailed_reports';
import { index as ParkingApiIndex } from 'api/parking_lots';

/* Helpers */
import DetailedReportConfigStore from 'components/helpers/detailed_reports_config_store';
import { titleizeSlug } from 'components/helpers/formatter';
import { displayDateRange } from 'components/helpers';
import DetailedReportsResponseParser from 'components/helpers/admins/detailed_reports_response_parser';

/* Plugins */
import moment from 'moment';

/* Styles */
import styles from './index.module.sass';

/* Assets */
import { ReactComponent as SpinnerIcon } from 'assets/spinner_icon.svg';
import { ReactComponent as ArrowBackIcon } from 'assets/arrow_back_icon.svg';
import { ReactComponent as DownloadIcon } from 'assets/download_icon.svg';
import { ReactComponent as PrintIcon } from 'assets/print_icon.svg';

const DEFAULT_SELECTED_PARKING_LOT = {
  label: 'All Parking Lots',
  value: 0
}

class DetailedReportPage extends React.Component {
  state = {
    rememberConfig: false,
    reportTitle: '',
    parkingLots: [],
    showAllDataTable: false,
    showIndividualLot: false,
    configs: {
      pie_chart: {
        range: {
          from: moment().startOf('month').format('YYYY-MM-DD'),
          to: moment().startOf('end_of_month').format('YYYY-MM-DD')
        },
        parking_lot_ids: []
      },
      individual_lots: {
        range: {
          from: moment().startOf('month').format('YYYY-MM-DD'),
          to: moment().startOf('end_of_month').format('YYYY-MM-DD')
        },
        parking_lot_ids: []
      }
    },
    loadingPDF: false,
    headless: false
  }

  loadPDF = (callback) => {
    const { report_type } = this.props.match.params;
    const { configs } = this.state;

    DetailedReportApi.download({
      domain: window.location.host,
      resource: report_type,
      filters: {
        configs
      }
    }).then(({data}) => {
      callback(data);
    });
  }

  processPDF = (action) => {
    this.setState({
      loadingPDF: true
    },
      () => {
        this.loadPDF((data) => {
          DetailedReportApi[action](data);
          this.setState({
            loadingPDF: false
          });
        });
      }
    )
  }

  download = () => {
    this.processPDF('showPDF');
  }

  print = () => {
    this.processPDF('printPDF');
  }

  fetchData = () => {
    const { report_type } = this.props.match.params

    DetailedReportApi.index({
      configs: this.state.configs,
      resource: report_type
    }).then(({ data }) => {
      this.props.setDetailedReportsData(
        DetailedReportsResponseParser(data)
      )
    });
  }

  fetchParkingLots = () => {
    ParkingApiIndex({})
      .then(res => {
        this.setState({
          parkingLots: [DEFAULT_SELECTED_PARKING_LOT].concat(res.data.map((parking_lot) => ({label: parking_lot.name, value: parking_lot.id})))
        })
      });
  }

  fetchBySavedConfig = () => {
    if (this.props.currentUser) {
      const configStore = new DetailedReportConfigStore(this.props.currentUser.id);
      const storedConfigs = configStore.getConfig();
      if (storedConfigs) {
        const { configs, rememberConfig, showAllDataTable, showIndividualLot } = storedConfigs;

        this.setState({
          configs,
          rememberConfig,
          showAllDataTable,
          showIndividualLot
        }, this.fetchData);
      } else {
        this.fetchData();
      }
    }
  }

  fetchDataByPassedFilters = () => {
    const params = new URLSearchParams(this.props.location.search || '');

    if (params.get('filters')) {
      const { configs } = JSON.parse(atob(params.get('filters')));

      this.setState({
        configs
      }, this.fetchData);
    } else {
      this.fetchData();
    }
  }

  componentDidMount () {
    const params = new URLSearchParams(this.props.location.search || '');
    const headless = params.get('frame') === 'headless';
    const reportTitle = titleizeSlug(this.props.match.params.report_type);

    this.setState({ headless, reportTitle: `${reportTitle} Reports` });

    if (!headless) {
      document.querySelector('.frame-container').classList.add('bg-transparent', 'shadow-none');
    }

    if (this.props.currentUser) {
      if (headless) {
        this.fetchDataByPassedFilters();
      }  else {
        this.fetchBySavedConfig();
      }
    }
  }

  componentWillUnmount () {
    if (!this.state.headless) {
      document.querySelector('.frame-container').classList.remove('bg-transparent', 'shadow-none');
    }
    this.props.resetDetailedReportsData();
  }

  componentWillMount() {
    this.fetchParkingLots();
  }

  componentDidUpdate(prevProps, _prevState) {
    if (!prevProps.currentUser && this.props.currentUser) {
      if (this.state.headless) {
        this.fetchDataByPassedFilters();
      }  else {
        this.fetchBySavedConfig();
      }
    }
  }

  onConfigChange = (name, config) => {
    this.setState((state) => ({
      configs: {
        ...state.configs,
        [name]: {
          ...state.configs[name],
          ...config
        }
      }
    }), () => {
      this.state.rememberConfig && this.saveConfigs();
      this.fetchData();
    });
  }

  saveConfigs = () => {
    const configStore = new DetailedReportConfigStore(this.props.currentUser.id);
    if (this.state.rememberConfig) {
      const { configs, rememberConfig, showAllDataTable, showIndividualLot } = this.state;
      configStore.setConfig({
        configs,
        rememberConfig,
        showAllDataTable,
        showIndividualLot
      });
    } else {
      configStore.removeConfig();
    }
  }

  renderIndividualLot () {
    const { individualReportsData } = this.props;
    const {
      configs: {
        individual_lots: individualLots
      },
      showAllDataTable
    } = this.state;
    return (
      <React.Fragment>
        <Row className={`${styles.individualReport} no-gutters`}>
          <Col>
            <span>Individual Reports</span>
          </Col>
        </Row>
        <Row className="no-gutters">
          <Col>
            <div className={styles.individualRange}>
              <span className="general-text-2">Covered Data:&nbsp;</span>
              <span className="general-text-1">
                {displayDateRange(individualLots.range.from, individualLots.range.to)}
              </span>
            </div>
            {
              !this.state.headless &&
              <CheckBox
                label="Include ALL individual parking lot data"
                onChange={() => this.setState({ showAllDataTable: !showAllDataTable }, this.saveConfigs) }
                value={showAllDataTable}
              />
            }
          </Col>
        </Row>
        {individualReportsData.length === 0 &&
          <Row>
            <Col>
              <NoData text="No Individual Lots Data" />
            </Col>
          </Row>
        }
        {individualReportsData.map((data, i) => (
          <IndividualLot
            key={i}
            name={data.name}
            chartData={{
              lineChartData: data.lineChartData,
              barChartData: data.barChartData
            }}
            tableData={data.tableData}
            showAllDataTable={showAllDataTable}
            printable={this.state.headless}
          />
        ))}
      </React.Fragment>
    );
  }

  render() {
    const { pieChartsData } = this.props;
    const {
      reportTitle,
      parkingLots,
      rememberConfig,
      showIndividualLot,
      configs,
      loadingPDF
    } = this.state;

    const selectedParkingLotOpt = (type) => {
      if (this.state.parkingLots.length &&
          this.state.configs[type].parking_lot_ids &&
          this.state.configs[type].parking_lot_ids.length) {

        return this.state.parkingLots.filter(
          lot => this.state.configs[type].parking_lot_ids.includes(lot.value)
        );
      } else {
        return [DEFAULT_SELECTED_PARKING_LOT];
      }
    }

    return (
      <div className={styles.container}>
        {
          !this.state.headless &&
          <Row className="no-gutters">
            <Col>
              <Link to="/dashboard" className={styles.title}>
                <ArrowBackIcon />
                <span className="general-text-1">Dashboard</span>
              </Link>
            </Col>
          </Row>
        }

        <Row className={`${styles.titleWrapper} ${styles.bgGrey} no-gutters`}>
          <Col className="mt-3 mb-3">
            <span className={`${styles.reportTitle} general-text-1`}>
              {reportTitle}
            </span>
          </Col>
          {
            !this.state.headless &&
            <Col className="col-auto d-flex">
              <Button
                status="primary"
                icon={loadingPDF ? <SpinnerIcon className={styles.rotate} /> : <DownloadIcon />}
                className={styles.btnDownload}
                onClick={this.download}
                disabled={loadingPDF}
              >
                Download
              </Button>
              <Button
                status="secondary"
                icon={loadingPDF ? <SpinnerIcon className={styles.rotate} /> : <PrintIcon />}
                onClick={this.print}
                disabled={loadingPDF}
              >
                Print
              </Button>
            </Col>
          }
        </Row>
        {
          !this.state.headless &&
          <React.Fragment>
            <Row className={`${styles.bgGrey} no-gutters`}>
              <Configuration
                name="pie_chart"
                title="Pie Chart Configurations"
                config={configs.pie_chart}
                onConfigChange={this.onConfigChange}
                parkingLots={parkingLots}
                defaultParkingLot={selectedParkingLotOpt('pie_chart')[0]}
              />
              <Col xs="12" lg="auto" className={styles.configRule} />
              <Configuration
                name="individual_lots"
                title="Individual Parking Lot"
                config={configs.individual_lots}
                onConfigChange={this.onConfigChange}
                parkingLots={parkingLots}
                defaultParkingLot={selectedParkingLotOpt('individual_lots')[0]}
              />
            </Row>
            <Row className={`${styles.btnWrapper} ${styles.bgGrey} no-gutters`}>
              <Col xs="12" lg="6">
                <CheckBox
                  label="Remember this configuration"
                  onChange={() => this.setState({ rememberConfig: !rememberConfig }, this.saveConfigs) }
                  value={rememberConfig}
                />
              </Col>
              <Col xs="12" lg="6" className={styles.toggleWrapper}>
                <Toggle
                  label="Include Individual Parking Lots"
                  onChange={() => this.setState({ showIndividualLot: !showIndividualLot }, this.saveConfigs)}
                  value={showIndividualLot}
                />
              </Col>
            </Row>
          </React.Fragment>
        }
          <Row className="no-gutters d-flex justify-content-center mt-3">
            {
              Object.keys(pieChartsData).map((pieChartGroup, i)  => {
                return <Col key={i} className="text-center" xs="12" md={Object.keys(pieChartsData).length > 1 ? '6' : '12'}>
                        <PieChart data={pieChartsData[pieChartGroup]} reportName={pieChartGroup} />
                       </Col>
              })
            }
          </Row>
        {(showIndividualLot || this.state.headless) && this.renderIndividualLot()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pieChartsData: state.detailedReports.pieChartsData,
  individualReportsData: state.detailedReports.individualReportsData,
  currentUser: state.user.data
});

DetailedReportPage.propTypes = {
  match: PropTypes.object.isRequired,
  setDetailedReportsData: PropTypes.func.isRequired,
  pieChartsData: PropTypes.object.isRequired,
  individualReportsData: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

const {
  SET_PIE_DETAILED_REPORT_DATA,
  RESET_PIE_DETAILED_REPORT_DATA
} = DetailReportsAction;

export default connect(mapStateToProps, {
  setDetailedReportsData: invoke(SET_PIE_DETAILED_REPORT_DATA),
  resetDetailedReportsData: invoke(RESET_PIE_DETAILED_REPORT_DATA),
})(DetailedReportPage);
