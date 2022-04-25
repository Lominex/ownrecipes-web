import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';

import * as AuthActions from '../store/actions';
import LoginForm from '../components/LoginForm';
import { CombinedStore } from '../../app/Store';
import PageWrapper from '../../common/components/PageWrapper';
import SignUpInfo from '../components/SignUpInfo';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const accountState = useSelector((state: CombinedStore) => state.account);

  const handleLogin = (username: string, password: string) => {
    dispatch(AuthActions.getToken(username, password));
  };

  return (
    <PageWrapper title={intl.messages['nav.login.title'] as string}>
      <Modal.Dialog className='form-signin'>
        <Modal.Header className='form-header'>
          <h1>OwnRecipes</h1>
        </Modal.Header>

        <Modal.Body>
          <LoginForm
              accountState={accountState}
              onLogin={handleLogin} />
          <hr />
          <SignUpInfo />
        </Modal.Body>
      </Modal.Dialog>
    </PageWrapper>
  );
};

export default LoginPage;
