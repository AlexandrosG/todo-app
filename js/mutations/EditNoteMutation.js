import Relay from 'react-relay';

export default class EditNoteMutation extends Relay.Mutation {
  static fragments = {
    note: () => Relay.QL`
      fragment on Note {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{editNote}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditNotePayload @relay(pattern: true) {
        note {
          message,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        note: this.props.note.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.note.id,
      message: this.props.message,
    };
  }
  getOptimisticResponse() {
    return {
      note: {
        id: this.props.note.id,
        message: this.props.message,
      },
    };
  }
}
