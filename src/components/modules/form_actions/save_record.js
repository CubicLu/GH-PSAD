import { cloneDeep } from 'lodash'

function saveRecord(create, backPath, values) {
  this.setState({ isFetching: true });
  create({ data: cloneDeep(values) })
    .then(createSucceed.bind(this, backPath))
    .catch(handleFailed.bind(this));
};

function createSucceed(backPath, res) {
  const { history, setRecord } = this.props;
  setRecord(res.data);
  this.setState({ isFetching: false });
  history.push(backPath);
};

function handleFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }

  this.setState({ isFetching: false });
};


export default saveRecord