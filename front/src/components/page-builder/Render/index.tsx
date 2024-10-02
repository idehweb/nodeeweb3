import clsx from 'clsx';
import _get from 'lodash/get';
import {memo} from 'react';
import {Link} from "react-router-dom";

import Swiper from '@/components/swiper';
import ProductsSlider from '@/components/components-overview/ProductsSlider';
import PostSlider from '@/components/components-overview/PostSlider';
import NavbarSearch from '@/components/layout/MainNavbar/NavbarSearch';
import NavbarSearchItem from '@/components/layout/MainNavbar/NavbarSearchItem';
import NavbarSearchInItem from '@/components/layout/MainNavbar/NavbarSearchInItem';
import NavbarSearchTsc from '@/components/layout/MainNavbar/NavbarSearchTsc';
import MainNavbar from '@/components/layout/MainNavbar/MainNavbar';
import {getLinkType, MainUrl, setStyles} from '@/functions';
import PostCard from '@/components/Home/PostCard';
import PaymentCalc from '@/components/page-builder/PaymentCalc';
import Advertises from '@/components/page-builder/advertises';
import AddAdvertises from '@/components/page-builder/add-advertise';
import Packing from '@/components/page-builder/packing';
import Invoice from '@/components/page-builder/invoice';
import FastCheckout from '@/components/page-builder/fastcheckout';
import Tsc from '@/components/page-builder/tsc';
import SideMenu from '@/components/page-builder/SideMenu';
import Grid from '@/components/page-builder/grid';
import LoadMore from '@/components/page-builder/loadmore';
import Pagination from '@/components/page-builder/pagination';
import Form from '@/components/page-builder/form';
import Stepper from '@/components/page-builder/stepper';
import ConditionSteps from '@/components/page-builder/conditionStepper';
import BackButton from '@/components/page-builder/backButton';
import ConditionStep from '@/components/page-builder/conditionStepper/detail';
import Description from '@/components/page-builder/description';
import Chatgpt from '@/components/page-builder/chatgpt';
import Flights from '@/components/page-builder/flights';

import AdBanner from './components/AdBanner';
import {Button, Carousel, Currency, Header, Hr, SWIPER, TextNode, TITLE} from './components';

import {ElementTypes} from './types';

function HtmlTag({element}) {
  const fields = _get(element, 'settings.general.fields', {});

  const {tag = 'div', content} = fields;
  const style = setStyles({
    ...fields,
  });

  const Component = tag;

  return (
    <Component style={style} dangerouslySetInnerHTML={{__html: content}}/>
  );
}

function TheNavbarSearch({element, params, content}) {
  const fields = _get(element, 'settings.general.fields', {});

  const {direction, display, classes, entity = 'products'} = fields;
  const style = setStyles({
    ...fields,
    direction,
    display,
  });

  return (
    <NavbarSearch
      entity={entity}
      className={undefined}
      style={style}
      classes={classes}
    />
  );
}

function TheNavbarSearchTsc({element}) {
  const fields = _get(element, 'settings.general.fields', {});

  const {direction, display, classes} = fields;
  const style = setStyles({
    ...fields,
    direction,
    display,
  });

  return (
    <NavbarSearchTsc
      className={undefined}
      type="append"
      style={style}
      classes={classes}
    />
  );
}

function TheChatgpt({element}) {
  let {type, components, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {
    text,
    iconFont,
    direction,
    link,
    display,
    target = '_blank',
    classes,
  } = fields;
  let style = setStyles({...fields, direction: direction, display: display});

  return <Chatgpt type={'append'} style={style} classes={classes}/>;
}

function TheFlights({element}) {
  let {type, components, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {
    text,
    iconFont,
    direction,
    link,
    display,
    target = '_blank',
    classes,
  } = fields;
  let style = setStyles({...fields, direction: direction, display: display});
  // return 'hi'
  return <Flights type={'append'} style={style} classes={classes}/>;
}

function TheNavbarSearchInItem({element}) {
  let {type, components, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {
    text,
    iconFont,
    direction,
    link,
    display,
    target = '_blank',
    classes,
  } = fields;
  let style = setStyles({...fields, direction: direction, display: display});
  // @ts-ignore
  return <NavbarSearchInItem type={'append'} style={style} classes={classes}/>;
}

function TheNavbarSearchItem({element}) {
  let {type, components, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {
    text,
    iconFont,
    direction,
    link,
    display,
    target = '_blank',
    classes,
  } = fields;
  let style = setStyles({...fields, direction: direction, display: display});

  // @ts-ignore
  return <NavbarSearchItem type={'append'} style={style} classes={classes}/>;
}

function TheMainNavbar({element}) {
  let {type, components, classes, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {text, iconFont, direction, link, display, target = '_blank'} = fields;
  let style = setStyles({...fields, direction: direction, display: display});

  // @ts-ignore
  return <MainNavbar element={element} style={style} setStyles={setStyles}/>;

  // }
  // return <div style={style}>{text}</div>
}

const SWIPERWrapper = memo<any>(function SWIPERWrapper({
                                                         element,
                                                         content,
                                                         params,
                                                       }) {
  const {children} = element;
  const fields = _get(element, 'settings.general.fields');
  if (!fields) return;

  let {
    entity,
    classes,
    arrows = false,
    pagination = false,
    autoplay = true,
    perPage = 1,
    type = 'slide',
    margin,
    customQuery,
    interval = 5000,
    breakpoints = null,
  } = fields;

  const style = setStyles(fields);

  if (arrows === 'false') arrows = false;
  if (pagination === 'false') pagination = false;

  if (entity) {
    if (entity === 'product')
      return (
        <ProductsSlider
          breakpoints={breakpoints}
          arrows={Boolean(arrows)}
          autoplay={Boolean(autoplay)}
          perPage={parseInt(perPage)}
          customQuery={customQuery}
        />
      );
    if (entity === 'post')
      return (
        <PostSlider
          breakpoints={breakpoints}
          arrows={Boolean(arrows)}
          autoplay={Boolean(autoplay)}
          perPage={parseInt(perPage)}
          // customQuery={customQuery}
        />
      );
  } else
    return (
      <div className="the-swipppper-parent" style={style}>
        <Swiper
          perPage={parseInt(perPage)}
          autoplay={autoplay}
          arrows={Boolean(arrows)}
          interval={interval}
          pagination={Boolean(pagination)}
          type={type || 'slide'}
          breakpoints={
            breakpoints || {
              1024: {perPage: 1},
              768: {perPage: 1},
              640: {perPage: 1},
              320: {perPage: 1},
            }
          }
          className={clsx('p-0 m-0', classes)}>
          {children && children[0] instanceof Array
            ? children[0].map((i, idx) => (
              <ShowElement
                params={params}
                key={idx}
                element={i}
                content={content}
              />
            ))
            : children instanceof Array
              ? children.map((i, idx) => (
                <ShowElement
                  params={params}
                  key={idx}
                  element={i}
                  content={content}
                />
              ))
              : ''}
        </Swiper>
      </div>
    );
});

function TheLoadMore(props) {
  let {element, content} = props;
  let {type, children, settings, classes} = element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {entity, arrows = true, perPage = 1} = fields;

  if (arrows == 'false') {
    arrows = false;
  }
  // return JSON.stringify(element.data)
  return <LoadMore element={element}/>;
}

function ThePagination({element, params, content}) {
  const fields = _get(element, 'settings.general.fields');
  if (!fields) return;

  return <Pagination element={element} params={params}/>;
}

function TheAdBanner({element, params, content}) {
  const fields = _get(element, 'settings.general.fields');
  if (!fields) return;

  return <AdBanner element={element} params={params}/>;
}

function TheGrid(props) {
  let {element, content, params} = props;
  let {type, children, settings, classes} = element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {entity, arrows = true, perPage = 1} = fields;
  if (arrows == 'false') {
    arrows = false;
  }

  return <Grid element={element} params={params}/>;
}

function TheForm({element}) {
  const fields = _get(element, 'settings.general.fields');
  if (!fields) return;

  return <Form element={element} formFields={fields}/>;
}

function TheDescription(props) {
  let {element, content} = props;
  let {type, children, settings, classes} = element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {entity} = fields;

  return <Description element={element}/>;
}

function SWIPERSlide(props) {
  let {element, content, params} = props;
  let {type, children, classes, kind, text, src} = element;

  if (children)
    return children.map((com, index) => {
      return (
        <div
          className={
            'SWIPERSlide ' +
            (classes
              ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
              : '')
          }>
          {kind == 'link' && (
            <a href={'#'}>
              <ShowElement
                params={params}
                key={index}
                element={com}
                content={content}
              />
            </a>
          )}
          {/*{kind=='text' && <a href={"#"}><ShowElement key={index} element={com} content={content}/></a>}*/}
          {/*{kind=='image' && <a href={"#"}><ShowElement key={index} element={com} content={content}/></a>}*/}
          {/*<ShowElement key={index} element={com} content={content}/>*/}
        </div>
      );
    });
  else
    return (
      <div
        className={
          'SWIPERSlide ' +
          (classes
            ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
            : '')
        }>
        {kind === 'text' && text}
        {kind === 'image' && <img src={src} alt={text} loading="lazy"/>}
      </div>
    );
}

function ProductElement(props) {
  return <PostCard item={props} onClick={() => {
  }} method={undefined}/>;
}

function TEXTBOX(element) {
  let {type, fields} = element;

  return <>TEXTBOX</>;
}

// function ProductSlider(element) {
//   let {type, fields} = element;
//   // cat_id={"629692c48153533551655409"}
//   // return <ProductsSlider delay={1100}/>;
//   // return "ProductSlider";
//
// }

// function PostSlider(element) {
//   let {type, fields} = element;
//
//   return "PostSlider";
//
// }

function IMAGE(props) {
  // let {settings, classes} = element;
  const {element} = props;

  let {type, components, classes, settings} = element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {link, title, src, showInDesktop, showInMobile, target} = fields;
  let style = setStyles(fields);

  if (link) {
    return (
      <a
        target={target}
        href={link}
        title={title}
        className={clsx(
          showInDesktop && 'showInDesktop',
          showInMobile && 'showInMobile',
          classes ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ') : ''
        )}>
        <img
          loading="lazy"
          alt={title}
          title={title}
          style={style}
          src={MainUrl + '/' + (src ? src : link)}
        />
      </a>
    );
  }
  return (
    <img
      loading="lazy"
      alt={title}
      style={style}
      className={clsx(
        showInDesktop && 'showInDesktop',
        showInMobile && 'showInMobile',
        classes ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ') : ''
      )}
      src={MainUrl + '/' + (src ? src : link)}
    />
  );
}

function SLIDER(props) {
  let {element, content} = props;
  let {type, components, classes} = element;
  return <>SLIDER</>;
}

function GRID_LAYOUT(props) {
  let {element, content, params} = props;
  // let {type, components, children, classes, handleCard, card} = element;

  let {type, components, classess, children, settings, handleCard, card} =
    element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {link, title, src, classes, showInDesktop, showInMobile} = fields;
  let style = setStyles(fields);
  if (link) {
    return (
      <Link
        to={link}
        className={
          'posrel row grid-layout ' +
          (classes ? classes : '') +
          (showInDesktop ? ' showInDesktop ' : '') +
          (showInMobile ? ' showInMobile ' : '')
        }
        style={style}>
        {children &&
        children.map((item, k) => {
          return (
            <ShowElement
              params={params}
              key={k}
              element={{...item, handleCard: handleCard, card: card}}
            />
          );
        })}
      </Link>
    );
  }
  return (
    <div
      className={
        'posrel row grid-layout ' +
        (classes ? classes : '') +
        (showInDesktop ? ' showInDesktop ' : '') +
        (showInMobile ? ' showInMobile ' : '')
      }
      style={style}>
      {children &&
      children.map((item, k) => {
        return (
          <ShowElement
            params={params}
            key={k}
            element={{...item, handleCard: handleCard, card: card}}
          />
        );
      })}
    </div>
  );
}

function THE_TABS(props) {
  let {element, content, params} = props;

  let {type, components, classess, children, settings, handleCard, card} =
    element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {link, title, src, classes, showInDesktop, showInMobile} = fields;
  let style = setStyles(fields);

  return (
    <div
      className={clsx(
        'posrel row grid-layout',
        classes,
        showInDesktop && 'showInDesktop',
        showInMobile && 'showInMobile'
      )}
      style={style}>
      {children &&
      children.map((item, k) => {
        return (
          <ShowElement
            params={params}
            key={k}
            element={{...item, handleCard: handleCard, card: card}}
          />
        );
      })}
    </div>
  );
}

function THE_STEPS(props) {
  let {element, content, params} = props;

  let {type, components, classess, children, settings, handleCard, card} =
    element;
  let {general} = settings;
  let {fields} = general;
  if (!fields) {
    return;
  }
  let {link, title, src, classes, showInDesktop, showInMobile} = fields;
  let style = setStyles(fields);
  return <Stepper/>;
  return (
    <div
      className={
        'posrel row grid-layout ' +
        (classes ? classes : '') +
        (showInDesktop ? ' showInDesktop ' : '') +
        (showInMobile ? ' showInMobile ' : '')
      }
      style={style}>
      {children &&
      children.map((item, k) => {
        return (
          <ShowElement
            params={params}
            key={k}
            element={{...item, handleCard: handleCard, card: card}}
          />
        );
      })}
    </div>
  );
}

function THE_STEP(props) {
  const {element, content, params} = props;

  const {payload, type, components, children, settings, handleCard, card} =
    element;
  let {general} = settings;
  let {fields} = general;
  let {showInDesktop, showInMobile, direction, display, classess, classes} =
    fields;
  let style = setStyles({...fields, direction: direction, display: display});
  return (
    <div
      style={style}
      className={
        ' col  ' +
        (classess ? classess + ' ' : ' ') +
        (showInDesktop ? ' showInDesktop ' : '') +
        (showInMobile ? ' showInMobile ' : '') +
        (typeof classes == 'string'
          ? classes
          : classes
            ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
            : '')
      }>
      {children &&
      children.map((child, ch) => {
        return (
          <ShowElement
            params={params}
            element={{...child, handleCard: handleCard, card: card}}
            key={ch}
            content={{}}
          />
        );
      })}
    </div>
  );
}

function GRID_COL({element, params}) {
  const {children, handleCard, card} = element;
  const fields = _get(element, 'settings.general.fields', {});

  let {showInDesktop, showInMobile, classess, classes, link} = fields;
  const style = setStyles(fields);
  if (link) {
    let linkType = getLinkType(link);
    // return linkType;
    if (linkType == 'internal')
      return (
        <Link
          to={link}
          style={style}
          className={clsx(
            'col',
            classess,
            showInDesktop && 'showInDesktop',
            showInMobile && 'showInMobile',
            typeof classes == 'string'
              ? classes
              : classes
              ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
              : ''
          )}>
          {children?.map((child, idx) => (
            <ShowElement
              params={params}
              element={{...child, handleCard: handleCard, card: card}}
              key={idx}
              content={{}}
            />
          ))}
        </Link>
      );
    else return (
      <a
        href={link}
        style={style}
        className={clsx(
          'col',
          classess,
          showInDesktop && 'showInDesktop',
          showInMobile && 'showInMobile',
          typeof classes == 'string'
            ? classes
            : classes
            ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
            : ''
        )}>
        {children?.map((child, idx) => (
          <ShowElement
            params={params}
            element={{...child, handleCard: handleCard, card: card}}
            key={idx}
            content={{}}
          />
        ))}
      </a>
    );
  }
  return (
    <div
      style={style}
      className={clsx(
        'col',
        classess,
        showInDesktop && 'showInDesktop',
        showInMobile && 'showInMobile',
        typeof classes == 'string'
          ? classes
          : classes
          ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
          : ''
      )}>
      {children?.map((child, idx) => (
        <ShowElement
          params={params}
          element={{...child, handleCard: handleCard, card: card}}
          key={idx}
          content={{}}
        />
      ))}
    </div>
  );
}

function THE_TAB(props) {
  const {element, content, params} = props;

  const {payload, type, components, children, settings, handleCard, card} =
    element;
  let {general} = settings;
  let {fields} = general;
  let {showInDesktop, showInMobile, direction, display, classess, classes} =
    fields;
  let style = setStyles({...fields, direction: direction, display: display});
  return (
    <div
      style={style}
      className={
        ' col  ' +
        (classess ? classess + ' ' : ' ') +
        (showInDesktop ? ' showInDesktop ' : '') +
        (showInMobile ? ' showInMobile ' : '') +
        (typeof classes == 'string'
          ? classes
          : classes
            ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
            : '')
      }>
      {children &&
      children.map((child, ch) => {
        return (
          <ShowElement
            params={params}
            element={{...child, handleCard: handleCard, card: card}}
            key={ch}
            content={{}}
          />
        );
      })}
    </div>
  );
}

function Content(props) {
  const {element, content} = props;

  if (element && element.content && content && content[element.content])
    return content[element.content];
  // return <div className={"col " + (typeof classes =='string' ? classes : classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}>
  //     {components && components.map((item,i) => {
  //         return <ShowElement element={item} key={i}/>;
  //     })}
  // </div>;
}

export default function ShowElement(p) {
  let {element, content, params, condition, handleStep} = p;

  if (!element) return;

  let {name = '' as string, type} = element;
  if (element['custom-name']) name = element['custom-name'];
  console.log("params", params)
  switch (type) {
    case 'text':
      return <TITLE element={element}/>;
    case 'textnode':
      return <TextNode element={element}/>;
    case 'swiper-wrapper':
      return <SWIPERWrapper element={element}/>;
    case 'swiper-slide':
      return <SWIPERSlide element={element}/>;
    case 'swiper-container':
      return <SWIPER element={element}/>;
  }

  switch (name as ElementTypes) {
    case 'html':
      return <HtmlTag element={element}/>;
    case 'text':
      return <TITLE element={element}/>;
    case 'conditionsteps':
      return (
        <ConditionSteps element={element} content={content} params={params}/>
      );
    case 'conditionstep':
      return (
        <ConditionStep element={element} content={content} params={params}/>
      );
    case 'button':
      return (
        <Button
          element={element}
          content={content}
          params={params}
          conditionStep={condition}
          handleStep={handleStep}
        />
      );
    case 'hr':
      return <Hr element={element}/>;
    case 'header':
      return <Header element={element}/>;

    case 'TEXTBOX':
      return <TEXTBOX element={element} content={content} params={params}/>;
    case 'swiper-container':
      return <SLIDER element={element} content={content} params={params}/>;
    case 'slider':
      return (
        <SWIPERWrapper element={element} content={content} params={params}/>
      );
    case 'advertises':
      return <Advertises element={element} params={params}/>;
    case 'addadvertises':
      return <AddAdvertises/>;
    case 'currency':
      return <Currency/>;
    case 'calculation':
      return <PaymentCalc/>;
    case 'packing':
      return <Packing/>;
    case 'invoice':
      return <Invoice/>;
    case 'fastcheckout':
      return (
        <FastCheckout element={element} content={content} params={params}/>
      );

    case 'loadmore':
      return (
        <TheLoadMore element={element} content={content} params={params}/>
      );
    case 'description':
      return (
        <TheDescription element={element} content={content} params={params}/>
      );
    case 'pagination':
      return (
        <ThePagination element={element} content={content} params={params}/>
      );
    case 'adbanner':
      return (
        <TheAdBanner element={element} content={content} params={params}/>
      );
    case 'grid':
      return <TheGrid element={element} content={content} params={params}/>;
    case 'form':
      return <TheForm element={element}/>;
    case 'Slide':
      return (
        <SWIPERSlide element={element} content={content} params={params}/>
      );
    case 'ProductSlider':
      return (
        // @ts-ignore
        <ProductsSlider content={content} params={params}/>
      );
    case 'ProductElement':
      return (
        <ProductElement element={element} content={content} params={params}/>
      );
    case 'TEXTNODE':
      return <TextNode element={element}/>;
    case 'PostSlider':
      // @ts-ignore
      return <PostSlider element={element} content={content} params={params}/>;
    case 'row':
      return (
        <GRID_LAYOUT element={element} content={content} params={params}/>
      );
    case 'tabs':
      return <THE_TABS element={element} content={content} params={params}/>;
    case 'tab':
      return <THE_TAB element={element} content={content} params={params}/>;

    case 'Cell':
    case 'col':
      return <GRID_COL element={element} params={params}/>;
    case 'Content':
      return <Content {...p} element={element} content={content}/>;
    case 'CAROUSEL':
      return <Carousel element={element}/>;
    case 'image':
      return <IMAGE element={element} content={content} params={params}/>;
    case 'navigation':
      return <TheMainNavbar element={element}/>;
    case 'searchbar':
      return (
        <TheNavbarSearch element={element} content={content} params={params}/>
      );
    case 'searchbarinitem':
      return <TheNavbarSearchInItem element={element}/>;
    case 'searchbaritem':
      return <TheNavbarSearchItem element={element}/>;
    case 'searchbartsc':
      return <TheNavbarSearchTsc element={element}/>;

    case 'sidemenu':
      return <SideMenu element={element} params={params}/>;
    case 'tsc':
      return <Tsc element={element} content={content} params={params}/>;
    case 'backButton':
      return <BackButton element={element} content={content} params={params}/>;
    case 'chatgpt':
      return <TheChatgpt element={element}/>;
    case 'flights':
      return <TheFlights element={element}/>;
    default:
      return <></>;
  }
}
