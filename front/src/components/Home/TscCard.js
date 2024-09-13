import { Typography, styled } from '@mui/material';
import { useMemo } from 'react';
import _get from 'lodash/get';

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '& > div': {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    fontSize: 14,
    marginBottom: theme.spacing(0.5),
    '& span': {
      fontWeight: 700,
      marginInlineEnd: theme.spacing(0.5),
      whiteSpace: 'nowrap',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    '& > div': {
      justifyContent: 'space-between',
    },
  },
}));

const parseData = (d) => ({
  _id: d._id,

  title: _get(d, 'title.fa', ''),
  tariff: _get(d, 'data.tarefe', ''),
  shenase: _get(d, 'data.shenase', ''),
  model: _get(d, 'data.model', ''),
  brand: _get(d, 'data.brand', ''),
  unit: _get(d, 'data.unit', ''),

  country: _get(d, 'data.country', ''),
  type: _get(d, 'data.type', ''),
  entryFeePercentage: _get(d, 'data.entryFeePercentage', ''),

  customsValue: _get(d, 'data.customsValue', 0),
  currency: _get(d, 'data.dolar', ''),
});

export default function TscCard({ item }) {
  const DATA = useMemo(() => parseData(item), [item]);

  return (
    <div className="ad-card-main-div">
      <div className="ad-card-content">
        <Typography variant="h5" component="h3" gutterBottom>
          {DATA.title}
        </Typography>

        <Row>
          <div>
            <span>تعرفه : </span>
            <b style={{ color: 'red' }}>{DATA.tariff}</b>
          </div>

          <div>
            <span>شناسه: </span>
            {DATA.shenase}
          </div>
        </Row>
        <Row>
          <div>
            <span>مدل و مشخصات فنی کالا: </span>
            {DATA.model}
          </div>
          <div>
            <span>برند کالا: </span>
            {DATA.brand}
          </div>
        </Row>
        <Row>
          <div>
            <span>کشور سازنده: </span>
            {DATA.country}
          </div>
          <div>
            <span>ارزش گمرکی: </span>
            {DATA.customsValue}
          </div>
        </Row>
        <Row>
          <div>
            <span>واحد کالا: </span>
            {DATA.unit}
          </div>

          <div>
            <span>درصد حق ورودی: </span>%{DATA.entryFeePercentage}
          </div>
        </Row>
        <Row>
          <div>
            <span>نوع خرید: </span>
            {DATA.type}
          </div>
        </Row>
      </div>
    </div>
  );
}
