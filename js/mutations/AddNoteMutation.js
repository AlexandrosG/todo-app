import Relay from 'react-relay';
import moment from 'moment';

export default class addNoteMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        totalCount,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addNote}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddNotePayload @relay(pattern: true) {
        noteEdge,
        viewer {
          notes,
          totalCount,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'notes',
      edgeName: 'noteEdge',
      rangeBehaviors: {
         '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      message: this.props.message,
      created: moment().unix(),
    };
  }
  getOptimisticResponse() {
    return {
      noteEdge: {
        node: {
          message: this.props.message,
          created: moment().unix()
        },
      },
      viewer: {
        id: this.props.viewer.id,
        totalCount: this.props.viewer.totalCount + 1,
      },
    };
  }
}
