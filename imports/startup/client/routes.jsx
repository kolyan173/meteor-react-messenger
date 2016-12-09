import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import HomeContainer from '../../ui/containers/HomeContainer.jsx';
import ProfileContainer from '../../ui/containers/ProfileContainer.jsx';
// import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={HomeContainer} />
      <Route path="/profile" component={ProfileContainer} />
      {/*<Route path="*" component={NotFoundPage} />*/}
    </Route>
  </Router>
);
