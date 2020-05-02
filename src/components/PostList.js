import React, { Component, Fragment } from 'react'
import Post from './Post'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { POSTS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: PostOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      posts {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

const NEW_POSTS_SUBSCRIPTION = gql`
  subscription {
    newPost {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      post {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class PostList extends Component {

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.feed.count / POSTS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }
  
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _getPostsToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.posts
    }
    const rankedPosts = data.feed.posts.slice()
    rankedPosts.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedPosts
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
    const first = isNewPage ? POSTS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  _updateCacheAfterVote = (store, createVote, postId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
    const first = isNewPage ? POSTS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })
  
    const votedPost = data.feed.posts.find(post => post.id === postId)
    votedPost.votes = createVote.post.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewPosts = subscribeToMore => {
    subscribeToMore({
      document: NEW_POSTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newPost = subscriptionData.data.newPost
        const exists = prev.feed.posts.find(({ id }) => id === newPost.id);
        if (exists) return prev;
  
        return Object.assign({}, prev, {
          feed: {
            posts: [newPost, ...prev.feed.posts],
            count: prev.feed.posts.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }  

  render() {
    return (
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>
  
          this._subscribeToNewPosts(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)
  
          const postsToRender = this._getPostsToRender(data)
          const isNewPage = this.props.location.pathname.includes('new')
          const pageIndex = this.props.match.params.page
            ? (this.props.match.params.page - 1) * POSTS_PER_PAGE
            : 0
  
          return (
            <Fragment>
              {postsToRender.map((post, index) => (
                <Post
                  key={post.id}
                  post={post}
                  index={index + pageIndex}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}
              {isNewPage && (
                <div className="footerBtn">
                  <div className="pagination" onClick={this._previousPage}>
                    Previous
                  </div>
                  <div className="pagination" onClick={() => this._nextPage(data)}>
                    Next
                  </div>
                </div>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}



export default PostList