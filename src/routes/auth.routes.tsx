import React from 'react';
import { Switch, Route } from 'react-router-dom'; 

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const AuthRoutes: React.FC = () => (
    <Switch>
        <Route path="/cadastrar" exact component={SignUp} />
        <Route path="*" exact component={SignIn} />
    </Switch>
);

export default AuthRoutes;