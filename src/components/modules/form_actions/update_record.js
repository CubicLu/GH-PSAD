function updateRecord(update, backPath, state) {
  const { id } = this.props.match.params;

  this.setState({ isSaving: true });

  update({ id, data: state })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
}

function updateSucceed(backPath, res) {
  const { history, setRecord } = this.props;

  setRecord(res.data);
  this.setState({ isSaving: false });
  history.push(backPath);
}

function updateFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }

  this.setState({ isSaving: false })
}

export default updateRecord;
