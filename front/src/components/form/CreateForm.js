import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { Button, Col, Row } from 'shards-react';
import { useSelector } from 'react-redux';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';

import { MainUrl, uploadMedia } from '@/functions';
import {
  FieldArray,
  FieldBoolean,
  FieldCheckbox,
  FieldCheckboxes,
  FieldJson,
  FieldNumber,
  FieldObject,
  FieldPrice,
  FieldSelect,
  FieldServer,
  FieldRadio,
  FieldTextarea,
  FieldUploadDocument,
  FieldUploadMedia,
} from '@/components/form/fields';
import DemoSteps from '@/components/page-builder/stepper/demo';
import LoadingContainer from '../common/LoadingContainer';

function isPromise(p) {
  if (
    p !== null &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
  )
    return true;

  return false;
}

const TheField = ({ field, t, fields, onSubmit }) => {
  if (!field) return <>no field</>;

  const {
    type,
    style,
    size,
    className,
    disabled = false,
    name,
    label,
    placeholder,
    required,
  } = field;

  // if ((type==='radiobuttonitem')) {
  //   return <Col
  //     sm={fields.sm ? fields.sm : ''}
  //     lg={fields.lg ? fields.lg : ''}
  //     className={clsx('MGD', className)}>
  //     <label htmlFor={name}>{fields.label}</label>

  //       {/* <input type="radio" id="radioApple" name="radioFruit" value="apple" checked />
  //       <label for="radioApple">Apple</label> */}

  //     <Field
  //       name={fields.name}
  //       component="radio"
  //       type="radio"
  //       placeholder={fields.placeholder ? fields.placeholder : ''}
  //       className="mb-2 form-control"
  //       disabled={disabled}
  //       style={dynamicStyle}

  //     />
  //   </Col>
  // }
  switch (type) {
    case 'radiobuttonlists':
      return (
        <Col
          sm={fields.sm ? fields.sm : ''}
          lg={fields.lg ? fields.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{fields.label}</label>
          <div className="radio-toolbar">
            <input
              type="radio"
              id="radioApple"
              name="radioFruit"
              value="apple"
              checked
            />
            <label for="radioApple">Apple</label>
          </div>
          {/*
  
  
  
  
        <Field
          name={fields.name}
          component="button"
          type="button"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}
  
        /> */}
        </Col>
      );
    case 'document':
      return <FieldUploadDocument field={field} />;
    case 'media':
      return <FieldUploadMedia field={field} />;

    case 'button':
      return (
        <Col
          sm={fields.sm ? fields.sm : ''}
          lg={fields.lg ? fields.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{fields.label}</label>
          <Field
            name={fields.name}
            component="button"
            type="button"
            placeholder={fields.placeholder ? fields.placeholder : ''}
            className="mb-2 form-control"
            disabled={disabled}
            // style={dynamicStyle}
          />
        </Col>
      );

    case 'date':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <Field
            name={name}
            component="input"
            type="date"
            placeholder={placeholder || label}
            className="mb-2 form-control"
            style={style}
          />
        </Col>
      );

    case 'steps':
      return <DemoSteps field={field} onSubmit={onSubmit} />;

    case 'price':
      return <FieldPrice field={field} />;

    case 'json':
      return <FieldJson field={field} />;

    case 'object':
      return <FieldObject field={field} />;

    case 'array':
      return <FieldArray field={field} />;

    case 'checkbox':
      return <FieldCheckbox field={field} />;

    case 'checkboxes':
      return <FieldCheckboxes field={field} />;

    case 'radio':
      return <FieldRadio field={field} />;

    case 'select':
      return <FieldSelect field={field} style={style} />;

    case 'server':
      return <FieldServer field={field} />;

    case 'number':
      return <FieldNumber field={field} />;

    case 'string':
    case 'input':
    case '':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label || label}</label>
          <Field
            name={name}
            component="input"
            type="text"
            placeholder={placeholder || label}
            className="mb-2 form-control"
            disabled={disabled}
            style={style}
            required={required}
          />
          {/*<FieldText*/}
          {/*  name={name}*/}
          {/*  component="input"*/}
          {/*  type="text"*/}
          {/*  placeholder={placeholder || label}*/}
          {/*  className="mb-2 form-control"*/}
          {/*  disabled={disabled}*/}
          {/*  style={style}*/}
          {/*/>*/}
        </Col>
      );

    case 'textarea':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label === name ? '' : label}</label>
          <FieldTextarea
            name={name}
            style={style}
            placeholder={placeholder || label}
            className="mb-2 form-control"
          />
        </Col>
      );

    case 'boolean':
      return <FieldBoolean field={field} />;

    case 'image':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{t(label)}</label>
          <Field style={style} name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className="max-width100">
                  <img
                    loading="lazy"
                    alt="img"
                    style={{ width: '100px' }}
                    src={MainUrl + '/' + props.input.value}
                  />
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let { target } = props;
                        console.log(props);
                        console.log(target.files[0]);
                        uploadMedia(target.files[0], (e) => {
                          // console.log('e', e)
                        }).then((x) => {
                          if (x.success && x.media && x.media.url) {
                            // console.log('set', name, x.media.url)

                            field.setValue(name, x.media.url);
                          }
                        });
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <div className={'posrel'}>
                      <img
                        src={MainUrl + '/' + props.input.value}
                        loading="lazy"
                        alt="img"
                      />
                      <Button
                        onClick={(e) => {
                          field.setValue(name, '');
                        }}
                        className={'removeImage'}>
                        <RemoveCircleOutlineIcon />
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          </Field>
        </Col>
      );

    case 'images':
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <Field style={style} name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className={'max-width100'}>
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let { target } = props;
                        uploadMedia(target.files[0], (e) => {
                          console.log('e', e);
                        }).then((x) => {
                          if (x.success && x.media && x.media.url) {
                            field.setValue(name, x.media.url);
                          }
                        });
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <img
                      src={MainUrl + '/' + props.input.value}
                      alt="img"
                      loading="lazy"
                    />
                  )}
                </div>
              );
            }}
          </Field>
        </Col>
      );
    default:
      return null;
  }
};

export default function CreateForm({
  fields,
  rules = { fields: [] },
  theFields = undefined,
  formFieldsDetail = {},
  ...props
}) {
  const { t } = useTranslation();

  const themeData = useSelector((st) => st.store.themeData);

  const [loading, setLoading] = useState(false);
  const [theRules, setTheRules] = useState({ ...{ fields: rules.fields } });

  useEffect(() => {
    if (
      !theRules ||
      (theRules && !theRules.fields) ||
      (theRules.fields && !theRules.fields[0])
    ) {
      Object.keys(fields).forEach((fi) => {
        let typ = typeof fields[fi];
        if (fields[fi] instanceof Array) {
          typ = 'select';
        }
        rules.fields.push({
          name: fi,
          type: typ,
        });
      });
      setTheRules(rules);
    } else {
      setTheRules(rules);
    }
  }, [theRules, fields, rules]);

  if (!themeData) return;

  const onSubmit = (v, form) => {
    if (!props.onSubmit) return;

    let values = v;

    setLoading(true);
    if (theRules && theRules.fields)
      theRules.fields.forEach((item, i) => {
        if (
          item.type === 'object' &&
          values[item.name] instanceof Array &&
          item.value
        ) {
          let obj = {};
          item.value.forEach((its) => {
            if (its) obj[its.property] = its.value;
          });
          values[item.name] = obj;
        }
      });

    if (isPromise(props.onSubmit)) {
      props
        .onSubmit(values)
        .then(() => form.reset())
        .finally(() => setLoading(false));
    } else {
      props.onSubmit(values);
      // form.reset();
      setLoading(false);
    }
  };

  return (
    <LoadingContainer loading={loading}>
      <Form
        onSubmit={onSubmit}
        initialValues={fields}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <form
            onSubmit={handleSubmit}
            className="container"
            id={formFieldsDetail._id || ''}>
            <Row>
              {theFields
                ? theFields.map((field, index) => {
                    if (fields[field.name]) field.value = fields[field.name];

                    let lastObj = {
                      id: index,
                      type: field.type,
                      label: field.name,
                      name: field.name,
                      size: {
                        sm: 6,
                        lg: 6,
                      },
                      onChange: (text) => {},
                      className: 'rtl',
                      placeholder: '',
                      child: [],
                      setValue: form.mutators.setValue,
                      ...field,
                    };
                    if (field.value) lastObj['value'] = field.value;

                    return (
                      <TheField
                        t={t}
                        fields={fields}
                        onSubmit={onSubmit}
                        key={index}
                        field={lastObj}
                      />
                    );
                  })
                : theRules?.fields?.map((field, index) => {
                    if (fields[field.name]) {
                      field.value = fields[field.name];
                    }
                    let lastObj = {
                      id: index,
                      type: field.type,
                      label: field.name,
                      name: field.name,
                      size: {
                        sm: 6,
                        lg: 6,
                      },
                      onChange: (text) => {},
                      className: 'rtl',
                      placeholder: '',
                      child: [],
                      setValue: form.mutators.setValue,
                      ...field,
                    };
                    if (field.value) {
                      lastObj['value'] = field.value;
                    }
                    return (
                      <TheField
                        t={t}
                        fields={fields}
                        onSubmit={onSubmit}
                        key={index}
                        field={lastObj}
                      />
                    );
                  })}
              {formFieldsDetail.showSubmitButton && (
                <div className="buttons">
                  <Button type="submit">{t('Submit')}</Button>
                </div>
              )}
            </Row>
          </form>
        )}
      />
    </LoadingContainer>
  );
}
