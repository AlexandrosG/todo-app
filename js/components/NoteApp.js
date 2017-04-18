import AddNoteMutation from '../mutations/AddNoteMutation';
import NoteTextInput from './NoteTextInput';
import NoteList from './NoteList';

import React from 'react';
import Relay from 'react-relay';

class NoteApp extends React.Component {
  _handleTextInputSave = (message) => {
    this.props.relay.commitUpdate(
      new AddNoteMutation({message, viewer: this.props.viewer})
    );
  };
  componentDidMount() {
     this.scrollToBottom();
  };
  componentDidUpdate(prevProps, prevState, aaa) {
    if (this.props.viewer.totalCount > prevProps.viewer.totalCount){
      this.scrollToBottom();
    }      
  };
  scrollToBottom() {
    const scrollHeight = this.notesContainer.scrollHeight;
    const height = this.notesContainer.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.notesContainer.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };
  render() {
    const hasNotes = this.props.viewer.totalCount > 0;
    return (
      <div className="container">
        <div className="list-container">
          <div className="items">
            {this.props.viewer.totalCount} items
          </div>     
          <div className="scrolling-content"
            ref={(div) => {
            this.notesContainer = div;
          }}>       
            <NoteList viewer={this.props.viewer} />
          </div>
          <div className="message">
            <NoteTextInput
              autoFocus={true}
              className="new-note"
              onSave={this._handleTextInputSave}
              placeholder="Enter your message here..."
            />
          </div>
          </div>        
      </div>
    );
  }
}

export default Relay.createContainer(NoteApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
        totalCount,
        ${AddNoteMutation.getFragment('viewer')},
        ${NoteList.getFragment('viewer')},
      }
    `,
  },
});