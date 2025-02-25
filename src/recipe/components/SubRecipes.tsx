import classNames from 'classnames';
import { Table } from 'react-bootstrap';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

// import { Checkbox } from '../../common/components/FormComponents';
import { getRoutePath, optionallyFormatMessage } from '../../common/utility';
import { SubRecipe } from '../store/RecipeTypes';

export interface ISubRecipesProps {
  subRecipes: Array<SubRecipe> | undefined;

  // checkSubRecipe: (id: number, checked: boolean) => void;
}

const SubRecipes: React.FC<ISubRecipesProps> = ({ subRecipes /* , checkSubRecipe */ }: ISubRecipesProps) => {
  const intl = useIntl();

  const messages = defineMessages({
    subrecipes: {
      id: 'subrecipes.subrecipes heading',
      description: 'Subrecipes header',
      defaultMessage: 'Subrecipes',
    },
    quantity: {
      id: 'subrecipes.table.quantity',
      description: 'Subrecipes table quantity header',
      defaultMessage: 'Quantity',
    },
    subrecipe: {
      id: 'subrecipes.table.subrecipe',
      description: 'Subrecipes table ingredient header',
      defaultMessage: 'Subrecipe',
    },
  });

  const showQuantityCol = subRecipes == null || subRecipes.filter(sr => (
    (sr.quantity != null && sr.quantity.length > 0 && sr.quantity !== '0')
      || (sr.measurement != null && sr.measurement.length > 0)
  )).length > 0;

  const subRecipesList = subRecipes?.map((subRecipe, index) => {
    const quantityString    = subRecipe.quantity != null && subRecipe.quantity.length > 0 && subRecipe.quantity !== '0' ? subRecipe.quantity : '';
    const measurementString = subRecipe.measurement != null ? optionallyFormatMessage(intl, 'measurement.', subRecipe.measurement, { itemCount: subRecipe.quantity }) : '';
    const titleString       = subRecipe.title;

    return (
      <tr className='ingredient' key={String(subRecipe.child_recipe_id ?? index)}>
        {/*
        <Checkbox
            name    = {String(subRecipe.child_recipe_id)}
            checked = {subRecipe.checked ?? false}
            change  = {(_id, checked) => checkSubRecipe(subRecipe.child_recipe_id, checked)} /> */}
        {showQuantityCol && (
          <td className='quantity first-col'>
            <span>
              {quantityString}
              {quantityString != null && quantityString.length > 0 && measurementString.length > 0 && ' '}
              {measurementString}
            </span>
          </td>
        )}
        <td className={classNames('ingredient last-col', { 'first-col': showQuantityCol })}>
          <span>
            <Link to={getRoutePath(`/recipe/${subRecipe.slug}`)} className='title'>{titleString}</Link>
          </span>
        </td>
      </tr>
    );
  });

  if (subRecipesList == null || subRecipesList.length === 0) return null;

  return (
    <div className='subgroup ingredient-group'>
      <Table striped size='sm' className='table ingredients-table'>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <caption className='subheading h3'>{intl.formatMessage(messages.subrecipes)}:</caption>
        <thead className='hideme'>
          <tr>
            {showQuantityCol && <th><span>{intl.formatMessage(messages.quantity)}</span></th>}
            <th><span>{intl.formatMessage(messages.subrecipe)}</span></th>
          </tr>
        </thead>
        <tbody>
          {subRecipesList}
        </tbody>
      </Table>
    </div>
  );
};

export default SubRecipes;
