import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { defineMessages, useIntl } from 'react-intl';
import * as _ from 'lodash';

import '../css/login.css';

import { AccountState } from '../store/types';
import Icon from '../../common/components/Icon';
import Input from '../../common/components/Input';
import Alert from './Alert';

export interface ILoginFormProps {
  accountState: AccountState;

  onLogin: (username: string, password: string) => void;
}

interface ILoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC<ILoginFormProps> = (props: ILoginFormProps) => {
  const intl = useIntl();

  const { formatMessage } = intl;
  const messages = defineMessages({
    please_sign_in: {
      id: 'login.please_sign_in',
      description: 'Please sign in header',
      defaultMessage: 'Sign In',
    },
    username: {
      id: 'login.username',
      description: 'Username placeholder',
      defaultMessage: 'Username',
    },
    password: {
      id: 'login.password',
      description: 'Password placeholder',
      defaultMessage: 'Password',
    },
    sign_in: {
      id: 'login.sign_in',
      description: 'Sign in button',
      defaultMessage: 'Sign in',
    },
  });

  const [formData, setFormData] = useState<ILoginFormData>({ username: '', password: '' });

  const handleChange = (attr: string, value: string) => {
    setFormData(prev => {
      const newState = _.cloneDeep(prev);
      _.set(newState, attr, value);
      return newState;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onLogin(formData.username, formData.password);
  };

  return (
    <form className='form-signin' onSubmit={handleSubmit}>
      <Alert reducerState={props.accountState} />

      <h2 className='form-signin-heading'>{formatMessage(messages.please_sign_in)}</h2>
      <Input
          name  = 'username'
          value = {formData.username}
          placeholder = {formatMessage(messages.username)}
          autoComplete = 'username'
          autoFocus
          required
          inputAdornmentStart = {<Icon icon='person' size='2x' />}
          change = {handleChange} />
      <Input
          name  = 'password'
          value = {formData.password}
          type  = 'password'
          placeholder = {formatMessage(messages.password)}
          autoComplete = 'password'
          required
          inputAdornmentStart = {<Icon icon='key' size='2x' />}
          change = {handleChange} />

      <Button variant='primary' type='submit'>
        {formatMessage(messages.sign_in)}
      </Button>
    </form>
  );
};

export default LoginForm;
