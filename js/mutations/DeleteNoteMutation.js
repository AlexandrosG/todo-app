import Relay from 'react-relay';

export default class DeleteNoteMutation extends Relay.Mutation {
  static fragments = {
    note: () => Relay.QL`
      fragment on Note {
         id,
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id,
        totalCount,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deleteNote}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteNotePayload @relay(pattern: true) {
        deletedNoteId,
        viewer {
          totalCount,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'notes',
      deletedIDFieldName: 'deletedNoteId',
    }];
  }
  getVariables() {
    return {
      id: this.props.note.id,
    };
  }
  getOptimisticResponse() {
    const viewerPayload = {id: this.props.viewer.id};
    if (this.props.viewer.totalCount != null) {
      viewerPayload.totalCount = this.props.viewer.totalCount - 1;
    }
    return {
      deletedNoteId: this.props.note.id,
      viewer: viewerPayload,
    };
  }
}
