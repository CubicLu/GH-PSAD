export const handleInputChange = function (e)  {
  this.setState({[e.target.name]: e.target.value});
}