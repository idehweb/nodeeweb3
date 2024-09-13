import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Card, CardActions, CircularProgress } from '@mui/material';
import {
  Form,
  ImageField,
  ImageInput,
  SaveButton,
  TextInput,
  useNotify,
  useTranslate,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

import API from '@/functions/API';
import { ColorPicker, ShowImageField } from '@/components';

export default function Configuration(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      primaryColor: '#ee811d',
      secondaryColor: '#2d3488',
      textColor: '#000000',
      bgColor: '#ffffff',
      footerBgColor: '#ffffff',
    },
  });
  // const { setValue } = useFormContext();
  // const theTitle = useWatch({ name: "title" });

  // const {
  //   register,
  //   formState: { errors },
  // } = useFormContext();
  // register("title", { value: "data" });
  // console.log(watch("title"));
  // watch("title");
  // console.log("watch", watch('title'));

  const [loading, setLoading] = useState(false);
  // const [color, setColor] = useState({
  //   primaryColor: "#ee811d",
  //   secondaryColor: "#2d3488",
  //   textColor: "#000000",
  //   bgColor: "#ffffff",
  //   footerBgColor: "#ffffff"
  // });

  const [theData, setTheData] = useState(false);
  const translate = useTranslate();
  const notify = useNotify();

  const lan = translate('lan');

  const setTheColor = (t, e) => {
    setValue(t, e);
  };

  const handleNotif = (t, type = 'success') => {
    notify(t, { type: type });
  };
  const handleUpload = (files) => {
    let file = files[0];

    if (!file) return;
    setLoading(true);
    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    API.post('/settings/fileUpload', formData, {
      onUploadProgress: (e) => {
        // let p = Math.floor((e.loaded * 100) / e.total);
        // setProgress(p);
      },
    }).then((p) => {
      setLoading(false);

      window.location.reload();

      handleNotif('resources.settings.logoUploadedSuccessfully');
    });
  };

  const getData = useCallback(() => {
    setLoading(true);

    API.get('/settings/configuration')
      .then(({ data = {} }) => {
        Object.keys(data).forEach((d) => {
          setValue(d, data[d]);
        });

        setTheData(true);
        return data;
      })
      .catch((e) => {
        setTheData(true);
      })
      .finally(() => setLoading(false));
  }, [setValue]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   console.log("theData", theData);

  // setCombs(record);
  // }, [theData]);

  const handleChange = (t, value) => {
    setValue(t, value);
  };

  const onSubmit = (theData) => {
    let jso = {
      logo: theData.logo,
      title: theData.title,
      description: theData.description,
      home: theData.home,
      header_last: theData.header_last,
      body_first: theData.body_first,
      primaryColor: theData.primaryColor,
      secondaryColor: theData.secondaryColor,
      textColor: theData.textColor,
      bgColor: theData.bgColor,
      footerBgColor: theData.footerBgColor,
    };

    API.put('/settings/configuration', JSON.stringify(jso)).then(
      ({ data = {} }) => {
        setLoading(false);
        console.log('data', data);
        if (data.success) handleNotif('resources.settings.UpdatedSuccessfully');
        else handleNotif('resources.settings.sthWrong', 'error');

        return data;
      }
    );
  };

  if (!theData) return <></>;

  let {
    _id,
    logo,
    title = {},
    description = {},
    ADMIN_ROUTE,
    BASE_URL,
    SHOP_URL,
    ADMIN_URL,
    home,
    primaryColor,
    secondaryColor,
    bgColor,
    textColor,
    footerBgColor,
    ZIBAL_TOKEN,
    header_last,
    body_first,
  } = getValues();

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <Box>
        <Card sx={{ padding: '1em' }}>
          <Box>
            <Box>
              <div className={'row'}>
                <div className={'col-md-3'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.currentLogo')}
                  </label>
                  {logo && (
                    <ShowImageField
                      photo={logo}
                      className={'width100'}
                      deleteFunction={false}
                    />
                  )}
                </div>
                <div className={'col-md-9'}>
                  <ImageInput
                    className={'the-label2 show-image-uploader'}
                    source={'logo'}
                    label={translate('resources.settings.uploadLogo')}
                    accept="image/*"
                    options={{
                      onDrop: handleUpload,
                    }}>
                    <ImageField source="src" title="title" />
                  </ImageInput>
                </div>
              </div>
            </Box>
            <Box>
              <TextInput
                autoFocus
                fullWidth
                label={translate('resources.settings.title')}
                source={'title.' + lan}
                disabled={loading}
                defaultValue={title[lan]}
                onChange={(event) => {
                  handleChange('title.' + lan, event.target.value);
                }}
              />
            </Box>
            <Box>
              <TextInput
                autoFocus
                fullWidth
                label={translate('resources.settings.description')}
                source={'description.' + lan}
                disabled={loading}
                defaultValue={description[lan]}
                onChange={(event) => {
                  handleChange('description.' + lan, event.target.value);
                }}
              />
            </Box>
            <Box>
              <ReferenceInput
                perPage={100}
                label={translate('resources.settings.home')}
                source="home"
                reference="page"
                alwaysOn>
                <SelectInput
                  optionText={'title.' + lan}
                  defaultValue={home}
                  onChange={(event) => {
                    handleChange('home', event.target.value);
                  }}
                />
              </ReferenceInput>
              {/*<SelectInput optionText={"title."+translate("lan")}*/}
              {/*defaultValue={defaultSiteLan}*/}
              {/*onChange={(event) => {*/}
              {/*handleChange("defaultSiteLan", event.target.value);*/}
              {/*}}*/}
              {/*/>*/}
              {/*<TextInput*/}
              {/*autoFocus*/}
              {/*fullWidth*/}
              {/*label={translate("resources.settings.home")}*/}
              {/*source="home"*/}
              {/*disabled={loading}*/}
              {/*defaultValue={''}*/}
              {/*onChange={(event) => {*/}
              {/*handleChange("home", event.target.value);*/}
              {/*}}*/}
              {/*/>*/}
            </Box>
            <Box>
              <TextInput
                autoFocus
                source="header_last"
                className={'ltr'}
                multiline
                label={'header_last'}
                disabled={loading}
                // validate={required()}
                fullWidth
                defaultValue={header_last}
                onChange={(event) => {
                  handleChange('header_last', event.target.value);
                }}
              />
            </Box>
            <Box>
              <TextInput
                autoFocus
                source="body_first"
                className={'ltr'}
                multiline
                label={'body_first'}
                disabled={loading}
                // validate={required()}
                fullWidth
                defaultValue={body_first}
                onChange={(event) => {
                  handleChange('body_first', event.target.value);
                }}
              />
            </Box>
            <Box>
              <div className={'row'}>
                <div className={'col-md-2'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.primaryColor')}
                  </label>
                  <ColorPicker
                    className={'input-color'}
                    source={'primaryColor'}
                    color={primaryColor}
                    onChangeComplete={(e) => setTheColor('primaryColor', e)}
                    placement="right"
                  />
                </div>
                <div className={'col-md-2'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.secondaryColor')}
                  </label>
                  <ColorPicker
                    className={'input-color'}
                    source={'secondaryColor'}
                    color={secondaryColor}
                    onChangeComplete={(e) => setTheColor('secondaryColor', e)}
                    placement="right"
                  />
                </div>
                <div className={'col-md-2'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.textColor')}
                  </label>
                  <ColorPicker
                    className={'input-color'}
                    source={'textColor'}
                    color={textColor}
                    onChangeComplete={(e) => setTheColor('textColor', e)}
                    placement="right"
                  />
                </div>
                <div className={'col-md-2'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.bgColor')}
                  </label>
                  <ColorPicker
                    className={'input-color'}
                    source={'bgColor'}
                    color={bgColor}
                    onChangeComplete={(e) => setTheColor('bgColor', e)}
                    placement="right"
                  />
                </div>
                <div className={'col-md-2'}>
                  <label className={'the-label2'}>
                    {translate('resources.settings.footerBgColor')}
                  </label>
                  <ColorPicker
                    className={'input-color'}
                    source={'footerBgColor'}
                    color={footerBgColor}
                    onChangeComplete={(e) => setTheColor('footerBgColor', e)}
                    placement="right"
                  />
                </div>
                <div className={'col-md-2'}></div>
              </div>
            </Box>
            <Box></Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <SaveButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              alwaysEnable>
              {loading && <CircularProgress size={25} thickness={2} />}
              {translate('resources.settings.save')}
            </SaveButton>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
}
