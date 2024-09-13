import { Typography } from '@mui/material';
import { useMemo } from 'react';
import _get from 'lodash/get';

/**
 * Parses the data object and returns a new object with selected properties.
 * @param {Object} d - The data object to be parsed.
 * @returns {Object} - The parsed data object.
 */
export const parseData = (d) => ({
  _id: d._id,
  title: _get(d, 'title.fa', ''),
  tariff: d.sku || '',
  value: Number(_get(d, 'data.arzesh', 0)).toFixed(4),
  currency: _get(d, 'data.dolar', ''),
  unit: _get(d, 'data.number', ''),
});

/**
 * Renders an item card component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item data.
 * @returns {JSX.Element} The rendered item card component.
 */
export default function ItemCard({ item }) {
  const DATA = useMemo(() => parseData(item), [item]);
  return (
    <div className="ad-card-col nbghjk">
      <div className="ad-card-main-div">
        <div className="post-content-style initem">
          <div className="ad-card-content">
            <Typography variant="h6" component="h3">
              {DATA.title}
            </Typography>
            <div className="d-flex justify-content-sb">
              <span className="d-f-item">
                <span>ردیف تعرفه: </span>
                {DATA.tariff}
              </span>
              <span className="d-f-item">
                <span>ارزش گمرکی: </span>

                {DATA.value}
              </span>
            </div>
            <div className="d-flex justify-content-sb">
              <span className="d-f-item">
                <span>نوع ارز: </span>

                {DATA.currency}
              </span>
              <span className="d-f-item">
                <span>نوع واحد کالا: </span>

                {DATA.unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
