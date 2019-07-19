export default function (...promises) {
  Promise.all(promises)
    .finally(() => this.setState({ isFetching: false }))
}