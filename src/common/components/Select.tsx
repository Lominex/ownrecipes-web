import classNames from 'classnames';
import { createRef } from 'react';
import { Form } from 'react-bootstrap';
import SelectReact, { MultiValue, SingleValue } from 'react-select';
import CreatableSelectReact from 'react-select/creatable';
// import AsyncReact from 'react-select/async';

import '../css/select.css';

import BaseComponent, { IBaseComponentProps } from './BaseComponent';
import ConditionalWrapper from './ConditionalWrapper';
import Tooltip from './Tooltip';

/*
export class Async extends BaseComponent {
  handleChange(data) {
    this.setState({
      value: data,
    });

    if (this.props.change) {
      this.props.change(this.props.name, data ? data.value : '');
      this.props.change(this.props.title, data ? data.label : '');
    }
  }

  render() {
    return (
      <div className={this.props.class} key={this.props.id}>
        <div className={`form-group ${this.hasErrors() ? 'has-error' : null}`}>
          { this.props.label ? <label>{ this.props.label }</label> : null }
          <AsyncReact
              name = {this.props.name}
              value = {this.props.value}
              onChange = {this.handleChange}
              loadOptions = {this.props.loadOptions}
          />
          { this.getErrorMessage() }
        </div>
      </div>
    );
  }
}
*/

export type SelectDataType = { value: string, label: string };

interface ISelectProps extends IBaseComponentProps {
  value?: string;
  data?:  Array<SelectDataType>;

  onChange?: (name: string, newValue: string | undefined) => void;
}

// eslint-disable-next-line import/prefer-default-export
export class Select extends BaseComponent<ISelectProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ref = createRef<any>();

  focus(): boolean { // eslint-disable-line react/no-unused-class-component-methods
    if (this.ref != null && this.ref.current) {
      this.ref.current.focus();
      return true;
    }
    return false;
  }

  handleChange = (data: SingleValue<SelectDataType>) => {
    this.setState({
      value: data,
    });

    if (this.props.onChange) {
      this.props.onChange(this.props.name, data?.value);
    }
  };

  render() {
    const selectedOption = this.props.data?.find(o => o.value === this.props.value);
    return (
      <Form.Group
          controlId = {this.props.name}
          className = {classNames('form-group', this.props.className, {
            error:    this.hasError(),
            readonly: this.props.readOnly,
            required: this.props.required && !this.props.readOnly,
          })}>
        <ConditionalWrapper
            condition = {this.props.tooltip != null}
            render    = {childr => <Tooltip id={`${this.props.name}-tooltip`} tooltip={this.props.tooltip}>{childr}</Tooltip>}>
          {this.getLabel({ htmlFor: `${this.props.name}-input` })}
          {this.getHelpText()}
          {this.getErrorMessage()}
          <SelectReact
              name     = {this.props.name}
              value    = {selectedOption}
              options  = {this.props.data}
              onChange = {this.handleChange}
              placeholder = ''
              ref = {this.ref} />
        </ConditionalWrapper>
      </Form.Group>
    );
  }
}

export interface ICreatableSelectValues extends IBaseComponentProps {
  value?:   Array<string> | string;
  data?:    Array<SelectDataType>;
  isMulti?: boolean;
}
interface ICreatableSelectProps extends ICreatableSelectValues {
  onChange?: (name: string, newValue: any | undefined) => void;
}

interface ICreatableSelectState {
  options: Array<SelectDataType>;
}

const isValidNewOption = (value: string): boolean => !!value;

function findSelectedOptions(options: Array<SelectDataType>, value: Array<string> | string | undefined): Array<SelectDataType> | SelectDataType {
  if (Array.isArray(value)) {
    return options.filter(o => value.includes(o.value));
  } else {
    return options.find(o => o.value === value) ?? '' as unknown as SelectDataType;
  }
}

export class CreatableSelect extends BaseComponent<ICreatableSelectProps, ICreatableSelectState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ref = createRef<any>();

  constructor(props: ICreatableSelectProps) {
    super(props);

    this.state = {
      options: [],
    };
  }

  focus(): boolean { // eslint-disable-line react/no-unused-class-component-methods
    if (this.ref != null && this.ref.current) {
      this.ref.current.focus();
      return true;
    }
    return false;
  }

  handleChange = (data: MultiValue<SelectDataType> | SingleValue<SelectDataType>) => {
    if (this.props.onChange) {
      this.props.onChange(
        this.props.name,
        data != null && Array.isArray(data) ? data.map(dat => dat.value) : (data as SingleValue<SelectDataType>)?.value
      );
    }
  };

  handleCreate = (inputValue: string) => {
    const newOption: SelectDataType = { value: inputValue, label: inputValue };
    this.setState(prev => (
        {
          options: [...prev.options, newOption],
        }
      ),
      () => {
        if (!this.props.isMulti) {
          this.handleChange(newOption);
        } else {
          const dataOptions = this.props.data ?? [];
          const options = dataOptions.concat(this.state.options);
          const selectedOptions = findSelectedOptions(options, [...(this.props.value as Array<string> | undefined ?? []), inputValue]);
          this.handleChange(selectedOptions);
        }
      });
  };

  render() {
    const dataOptions = this.props.data ?? [];
    const options = dataOptions.concat(this.state.options);
    const selectedOptions = findSelectedOptions(options, this.props.value);

    return (
      <Form.Group
          className = {classNames('form-group', this.props.className, {
            error:    this.hasError(),
            readonly: this.props.readOnly,
            required: this.props.required && !this.props.readOnly,
          })}>
        <ConditionalWrapper
            condition = {this.props.tooltip != null}
            render    = {childr => <Tooltip id={`${this.props.name}-tooltip`} tooltip={this.props.tooltip}>{childr}</Tooltip>}>
          {this.getLabel({ htmlFor: `${this.props.name}-input` })}
          {this.getHelpText()}
          {this.getErrorMessage()}
          <CreatableSelectReact
              inputId = {`${this.props.name}-input`}
              onChange = {this.handleChange}
              isValidNewOption = {isValidNewOption}
              onCreateOption = {this.handleCreate}
              isClearable
              isMulti = {this.props.isMulti}
              value = {selectedOptions}
              className = 'react-select-container'
              classNamePrefix = 'creatable-select'
              options = {options}
              placeholder = ''
              ref = {this.ref} />
        </ConditionalWrapper>
      </Form.Group>
    );
  }
}
