import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <ul className="nav-content ">
        <li>
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li className="nav-menu">
          <p className="nav-menu-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </p>
          <p className="nav-menu-item">
            <Link className="nav-link" to="/jobs">
              Jobs
            </Link>
          </p>
        </li>
        <li>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
