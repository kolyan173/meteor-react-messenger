import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
import { browserHistory } from 'react-router'

import 'react-select/dist/react-select.css';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});

Accounts.onLogin((id) => {
  const targetRoute = Session.get('targetRoute');

  if (targetRoute) {
    browserHistory.push(targetRoute);
  }
});
