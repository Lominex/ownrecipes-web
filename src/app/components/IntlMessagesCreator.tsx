import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import initCourses from './messages/Courses';
import initCuisines from './messages/Cuisines';
import initMeasurements from './messages/Measurements';
import initTags from './messages/Tags';
import initValidations from './messages/Validations';

const IntlMessagesCreator = () => {
  const intl = useIntl();

  useEffect(() => {
    initCourses();
    initCuisines();
    initMeasurements();
    initTags();
    initValidations();
  }, [intl.locale]);

  return null;
};

export default IntlMessagesCreator;
