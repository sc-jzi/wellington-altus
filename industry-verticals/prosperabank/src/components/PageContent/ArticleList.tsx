import React, { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Text,
  RichTextField,
  withDatasourceCheck,
  NextImage,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { useI18n } from 'next-localization';

interface Fields {
  Title: Field<string>;
  Excerpt: Field<string>;
  Content: RichTextField;
  Thumbnail: ImageField;
  BackgroundImage: ImageField;
  Name: Field<string>;
  Photo: ImageField;
  Position: Field<string>;
}

export type ArticleListItemProps = {
  fields: Fields;
  name: string;
  url: string;
};

/** Supports Layout Service `fields.items` and GraphQL-style `fields.data.datasource.children.results` (query / folder datasources). */
interface ArticleListFields {
  items?: ArticleListItemProps[];
  data?: {
    datasource?: {
      children?: {
        results?: unknown[];
      };
    };
  };
}

interface ArticleListComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: ArticleListFields;
}

function resolveItemUrl(url: unknown): string | null {
  if (typeof url === 'string' && url.length > 0) {
    return url;
  }
  if (url && typeof url === 'object' && 'path' in url && typeof (url as { path: unknown }).path === 'string') {
    return (url as { path: string }).path;
  }
  return null;
}

function normalizeArticleListItem(raw: unknown): ArticleListItemProps | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const fields = r.fields as Fields | undefined;
  if (!fields) {
    return null;
  }
  const url = resolveItemUrl(r.url);
  if (!url) {
    return null;
  }
  const name = typeof r.name === 'string' ? r.name : '';
  return { fields, name, url };
}

function resolveArticleListItems(fields: ArticleListFields | undefined): ArticleListItemProps[] {
  if (!fields) {
    return [];
  }
  if (Array.isArray(fields.items) && fields.items.length > 0) {
    return fields.items
      .map((row) => normalizeArticleListItem(row))
      .filter((row): row is ArticleListItemProps => row !== null);
  }
  const results = fields.data?.datasource?.children?.results;
  if (!Array.isArray(results)) {
    return [];
  }
  return results.map(normalizeArticleListItem).filter((row): row is ArticleListItemProps => row !== null);
}

const getNewsItems = (items: ArticleListItemProps[], numOfItems: number) => {
  return items
    ?.filter((item) => item.name !== 'Data' && item.name !== 'Authors')
    .slice(0, numOfItems || undefined);
};

const getAllArticlesPageHref = (items: ArticleListItemProps[], params?: ComponentParams) => {
  const allHref =
    (typeof params?.AllArticlesHref === 'string' && params.AllArticlesHref.trim()) ||
    (typeof params?.SeeAllHref === 'string' && params.SeeAllHref.trim()) ||
    '';
  if (allHref) {
    return allHref;
  }
  return items?.find((item) => item.name === 'Data')?.url.replace(/\/Data$/, '') || '#';
};

const ArticleListDefault = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const listItems = resolveArticleListItems(props.fields);
  const newsItems = getNewsItems(listItems, parseInt(props.params?.NumberOfItems));
  const { t } = useI18n();
  const sxaStyles = (props.params?.styles ?? '').trimEnd();

  return (
    <div className={`component article-list ${sxaStyles}`} id={id ? id : undefined}>
      <div className="container">
        <div className="background p-3 p-sm-5">
          {newsItems?.map((item, i) => (
            <React.Fragment key={`${item.url}-${i}`}>
              <div
                className={`row gx-5 row-gap-3 align-items-center ${
                  i % 2 !== 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="col-lg-4">
                  <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                </div>

                <div className="col-lg-8">
                  <h3 className="fs-4">
                    <Text field={item.fields.Title}></Text>
                  </h3>
                  <p className="article-excerpt fs-5">
                    <Text field={item.fields.Excerpt}></Text>
                  </p>
                  <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <Link href={item.url} className="button button-secondary">
                      {t('Read more') || 'Read more'}
                    </Link>
                  </div>
                </div>
              </div>
              {i === newsItems.length - 1 ? <></> : <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListThreeColumn = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const listItems = resolveArticleListItems(props.fields);
  const newsItems = getNewsItems(listItems, parseInt(props.params?.NumberOfItems));
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row row-gap-3">
          {newsItems?.map((item, i) => (
            <div className="col-lg-4" key={`${item.url}-${i}`}>
              <Link href={item.url} className="wrapper-link">
                <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                <h3 className="fs-4 mt-3">
                  <Text field={item.fields.Title}></Text>
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListSimplified = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const listItems = resolveArticleListItems(props.fields);
  const newsItems = getNewsItems(listItems, parseInt(props.params?.NumberOfItems));
  const allArticlesPageHref = getAllArticlesPageHref(listItems, props.params);
  const { t } = useI18n();
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col">
            <div className="title display-6">{t('News') || 'News'}</div>
          </div>
          <div className="col-auto learn-more">
            <Link href={allArticlesPageHref} className="button button-simple">
              {t('See all') || 'See all'} <i className="fa fa-angle-right fs-4" />
            </Link>
          </div>
        </div>

        <div className="background p-3 p-sm-5">
          {newsItems?.map((item, i) => (
            <React.Fragment key={`${item.url}-${i}`}>
              <div className="row gx-5 row-gap-3 align-items-center">
                <div className="col-lg-4">
                  <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                </div>

                <div className="col-lg-6">
                  <h3 className="fs-4">
                    <Text field={item.fields.Title}></Text>
                  </h3>
                  <p>
                    <Text field={item.fields.Excerpt}></Text>
                  </p>
                  <Link href={item.url} className="button button-simple">
                    {t('Read more') || 'Read more'}
                  </Link>
                </div>
              </div>
              {i === newsItems.length - 1 ? <></> : <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListGrid = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const listItems = resolveArticleListItems(props.fields);
  const newsItems = getNewsItems(listItems, parseInt(props.params?.NumberOfItems));
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container container-wide">
        <div className="article-list-grid">
          {newsItems?.map((item, i) => (
            <div className="article-grid-item" key={`${item.url}-${i}`}>
              <Link href={item.url} className="wrapper-link">
                <NextImage field={item.fields.Thumbnail} width={800} height={400} />
                <h3 className="fs-4 mt-3">
                  <Text field={item.fields.Title}></Text>
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<ArticleListComponentProps>(ArticleListDefault);
export const ThreeColumn = withDatasourceCheck()<ArticleListComponentProps>(ArticleListThreeColumn);
export const Simplified = withDatasourceCheck()<ArticleListComponentProps>(ArticleListSimplified);
export const Grid = withDatasourceCheck()<ArticleListComponentProps>(ArticleListGrid);
