import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { update, statuses, show } from 'api/parking/tickets';
import { fields } from 'components/helpers/fields/agencies/tickets';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/agencies/tickets';
import CommonForm from 'components/base/common_form';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isFetching: true,
      statuses: [],
      officers: []
    };
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
  }

  values = () => {
    const { record } = this.props;
    var values = {};
    for (const [key, value] of Object.entries(record)) {
      switch (key) {
        case 'officer':
          values[`admin_id`] = value.id;
          break;
        default:
          values[key] = value;
      }
    }
    return values;
  };

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['officer'])
        .then((result) => this.setState({ ...result }))
        .catch(this.handleFailed),
      statuses()
        .then(({ data }) => {
          this.setState({
            statuses: data.statuses
          });
        })
    );
  }

  willReturnTo (backPath, match) {
    const params = new URLSearchParams(this.props.location.search);
    if (params.get('index')) {
      return [backPath, { agency_id: match.params.agency_id }];
    } else {
      return ['/dashboard/agencies/:agency_id', { agency_id: match.params.agency_id }];
    }
  }

  renderRecord () {
    const { backPath, match } = this.props;
    const [path, params] = this.willReturnTo(backPath, match);
    return (
      <Card>
        <CardHeader>Edit Ticket</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={generatePath(path, params)}
            values={this.values()}
            fields={fields(this.state.officers, this.state.statuses)}
            isFetching={this.state.isFetching}
            submitForm={updateRecord.bind(this, update, generatePath(path, params))}/>
        </CardBody>
      </Card>
    );
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), Edit);
