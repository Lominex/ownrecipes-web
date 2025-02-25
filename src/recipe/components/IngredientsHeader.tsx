import { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import { Form as ReduxForm } from 'react-final-form';

import { Recipe } from '../store/RecipeTypes';

// import IngredientButtons from './IngredientButtons';
import { PendingState, ReducerMeta } from '../../common/store/GenericReducerType';
import Icon from '../../common/components/Icon';
import InitialValuesResetter from '../../common/components/ReduxForm/ReInitialValuesResetter';
import ReInput from '../../common/components/ReduxForm/ReInput';

export interface IIngredientsHeaderProps {
  recipe:      Recipe | undefined;
  recipeMeta:  ReducerMeta;

  // lists: Array<any>;

  // bulkAdd: (listId: number) => void;
  // checkAllIngredients: () => void;
  // uncheckAllIngredients: () => void;

  // checkIngredient: (id: number, checked: boolean) => void;
  // checkSubRecipe:  (id: number, checked: boolean) => void;

  updateServings: (servings: number) => void;
}

export interface IFormDataProps {
  servings: number;
}

const IngredientsHeader: React.FC<IIngredientsHeaderProps> = ({
    recipe, recipeMeta, updateServings }: IIngredientsHeaderProps) => {
  const { formatMessage } = useIntl();
  const messages = defineMessages({
    ingredients: {
      id: 'recipe.ingredients',
      description: 'Ingredients',
      defaultMessage: 'Ingredients',
    },
    ingredients_for_servings: {
      id: 'recipe.ingredients_for_servings',
      description: 'Ingredients for[ n servings]',
      defaultMessage: 'Ingredients for',
    },
    servings: {
      id: 'recipe.servings',
      description: 'Servings',
      defaultMessage: 'Servings',
    },
    servings_input_tooltip: {
      id: 'recipe.servings_input_tooltip',
      description: 'Accessible tooltip for the (change) servings input',
      defaultMessage: 'Amount of servings',
    },
  });

  const customServings = recipe?.customServings;

  const handleSubmit = (form: IFormDataProps) => updateServings(form.servings);

  const initialValues: Partial<IFormDataProps> = useMemo(() => ({
    servings: customServings,
  }), [customServings]);

  const pending  = recipeMeta.pending;
  const servings = recipe?.customServings ?? 0;
  const hasNoIngredients = pending === PendingState.COMPLETED
      && recipe?.subrecipes != null && recipe.subrecipes.length === 0
      && recipe?.ingredientGroups != null && recipe.ingredientGroups.length === 0;

  return (
    <>
      {(hasNoIngredients || servings === 0) && <h2>{formatMessage(messages.ingredients)}</h2>}
      {!hasNoIngredients && servings > 0 && (
        <div className='ingredients-for-servings-row'>
          <h2>
            {formatMessage(messages.ingredients_for_servings)}
            <span className='print-only'>{`: ${recipe?.customServings ?? ''} ${formatMessage(messages.servings)}`}</span>
          </h2>
          <div className='custom-servings print-hidden'>
            <ReduxForm
                initialValues = {initialValues}
                onSubmit = {handleSubmit}
                subscription = {{}}
                render = {({ form, handleSubmit: renderSubmit }) => (
                  <Form onSubmit={renderSubmit} className='custom-servings'>
                    <InitialValuesResetter form={form} initialValues={initialValues} />
                    <ReInput
                        name  = 'servings'
                        type  = 'number'
                        aria-label = {formatMessage(messages.servings_input_tooltip)}
                        min   = {0}
                        max   = {1000}
                        autoComplete = 'off' />
                    <Button type='submit' variant='primary'>
                      <Icon icon='arrow-repeat' variant='light' />
                      {formatMessage(messages.servings)}
                    </Button>
                  </Form>
                )} />
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientsHeader;
