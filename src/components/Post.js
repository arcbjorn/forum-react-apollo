import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation VoteMutation($postId: ID!) {
    vote(postId: $postId) {
      id
      post {
       id
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

class Post extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex mt2 items-start margin">
        <div className="flex items-center pointer">
          <span className="pointer gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ postId: this.props.post.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.post.id)
              }
            >
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  <i class="fa fa-arrow-up upvote"></i>
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.post.description} ({this.props.post.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.post.votes.length} votes | by{' '}
            {this.props.post.postedBy
              ? this.props.post.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.post.createdAt)}
          </div>
        </div>
      </div>
    )
  }
}

export default Post
