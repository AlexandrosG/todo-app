import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import NoteApp from './components/NoteApp';
import NoteList from './components/NoteList';
import ViewerQueries from './queries/ViewerQueries';

class HomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = ViewerQueries;
}

ReactDOM.render(
  <Relay.RootContainer
    Component={NoteApp}
    route={new HomeRoute()}
  />,
  document.getElementById('root')
);