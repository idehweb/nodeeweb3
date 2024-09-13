import { useTranslation } from 'react-i18next';
import _truncate from 'lodash/truncate';
import { Link } from 'react-router-dom';

import { MainUrl } from '@/functions';
import { defaultImg } from '@/assets';
import { relativeDate } from '@/functions/dateHelpers';

export default function BlogCard({ onClick, item }) {
  const { t } = useTranslation();
  let date = relativeDate(item.updatedAt, t);

  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + '/' + item.photos[0];
  if (item.thumbnail) backgroundImage = MainUrl + '/' + item.thumbnail;
  const url =
    item && item.slug
      ? encodeURIComponent(item.slug.replace(/\\|\//g, ''))
      : item && typeof item.slug === 'string'
      ? item.slug
      : '';
  const title =
    item && item.title && item.title.fa
      ? item.title.fa
      : item && item.title && !item.title.fa
      ? item.title
      : '';

  return (
    <div className="ad-card-col nbghjk">
      <div className="ad-card-main-div">
        <div className="card-post__image" onClick={onClick}>
          <Link to={'/post/' + url + '/'}>
            <img
              alt={title}
              loading="lazy"
              src={backgroundImage || defaultImg}
            />
          </Link>
        </div>
        <div className={'post-content-style'}>
          <div className="ad-card-content">
            <span className="a-card-title">
              <Link to={'/post/' + url + '/'}>
                {_truncate(title, { length: 120 })}
              </Link>
            </span>
            <div className="wer textAlignLeft">{date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
