export default function (...promises) {
  this.props.fetchStarted()
  Promise.all(promises)
    .finally(() => this.props.fetchFinished())
}