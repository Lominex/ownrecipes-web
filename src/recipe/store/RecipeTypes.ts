import { Dispatch as ReduxDispatch } from 'redux';

import { NUMBER_UNDEFINED } from '../../common/constants';
import ItemReducerType from '../../common/store/ItemReducerType';
import { GenericItemReducerAction } from '../../common/store/ReduxHelper';

export type Quantity = {
  numerator?:   number;
  denominator:  number;
  measurement?: string;
}

export type IngredientInput = {
  title:        string;

  quantity?:    string;
  checked?:     boolean;
} & Partial<Quantity>;

export type IngredientDto = {
  id:           number;
  title:        string;
} & Quantity;
export type Ingredient = {
  id:           number;
  title:        string;

  quantity?:    string;
  checked?:     boolean;
} & Quantity;
export const toIngredientDto = (obj: Ingredient): IngredientDto => ({
  id:    obj.id,
  title: obj.title,

  numerator:   obj.numerator,
  denominator: obj.denominator,
  measurement: obj.measurement,
});
export const toIngredient = (dto: IngredientDto): Ingredient => ({
  id:    dto.id,
  title: dto.title,

  numerator:   dto.numerator && dto.numerator > 0 ? dto.numerator : undefined,
  denominator: dto.denominator,
  measurement: dto.measurement,
});

export type IngredientGroupDto = {
  title:       string;
  ingredients: Array<IngredientDto>;
}
export type IngredientGroup = {
  title:       string;
  ingredients: Array<Ingredient>;
}
export const toIngredientGroupDto = (obj: IngredientGroup): IngredientGroupDto => ({
  title:       obj.title,
  ingredients: obj.ingredients.map(i => toIngredientDto(i)),
});
export const toIngredientGroup = (dto: IngredientGroupDto): IngredientGroup => ({
  title:       dto.title,
  ingredients: dto.ingredients.map(i => toIngredient(i)),
});

export type SubRecipeDto = {
  title:       string;
  slug:        string;
  child_recipe_id: number;
  parent_recipe_id?: number;

  measurement?: string;
} & Quantity;

export type SubRecipe = {
  title:       string;
  slug:        string;
  child_recipe_id:   number;
  parent_recipe_id?: number;
  measurement?: string;

  quantity?:   string;
  checked?:    boolean;
} & Quantity;
export const toSubRecipeDto = (obj: SubRecipe): SubRecipeDto => ({
  title: obj.title,
  slug:  obj.slug,
  child_recipe_id:  obj.child_recipe_id,
  parent_recipe_id: obj.parent_recipe_id,

  measurement: obj.measurement,
  numerator:   obj.numerator,
  denominator: obj.denominator,
});
export const toSubRecipe = (dto: SubRecipeDto): SubRecipe => ({
  title: dto.title,
  slug:  dto.slug,
  child_recipe_id:  dto.child_recipe_id,
  parent_recipe_id: dto.parent_recipe_id,

  measurement: dto.measurement,
  numerator:   dto.numerator,
  denominator: dto.denominator,
});

export type CourseDto = {
  id:    number;
  title: string;
}

export type Course = {
  id:    number;
  title: string;
}

export const toCourse = (dto: CourseDto): Course => ({
  id:    dto.id,
  title: dto.title,
});

export const toCourseDto = (obj: Course): CourseDto => ({
  id:    obj.id,
  title: obj.title,
});

export type CuisineDto = {
  id:    number;
  title: string;
}

export type Cuisine = {
  id:    number;
  title: string;
}

export const toCuisine = (dto: CuisineDto): Cuisine => ({
  id:    dto.id,
  title: dto.title,
});

export const toCuisineDto = (obj: Cuisine): CuisineDto => ({
  id:    obj.id,
  title: obj.title,
});

export type TagDto = {
  id:    number;
  title: string;
  slug:  string;
}

export type Tag = {
  id:    number;
  title: string;
  slug:  string;
}

export const toTag = (dto: TagDto): Tag => ({
  id:    dto.id,
  title: dto.title,
  slug:  dto.slug,
});

export type RecipeListDto = {
  id:    number;
  title: string; // Tasty Chili 24
  slug:  string; // tasty-werwerchili-4

  photo_thumbnail?: string | null;

  info:     string;
  rating:   number;
  pub_date: string; // 2011-05-20
}

export type RecipeList = {
  id:    number;
  title: string; // Tasty Chili 24
  slug:  string; // tasty-werwerchili-4

  photoThumbnail?: string;

  info:     string;
  rating:   number;
  pubDate:  Date; // 2011-05-20
}

export const toRecipeList = (dto: RecipeListDto): RecipeList => ({
  id:    dto.id,
  title: dto.title,
  slug:  dto.slug,

  photoThumbnail: dto.photo_thumbnail ?? undefined,

  info: dto.info,
  rating: dto.rating,
  pubDate: new Date(dto.pub_date),
});

export type RecipeDto = {
  username:    string;
  author:      number;
  source:      string;

  cook_time: number;
  prep_time: number;
  servings:  number;

  course:  Course;
  cuisine: Cuisine;
  tags:    Array<TagDto>;

  photo?: string | null;

  subrecipes: Array<SubRecipeDto>;
  ingredient_groups: Array<IngredientGroupDto>;

  directions: string;

  public: boolean;
  update_date: string;

  customServings: number;
} & RecipeListDto;

export type Recipe = {
  username:    string;
  author:      number;
  source:      string;

  cookTime?: number;
  prepTime?: number;
  servings:  number;

  course:  Course;
  cuisine: Cuisine;
  tags:    Array<Tag>;

  photo?: string;

  subrecipes: Array<SubRecipe>;
  ingredientGroups: Array<IngredientGroup>;

  directions: string;

  public: boolean;
  updateDate: Date;

  customServings: number;
} & RecipeList;

export const toRecipe = (dto: RecipeDto): Recipe => ({
  id:    dto.id,
  title: dto.title,
  slug:  dto.slug,

  username: dto.username,
  author:   dto.author,
  source:   dto.source,

  cookTime: parseBackendNumber(dto.cook_time),
  prepTime: parseBackendNumber(dto.prep_time),
  servings: dto.servings,

  course:  toCourse(dto.course),
  cuisine: toCuisine(dto.cuisine),
  tags:    dto.tags.map(t => toTag(t)),

  photo: dto.photo ?? undefined,
  photoThumbnail: dto.photo_thumbnail ?? undefined,

  subrecipes: dto.subrecipes.map(sr => toSubRecipe(sr)),
  ingredientGroups: dto.ingredient_groups.filter(ig => ig.ingredients.length > 0).map(ig => toIngredientGroup(ig)),

  directions: dto.directions,
  info: dto.info,

  rating: dto.rating,
  public: dto.public,
  pubDate: new Date(dto.pub_date),
  updateDate: new Date(dto.update_date),

  customServings: dto.servings,
});

export type RecipeRequest = {
  title:      string;

  source:     string;

  cook_time:  number;
  prep_time:  number;
  servings:   number;

  tags:       Array<TagDto>;
  course:     CourseDto;
  cuisine:    CuisineDto;

  subrecipes: Array<SubRecipeDto>;
  ingredient_groups: Array<IngredientGroupDto>;
  directions: string;
  info:       string;

  public:     boolean;
};

function ifNull<T>(val: T | undefined, d: T): T {
  if (val == null || (typeof val === 'string' && val === '')) return d;
  return val;
}
function parseBackendNumber(val: number): number | undefined {
  if (val === NUMBER_UNDEFINED) return undefined;
  return val;
}

export const toRecipeRequest = (obj: Recipe): RecipeRequest => ({
  title:      obj.title,

  source:     obj.source,

  cook_time:  ifNull(obj.cookTime, NUMBER_UNDEFINED),
  prep_time:  ifNull(obj.prepTime, NUMBER_UNDEFINED),
  servings:   obj.servings,

  tags:       obj.tags,
  course:     toCourseDto(obj.course),
  cuisine:    toCuisineDto(obj.cuisine),

  subrecipes: obj.subrecipes?.map(sr => toSubRecipeDto(sr)) ?? [],
  ingredient_groups: obj.ingredientGroups?.filter(ig => ig.ingredients.length > 0).map(ig => toIngredientGroupDto(ig)),
  directions: obj.directions,
  info:       obj.info,

  public:     obj.public,
});

export enum RecipeActionTypes {
  RECIPE_DELETE = 'RECIPE_DELETE',
  RECIPE_INGREDIENT = 'RECIPE_INGREDIENT',
  RECIPE_INGREDIENT_CHECK_INGREDIENT = 'RECIPE_INGREDIENT_CHECK_INGREDIENT',
  RECIPE_INGREDIENT_CHECK_SUBRECIPE = 'RECIPE_INGREDIENT_CHECK_SUBRECIPE',
  RECIPE_INGREDIENT_CHECK_ALL = 'RECIPE_INGREDIENT_CHECK_ALL',
  RECIPE_INGREDIENT_UNCHECK_ALL = 'RECIPE_INGREDIENT_UNCHECK_ALL',
  RECIPE_INGREDIENT_SERVINGS_UPDATE = 'RECIPE_INGREDIENT_SERVINGS_UPDATE',
  RECIPE_INGREDIENT_SERVINGS_RESET = 'RECIPE_INGREDIENT_SERVINGS_RESET',
  RECIPE_LIST_BLANK = 'RECIPE_LIST_BLANK',
  RECIPE_LIST_LOADING = 'RECIPE_LIST_LOADING',
  RECIPE_LIST_COMPLETE = 'RECIPE_LIST_COMPLETE',
  RECIPE_LIST_ERROR = 'RECIPE_LIST_ERROR',
}

export const RECIPE_STORE = '@@recipe';

export interface IRecipeSlugAction {
  store: typeof RECIPE_STORE;
  type:  typeof RecipeActionTypes.RECIPE_DELETE;
  data:  { slug: string };
}

export interface IRecipeIngredientUpdateServingAction {
  store: typeof RECIPE_STORE;
  type:  typeof RecipeActionTypes.RECIPE_INGREDIENT_SERVINGS_UPDATE;
  recipeSlug:     string;
  customServings: number;
}

export interface IRecipeIngredientServingSimpleAction {
  store: typeof RECIPE_STORE;
  type: typeof RecipeActionTypes.RECIPE_INGREDIENT_SERVINGS_RESET
      | typeof RecipeActionTypes.RECIPE_INGREDIENT_CHECK_ALL
      | typeof RecipeActionTypes.RECIPE_INGREDIENT_UNCHECK_ALL;
  recipeSlug: string;
}

export interface IRecipeIngredientCheckIngredientAction {
  store: typeof RECIPE_STORE;
  type:  typeof RecipeActionTypes.RECIPE_INGREDIENT_CHECK_INGREDIENT;
  recipeSlug: string;
  id:    number;
  value: boolean;
}

export interface IRecipeIngredientCheckSubRecipeAction {
  store: typeof RECIPE_STORE;
  type:  typeof RecipeActionTypes.RECIPE_INGREDIENT_CHECK_SUBRECIPE;
  recipeSlug: string;
  id:    number;
  value: boolean;
}

export type RecipeState     = ItemReducerType<Recipe>;
export type RecipeAction    = IRecipeSlugAction | IRecipeIngredientUpdateServingAction
   | IRecipeIngredientServingSimpleAction | IRecipeIngredientCheckIngredientAction | IRecipeIngredientCheckSubRecipeAction | GenericItemReducerAction<Recipe>;
export type RecipeDispatch  = ReduxDispatch<RecipeAction>;
