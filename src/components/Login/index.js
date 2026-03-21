import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = msg => {
    this.setState({errorMsg: msg, showError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showError} = this.state

    return (
      <div className="login-bg">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <h1 className="login-heading">Login</h1>

          <label htmlFor="username" className="login-label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            className="login-input"
            value={username}
            onChange={this.onChangeUsername}
          />

          <label htmlFor="password" className="login-label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={this.onChangePassword}
          />

          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default withRouter(Login)
