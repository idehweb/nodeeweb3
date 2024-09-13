import { useCallback, useEffect, useState, lazy } from 'react';
import { Col, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Meta } from 'react-head';

import { NormalizeString } from '@/helpers';
import EmptyList from '@/components/common/EmptyList';
import Loading from '@/components/common/Loading';
import { getEntitiesWithCount, isClient } from '@/functions';

import { MyPagination } from './components';

const AdsCard = lazy(() => import('@/components/Home/AdsCard'));
const PostCard = lazy(() => import('@/components/Home/PostCard'));
const BlogCard = lazy(() => import('@/components/Home/BlogCard'));
const ItemCard = lazy(() => import('@/components/Home/ItemCard'));
const InItemCard = lazy(() => import('@/components/Home/InItemCard'));
const TscCard = lazy(() => import('@/components/Home/TscCard'));

const NoOp = () => {};

export const Headers = ({ entity }) => {
  if (entity === 'item')
    return <Meta name="robots" content="noindex,nofollow" />;
};

export default function Pagination(props) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tracks, setTracks] = useState([]);
  const [counts, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  let { element = {}, params = {} } = props;
  let { settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { entity = '', customQuery, populateQuery } = fields;

  const defaultLimit = Number(fields.limit) || 25;

  useEffect(() => {
    if (isClient) {
      loadProductItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams, defaultLimit]);

  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const offset = Number(searchParams.get('offset')) || 0;

  const loadProductItems = useCallback(
    (filter = {}) => {
      // setTracks([...[]]);
      setTracks([]);
      setLoading(true);

      if (customQuery) {
        if (typeof customQuery == 'string') {
          customQuery = JSON.parse(customQuery);
        }
        Object.keys(customQuery).forEach((item) => {
          let main = customQuery[item];
          if (params._id) {
            let theVariable = params._id;
            const json2 = isStringified(theVariable);
            if (typeof json2 == 'object') {
              console.log('theVariable', theVariable);
            } else {
              theVariable = JSON.stringify(theVariable);
            }
            main = main.replace('"params._id"', theVariable);
            main = main.replace("'params._id'", theVariable);
            main = main.replace('params._id', theVariable);
          }

          function isStringified(jsonValue) {
            // use this function to check
            try {
              return JSON.parse(jsonValue);
            } catch (err) {
              return jsonValue;
            }
          }

          const json = isStringified(main);

          if (typeof json == 'object') {
            query[item] = JSON.parse(main);
          } else {
            main = main.replaceAll(/\"/g, '');
            query[item] = main;
          }
        });
      }

      // get query paramters
      const query: any = {};
      for (const [key, value] of searchParams)
        query[key] = NormalizeString(value);
      const limit = parseInt(query.limit || defaultLimit);
      const offset = parseInt(query.offset || 0);
      delete query.offset;
      delete query.limit;

      console.group('loadProductItems');
      console.log('offset:', offset);
      console.log('filter:', filter);
      console.log('query:', query);
      console.groupEnd();

      getEntitiesWithCount(
        entity || params.entity,
        offset,
        limit,
        false,
        JSON.stringify(query),
        JSON.stringify(populateQuery)
      )
        .then(({ items, count }) => {
          setTracks([...items]);
          setCount(count);
        })
        .finally(() => setLoading(false));
    },
    [searchParams]
  );

  const handleChangePage = (event, newPage) => {
    if (isClient) {
      window.scrollTo(0, 0);

      setSearchParams((p) => {
        p.set('offset', String(newPage * limit));
        return p;
      });
      loadProductItems();
    }
  };
  const handleChangeRowsPerPage = (event, obj) => {
    const newLimit = parseInt(obj.props.children);

    setSearchParams((p) => {
      p.set('limit', String(newLimit));
      p.set('offset', '0');
      return p;
    });

    loadProductItems();
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <Row>
        {tracks.length ? (
          tracks.map((i, idx) => (
            <Col
              key={idx}
              lg="3"
              md="3"
              sm="4"
              xs="6"
              className="post-style-list mb-3">
              <Headers entity={entity} />
              {entity === 'post' && <BlogCard item={i} onClick={NoOp} />}
              {entity === 'product' && (
                <PostCard item={i} method="list" onClick={NoOp} />
              )}
              {entity === 'initem' && <InItemCard item={i} />}
              {entity === 'tsc' && <TscCard item={i} />}
              {entity === 'item' && <ItemCard item={i} />}
              {entity === 'add/allads' && <AdsCard item={i} />}
            </Col>
          ))
        ) : (
          <EmptyList />
        )}
      </Row>

      {counts > 0 && (
        <MyPagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={Math.floor(counts)}
          rowsPerPage={limit}
          page={Math.floor(offset / limit)}
          labelRowsPerPage={t('number per row:')}
          nexticonbuttontext={t('next page')}
          previousiconbuttontext={t('previous page')}
          labelDisplayedRows={({ page }) =>
            `${page + 1} ${t('from')} ${Math.floor(counts / limit) || 1}`
          }
          onPageChange={(e, newPage) => handleChangePage(e, newPage)}
          // @ts-ignore
          onRowsPerPageChange={(e, newLimit) =>
            handleChangeRowsPerPage(e, newLimit)
          }
        />
      )}
    </>
  );
}
