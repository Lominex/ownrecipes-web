import * as _ from 'lodash';
import { IntlShape } from 'react-intl';

import env, { EnvType } from '../env';

export function isDemoMode(): boolean {
  return getEnvAsBoolean('REACT_APP_DEMO', false);
}

export function getRecipeImagePlaceholder(): string {
  return `${getEnv('PUBLIC_URL')}/images/fried-eggs.jpg`;
}

export function getRecipeImage(photoThumbnail: string | undefined, loadingError = false) {
  return !loadingError ? (photoThumbnail ?? '') : getRecipeImagePlaceholder();
}

export function getResourcePath(path: string): string {
  return `${getEnv('PUBLIC_URL')}${path}`;
}

export function getEnv(key: keyof EnvType, ifNull?: string): string | undefined {
  return env[key] ?? ifNull;
}

export function getEnvAsBoolean(key: keyof EnvType, ifNull = false): boolean {
  const val = getEnv(key);
  if (val == null) return ifNull;
  const valLowerCase = val.toLocaleLowerCase();
  return ['true', 'yes', '1'].includes(valLowerCase);
}

export function requireEnv(key: keyof EnvType): string {
  const val = getEnv(key);
  if (val == null || val.length === 0) {
    throw new Error(`Invalid setup: The .env-variable "${key}" is missing. Please check your .env-files and rebuild.`);
  }
  return val;
}

export function isNumber(str: string): boolean {
  if (typeof str !== 'string') return false; // we only process strings!
  const strTimmed = str.trim();
  if (strTimmed.endsWith('.') || strTimmed.endsWith(',')) return false;
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateFormData(prev: any, id: string, newValue: unknown): any {
  const updFormData = _.cloneDeep(prev);
  _.set(updFormData, id, newValue);
  return updFormData;
}

export function optionallyFormatMessage(intl: IntlShape, baseMessageId: string, msgId: string, values?: Record<string, React.ReactNode>): string {
  const fullMsgId = `${baseMessageId}${msgId}`;
  const msg = intl.messages[fullMsgId];

  if (msg == null) {
    return msgId;
  } else if (msg.length === 0) {
    return '';
  } else {
    // HACK: Ignore locales generator.
    return (intl as IntlShape).formatMessage({ id: fullMsgId }, values) as string;
  }
}

export function sortByLabel(a: { label: string }, b: { label: string}): number {
  return a.label.localeCompare(b.label);
}
