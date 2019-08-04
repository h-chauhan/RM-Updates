import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Payment from './payment';
import Insights from './insights';

export default function App() {
  return (
    <Switch>
      <Route path="/pay" component={Payment} />
      <Route path="/insights" component={Insights} />
      <Route path="/404" render={() => <h1>404 Page not found.</h1>} />
      <Route render={() => <Redirect to="/404" />} />
    </Switch>
  );
}
