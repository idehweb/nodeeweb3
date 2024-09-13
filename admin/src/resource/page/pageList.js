import {
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  Link,
  SearchInput,
  TextField,
  useTranslate,
} from 'react-admin';

import { Button } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import API from '@/functions/API';
import { dateFormat } from '@/functions';

import { List, ShowLink } from '@/components';

const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      <SearchInput
        source="Search"
        placeholder={translate('resources.page.search')}
        alwaysOn
      />
      <SearchInput
        source="category"
        placeholder={translate('resources.page.category')}
        alwaysOn
      />
    </Filter>
  );
};

export default function ListComponent(props) {
  const t = useTranslate();

  return (
    <List {...props} filters={<PostFilter />}>
      <Datagrid optimized>
        <ShowLink base={null} />
        <TextField source="slug" label="resources.page.slug" />
        <TextField source="path" label="resources.page.path" />

        <FunctionField
          label="resources.page.date"
          render={(record) => (
            <div className="theDate">
              <div>
                {t('resources.page.createdAt') +
                  ': ' +
                  `${dateFormat(record.createdAt)}`}
              </div>
              <div>
                {t('resources.page.updatedAt') +
                  ': ' +
                  `${dateFormat(record.updatedAt)}`}
              </div>

              {record.views && (
                <div>
                  {t('resources.page.viewsCount') +
                    ': ' +
                    `${record.views.length}`}
                </div>
              )}
            </div>
          )}
        />
        <FunctionField
          label="resources.page.actions"
          render={(record) => (
            <div>
              <div>
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  to={'/builder/page/' + record._id}>
                  <NoteAltIcon />
                  <span className={'ml-2 mr-2'}>
                    {t('resources.page.pagebuilder')}
                  </span>
                </Link>
              </div>
              <div>
                <EditButton />
              </div>
              <div>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => {
                    // console.log('data', record._id);
                    API.post('/page/copy/' + record._id, null)
                      .then(({ data = {} }) => {
                        // console.log('data', data._id);
                        props.history.push('/post/' + data._id);
                        // ale/rt('done');
                      })
                      .catch((err) => {
                        console.log('error', err);
                      });
                  }}>
                  <ContentCopyIcon />
                  <span className={'ml-2 mr-2'}>
                    {t('resources.page.copy')}
                  </span>
                </Button>
              </div>
              <div>
                <Link
                  to={
                    '/action?filter=%7B%page"%3A"' +
                    record._id +
                    '"%7D&order=ASC&page=1&perPage=10&sort=id/'
                  }
                  target="_blank"
                  rel="noopener noreferrer">
                  <PendingActionsIcon />
                  <span className={'ml-2 mr-2'}>
                    {t('resources.page.activities')}
                  </span>
                </Link>
              </div>
              {/*<div>*/}
              {/*<DeleteButton/>*/}
              {/*</div>*/}
            </div>
          )}
        />
      </Datagrid>
    </List>
  );
}
