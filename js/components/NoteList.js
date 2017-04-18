import Note from './Note';

import React from 'react';
import Relay from 'react-relay';

class NoteList extends React.Component {
  renderNotes() {
    return this.props.viewer.notes.edges.map(edge =>
      <Note
        key={edge.node.id}
        note={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render() {
    return (      
      <div className="outer-box">
        <ul>
          {this.renderNotes()}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(NoteList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        notes(
          first: 2147483647  # max GraphQLInt
        ) {
          edges {
            node {
              id,
              ${Note.getFragment('note')},
            },
          },
        },
        totalCount,
        ${Note.getFragment('viewer')},
      }
    `,
  },
});
