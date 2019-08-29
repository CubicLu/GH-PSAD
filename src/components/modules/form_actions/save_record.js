import { cloneDeep } from 'lodash'

function saveRecord(create, backPath, values) {
  this.setState({ isSaving: true });
  create({ data: cloneDeep(values) })
    .then(createSucceed.bind(this, backPath))
    .catch(handleFailed.bind(this));
};

function createSucceed(backPath, res) {
  const { history, setRecord } = this.props;
  setRecord(res.data);
  this.setState({ isSaving: false });
  history.push(backPath);
};

function handleFailed(error) {

  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }

  this.setState({ isSaving: false });
};


export default saveRecord