
function updateRecord(update, backPath, values) {
  const { id } = this.props.match.params;
  this.setState({ isFetching: true });

  update({ id, data: JSON.parse(JSON.stringify(values)) })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
};

function updateSucceed(backPath, res) {
  const {  history, setRecord } = this.props;

  setRecord(res.data);
  this.setState({ isFetching: false });
  history.push(backPath);
};

function updateFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }
  this.setState({ isFetching: false });
};

export default updateRecord
