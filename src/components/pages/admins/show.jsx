import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { show } from 'api/admins';
import { SET_RECORD } from 'actions/admins';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { search as dropdowns_search } from 'api/dropdowns';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import CommonShowForm from 'components/base/common_form/show';
import { showFields } from 'components/helpers/fields/admins';

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: []
    }
  }

  componentDidMount() {
    waitUntilFetched.call(this,
      dropdowns_search()
        .then(response => {
          this.setState({roles: response.data});
        })
    )
  }

  renderRecord() {
    const { record, backPath, match } = this.props;
    return (<Card>
      <CardHeader>{record.email}</CardHeader>
      <CardBody>
          <CommonShowForm
            fields={showFields()}
            values={record}
            backPath={backPath}
            editURL={match.url}
          />
      </CardBody>
    </Card>);
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Show);
