import React, { Component } from 'react'
import PostList from './PostList'
import CreatePost from './CreatePost'
import Login from './Login'
import Header from './Header'
import Search from './Search'
import { Switch, Route, Redirect } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className='center w85'>
        <Header />
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/new/1' />} />
            <Route exact path='/create' component={CreatePost} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/top' component={PostList} />
            <Route exact path='/new/:page' component={PostList} />
          </Switch>
        </div>
      </div>
    )
  }  
}

export default App

