export default function (...promises) {
  Promise.all(promises)
    .finally(() => this.setState({ isSaving: false }))
}