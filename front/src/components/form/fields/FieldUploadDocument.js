import React, { memo, useState } from 'react';
import { Field } from 'react-final-form';
import { Button, Col } from 'shards-react';
import { MainUrl, uploadMedia } from '#c/functions/index';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getField } from '#c/components/form/fields';
import { useTranslation } from 'react-i18next';

function FieldUploadDocument({ field }) {
  const { t } = useTranslation();
  const {
    type,
    kind,
    size,
    className,
    name,
    label,
    options,
    placeholder,
    value,
  } = field;
  let [theVal, setTheVal] = useState(value);

  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>
      <input
        name={name}
        accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip"
        // component="input"
        type="file"
        placeholder={placeholder ? placeholder : label ? t(label) : t(name)}
        onChange={(e) => {
          field.setValue(name, e.target.value);
        }}
        className="mb-2 form-control ltr"
      />
    </Col>
  );
}
export default memo(FieldUploadDocument);
