import DeleteNoteMutation from '../mutations/DeleteNoteMutation';
import EditNoteMutation from '../mutations/EditNoteMutation';
import NoteTextInput from './NoteTextInput';

import React from 'react';
import Relay from 'react-relay';

import moment from 'moment';

class Note extends React.Component {
  state = {
    isEditing: false,
  };
  _handleCompleteChange = (e) => {
    const complete = e.target.checked;
    this.props.relay.commitUpdate(
      new ChangeNoteStatusMutation({
        complete,
        note: this.props.note,
        viewer: this.props.viewer,
      })
    );
  };
  _handleDestroyClick = () => {
    this._deleteNote();
  };
  _handleEditClick = () => {
    this._setEditMode(true);
  };
  _handleTextInputCancel = () => {
    this._setEditMode(false);
  };
  _handleTextInputDelete = () => {
    this._setEditMode(false);
    this._deleteNote();
  };
  _handleTextInputSave = (message) => {
    this._setEditMode(false);
    this.props.relay.commitUpdate(
      new EditNoteMutation({note: this.props.note, message})
    );
  };
  _formatDate(timestamp) {
    return moment.unix(timestamp).format("DD/MM/YYYY HH:mm");
  }
  _deleteNote() {
    this.props.relay.commitUpdate(
      new DeleteNoteMutation({note: this.props.note, viewer: this.props.viewer})
    );
  }
  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  };
  renderTextInput() {
    return (
      <NoteTextInput
        className="edit"
        commitOnBlur={true}
        initialValue={this.props.note.message}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    );
  }
  render() {
    return (
      <li className={this.state.isEditing ? 'editing' : ''}>
        <span className="name">{this.props.viewer.name}</span>
        <span className="entry">
          <span>{this.props.note.message}</span>
          {this.state.isEditing && this.renderTextInput()}
        </span>        
        <button className="edit" onClick={this._handleEditClick}><div className="icon-pencil"></div></button>
        <button className="delete" onClick={this._handleDestroyClick}><div className="icon-cross"></div></button>
        <div className="timestamp">{this._formatDate(this.props.note.created)}</div>
      </li>						            
    );
  }
}

export default Relay.createContainer(Note, {
  fragments: {
    note: () => Relay.QL`
      fragment on Note {
        id,
        message,
        created
        ${DeleteNoteMutation.getFragment('note')},
        ${EditNoteMutation.getFragment('note')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        name,
        ${DeleteNoteMutation.getFragment('viewer')},
      }
    `,
  },
});
