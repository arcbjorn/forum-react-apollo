import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="header">
        <div className="title"><b>Forum Sample</b></div>
        <div className="navbar">
          <Link to="/" className="ml1 no-underline black">
            <div className = "nav">all</div>
          </Link>
          <Link to="/top" className="ml1 no-underline black">
            <div className = "nav">most recent</div>
          </Link>
          <Link to="/search" className="ml1 no-underline black">
            <div className = "nav">search</div>
          </Link>
          {authToken && (
            <div className="flex">
              <Link to="/create" className="ml1 no-underline black">
              <div className = "nav">submit</div>
              </Link>
            </div>
          )}
        </div>
        <div>
          {authToken ? (
            <div
              className="ml1 black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                this.props.history.push(`/`)
              }}
            >
              <div className="log">logout</div>
            </div>
          ) : (
            <Link to="/login" className="ml1 no-underline black">
            <div className="log">login</div>
            </Link>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)