import { defineMessages, useIntl } from 'react-intl';
import classNames from 'classnames';

import '../css/directions.css';

import { IngredientGroup } from '../store/RecipeTypes';
import P from '../../common/components/P';
import { PendingState, ReducerMeta } from '../../common/store/GenericReducerType';
import Loading from '../../common/components/Loading';
import Directions from './Directions';

export interface IDirectionsPanelProps {
  directions: string;
  recipeMeta: ReducerMeta;
  ingredients: Array<IngredientGroup>;
}

const DirectionsPanel: React.FC<IDirectionsPanelProps> = ({
    directions: directionsString, recipeMeta, ingredients }: IDirectionsPanelProps) => {
  const { formatMessage } = useIntl();
  const messages = defineMessages({
    directions: {
      id: 'recipe.directions',
      description: 'Directions',
      defaultMessage: 'Directions',
    },
    no_directions: {
      id: 'recipe.directions.no_directions',
      description: 'No directions provided message',
      defaultMessage: '(This recipe has no directions.)',
    },
  });

  const pending = recipeMeta.pending;
  const hasNoData = pending === PendingState.COMPLETED
      && directionsString.trim().length <= 1; // Ignore single fake char.

  const isMultiDirections = directionsString.includes(':\n');

  return (
    <article className={classNames('directions-panel', { 'multi-directions': isMultiDirections })}>
      <h2>{formatMessage(messages.directions)}</h2>
      {pending === PendingState.LOADING && directionsString === '' && <Loading />}
      {hasNoData && (
        <P className='placeholder'>{formatMessage(messages.no_directions)}</P>
      )}
      {!hasNoData && (
        <div className='direction-groups'>
          <Directions directions={directionsString} ingredients={ingredients} />
        </div>
      )}
    </article>
  );
};

export default DirectionsPanel;
