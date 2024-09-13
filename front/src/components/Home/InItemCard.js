import { useNavigate } from 'react-router-dom';

// import Link from '@/components/page-builder/Render/components/Link';

import { Link } from 'react-router-dom';

const parseMojavez = (arr) => {
  if (!arr) return '';
  if (!Array.isArray(arr)) return '';

  // TODO: remove
  arr = arr.filter((i) => i !== 'new99');

  return arr.join(' , ');
};

export default function ItemCard({ item = {} }) {
  const { data = {} } = item;

  const navigate = useNavigate();

  const mojavez = parseMojavez(data.mojavez);

  return (
    <div className="ad-card-main-div my-2 p-3 fs-6">
      <h2 className="text-primary fs-5 m-0">{item.title['fa']}</h2>
      <div className="text-danger mt-2">{`ردیف تعرفه: ${item.sku || ''}`}</div>
      {mojavez ? <div className="mt-2">{`مجوز ها: ${mojavez}`}</div> : null}

      {data.group1 && (
        <div className="mt-2">
          {`اولویت: ${data.group1 || ''} ${data.emkan}`}
        </div>
      )}
      {data.importduty && (
        <div className="mt-2">{`ماخذ: ${data.importduty || ''}`}</div>
      )}
      {data.spec_title && (
        <div
          className="mt-2"
          style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to={`/title/${data.spec_title.number}`}>
            سرفصل: {data.spec_title.title}
          </Link>
          <button
            onClick={() => navigate(`/title/${data.spec_title.number}`)}
            className="btn-primary"
            style={{ borderRadius: '1rem', padding: '0.5rem' }}>
            مشاهده سرفصل
          </button>
        </div>
      )}
    </div>
  );
}
