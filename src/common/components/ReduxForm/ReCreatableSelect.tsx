/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import { formatValidation, requiredValidator } from '../../store/Validation';
import { CreatableSelect, ICreatableSelectValues } from '../Input/Select';

export type IReCreatableSelectProps = {
  parser: (newValue: any | null) => any | undefined;
  formatter: (newValue: Array<any> | any) => any;
} & Omit<ICreatableSelectValues, 'value' | 'onChange'>;

const ReCreatableSelect = forwardRef<CreatableSelect, IReCreatableSelectProps>(({
    parser, formatter,
    name, required, isMulti,
    onFocus, onBlur, ...rest }: IReCreatableSelectProps, ref) => {
  const intl = useIntl();

  const formatValue = (value: Array<any> | any | undefined) => {
    if (value == null) {
      return isMulti ? [] : undefined;
    } else {
      return formatter(value);
    }
  };

  return (
    <Field name={name} validate={required ? requiredValidator : undefined} validateFields={[]}>
      {fprops => (
        <CreatableSelect
            {...rest}
            isMulti  = {isMulti}
            required = {required}

            name     = {fprops.input.name}
            value    = {formatValue(fprops.input.value)}
            errors   = {formatValidation(intl, fprops.meta.error || (!fprops.meta.dirtySinceLastSubmit ? fprops.meta.submitError : undefined))}
            meta     = {fprops.meta}
            onChange = {(_name: string, value: boolean) => { fprops.input.onChange(parser(value)); }}
            onFocus  = {(event: React.FocusEvent<HTMLElement, Element>) => { fprops.input.onFocus(event); onFocus?.(event); }}
            onBlur   = {(event: React.FocusEvent<HTMLElement, Element>) => { fprops.input.onBlur(event);  onBlur?.(event); }}
            ref = {ref} />
      )}
    </Field>
  );
});

export default ReCreatableSelect;
