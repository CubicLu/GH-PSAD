function updateRecord(update, backPath, state) {
  const { id } = this.props.match.params;

  this.setState({ isFetching: true });
  update({ id, data: state })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
}

function updateSucceed(backPath, res) {
  const { history, setRecord } = this.props;

  setRecord(res.data);
  this.setState({ isFetching: false });
  history.push(backPath);
}

function updateFailed(error) {
  console.error(error.message);
  this.setState({ isFetching: false });
}

export default updateRecord;
