import { Button } from 'react-bootstrap';
import { defineMessages, useIntl } from 'react-intl';
import React, { useContext } from 'react';

import '../css/recipe_header.css';

import Icon from '../../common/components/Icon';
import Tooltip from '../../common/components/Tooltip';
import CookingModeContext from '../context/CookingModeContext';
import { useWakeLock } from '../../common/hooks/useWakeLock';

const CookingModeButton: React.FC = () => {
  const intl = useIntl();
  const { formatMessage } = intl;

  const messages = defineMessages({
    activate_cooking_mode_tooltip: {
      id: 'recipe.activate_cooking_mode_tooltip',
      description: 'Tooltip displayed when hovering the activate cooking mode button',
      defaultMessage: 'Keep display awake.',
    },
    deactivate_cooking_mode_tooltip: {
      id: 'recipe.deactivate_cooking_mode_tooltip',
      description: 'Tooltip displayed when hovering the deactivate cooking mode button',
      defaultMessage: 'Release the display wake lock.',
    },
  });

  const { isSupported } = useWakeLock();
  const cookingModeContext = useContext(CookingModeContext);
  const isCookingMode = cookingModeContext?.cookingMode ?? false;

  const handleClick = () => {
    cookingModeContext?.setCookingMode(!isCookingMode);
  };

  if (!isSupported) return null;

  return (
    <Tooltip id='cooking mode tooltip' tooltip={formatMessage(isCookingMode ? messages.deactivate_cooking_mode_tooltip : messages.activate_cooking_mode_tooltip)}>
      <Button variant={isCookingMode ? 'primary' : 'outline-primary'} aria-label='Toggle cooking mode' onClick={handleClick}>
        <Icon icon='stopwatch' variant={isCookingMode ? 'filled' : 'light'} />
      </Button>
    </Tooltip>
  );
};

export default CookingModeButton;
