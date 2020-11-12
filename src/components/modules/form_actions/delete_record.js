function deleteRecord (destroy, recordId) {
  this.setState({ isDeleting: true });

  destroy({ id: recordId })
    .then(deleteSucceed.bind(this))
    .catch(deleteFailed.bind(this))
    .finally(() => {
      this.setState({ isDeleting: false });
    });
}

function deleteSucceed () {
  const { history, location, fetchData } = this.props;
  history.replace(`${location.pathname}${location.search}`, { shouldFetch: true });
  fetchData();
}

function deleteFailed (error) {
  this.context.addAlertMessages([{
    type: 'Error',
    text: error.message
  }]);
}

export default deleteRecord;
