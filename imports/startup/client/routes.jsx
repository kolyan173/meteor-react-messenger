import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import HomeContainer from '../../ui/containers/HomeContainer.jsx';
import ProfileContainer from '../../ui/containers/ProfileContainer.jsx';
import Signup from '../../ui/pages/Signup/Signup.jsx';
import Login from '../../ui/pages/Login/Login.jsx';
// import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={HomeContainer} onEnter={requireLogin}/>
      <Route path="/profile" component={ProfileContainer} onEnter={requireLogin}/>
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      {/*<Route path="*" component={NotFoundPage} />*/}
    </Route>
  </Router>
);

const requireLogin = (nextState, replace, cb) => {
  const user = Meteor.user();
  const isLogging = Meteor.loggingIn();

  if (!user && !isLogging) {
    // oops, not logged in, so can't be here!
    replace('/login');
  } else if (isLogging) {
    Session.set('targetRoute', nextState.location.pathname);
  }

  cb();
};
