import { defineMessages, useIntl } from 'react-intl';
import Alert from '../../common/components/Alert';
import GenericReducerType from '../../common/store/GenericReducerType';

export interface ILoginAlert {
  reducerState: GenericReducerType;
}

const LoginAlert: React.FC<ILoginAlert> = (props: ILoginAlert) => {
  const { formatMessage } = useIntl();

  const messages = defineMessages({
    errorTitle: {
      id: 'login.alert.error_title',
      description: 'Fail to login header',
      defaultMessage: 'Login failed',
    },
    errorMessage: {
      id: 'login.alert.incorrect_credentials',
      description: 'Fail to login message',
      defaultMessage: 'Incorrect username or password.',
    },
  });

  const { reducerState } = props;
  const { error } = reducerState;

  return (
    <>
      {error && (
        <Alert severity='danger' title={formatMessage(messages.errorTitle)}>
          {formatMessage(messages.errorMessage)}
        </Alert>
      )}
    </>
  );
};

export default LoginAlert;
