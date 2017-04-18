import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

export default class NoteTextInput extends React.Component {
  static defaultProps = {
    commitOnBlur: false,
  };
  static propTypes = {
    className: PropTypes.string,
    commitOnBlur: PropTypes.bool.isRequired,
    initialValue: PropTypes.string,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };
  state = {
    isEditing: false,
    message: this.props.initialValue || '',
  };
  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }
  _commitChanges = () => {
    const newMessage = this.state.message.trim();
    if (this.props.onDelete && newMessage === '') {
      this.props.onDelete();
    } else if (this.props.onCancel && newMessage === this.props.initialValue) {
      this.props.onCancel();
    } else if (newMessage !== '') {
      this.props.onSave(newMessage);
      this.setState({message: ''});
    }
  };
  _handleBlur = () => {
    if (this.props.commitOnBlur) {
      this._commitChanges();
    }
  };
  _handleChange = (e) => {
    this.setState({message: e.target.value});
  };
  _handleKeyDown = (e) => {
    if (this.props.onCancel && e.keyCode === ESC_KEY_CODE) {
      this.props.onCancel();
    } else if (e.keyCode === ENTER_KEY_CODE) {
      this._commitChanges();
    }
  };
  render() {
    return (      
        <input
          className={this.props.className}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          placeholder={this.props.placeholder}
          value={this.state.message}
        />			    
    );
  }
}
