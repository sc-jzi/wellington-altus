import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  RichTextField,
  Text,
  RichText,
  Link,
  LinkField,
  useSitecore,
  Placeholder,
  NextImage,
} from '@sitecore-content-sdk/nextjs';
import useVisibility from 'src/hooks/useVisibility';
import { ComponentProps } from 'lib/component-props';
import { DottedAccent } from 'components/NonSitecore/DottedAccent';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Subtitle: Field<string>;
  Text: RichTextField;
  Image: ImageField;
  Link: LinkField;
  Link2: LinkField;
}

export type PromoCtaProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PromoCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const [isVisible, domRef] = useVisibility();
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component promo-cta ${sxaStyles}`} id={id ? id : undefined} ref={domRef}>
      <div className="container">
        <div className="row row-gap-4 main-content align-items-center">
          <div className="col-lg-5 text-center text-lg-start">
            <h6 className="eyebrow-accent">
              <Text field={props.fields.Eyebrow} />
            </h6>
            <h1 className="display-6 fw-bold mb-3">
              <Text field={props.fields.Title} />
            </h1>
            <div className="promo-cta-text">
              <p className="fs-5">
                <Text field={props.fields.Subtitle} />
              </p>

              <RichText field={props.fields.Text} className="text-content" />

              <div className="row mt-2">
                <Placeholder name="promo-cta" rendering={props.rendering} />
              </div>

              {(isPageEditing || props.fields?.Link?.value?.href) && (
                <Link field={props.fields.Link} className="button button-main mt-3 me-4" />
              )}
              {(isPageEditing || props.fields?.Link2?.value?.href) && (
                <Link field={props.fields.Link2} className="button button-simple mt-3 " />
              )}
            </div>
          </div>
          <div className="col-md-10 mx-auto col-lg-7 mx-lg-0">
            <div className="image-wrapper">
              <DottedAccent className="dotted-accent-top" />
              <NextImage
                field={props.fields.Image}
                className={`d-block mx-lg-auto img-fluid ${
                  !isPageEditing ? `fade-section ${isVisible ? 'is-visible' : ''}` : ''
                }`}
                width={900}
                height={900}
              />
              <DottedAccent className="dotted-accent-bottom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WithPlaceholderColumn = (props: PromoCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const [isVisible, domRef] = useVisibility();
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component promo-cta with-placeholder-column ${sxaStyles}`}
      id={id ? id : undefined}
      ref={domRef}
    >
      <div className="container">
        <div className="row row-gap-4 main-content align-items-center">
          <div className="col-lg-5 text-center text-lg-start">
            <h6 className="eyebrow-accent">
              <Text field={props.fields.Eyebrow} />
            </h6>
            <h1 className="fs-1 fw-bold mb-3">
              <Text field={props.fields.Title} />
            </h1>
            <div className="promo-cta-text">
              <p className="fs-5">
                <Text field={props.fields.Subtitle} />
              </p>

              <RichText field={props.fields.Text} className="text-content" />

              {(isPageEditing || props.fields?.Link?.value?.href) && (
                <Link field={props.fields.Link} className="button button-main mt-3" />
              )}
              {(isPageEditing || props.fields?.Link2?.value?.href) && (
                <Link field={props.fields.Link2} className="button button-simple mt-3 mx-4" />
              )}
            </div>
          </div>

          <div className="col-md-12 mx-auto col-lg-7 mx-lg-0">
            <div className="row align-items-center">
              <div className="promo-cta-placeholder col-12 col-md-9">
                <div className="promo-cta-placeholder-inner">
                  <div className="row">
                    <Placeholder name="promo-cta" rendering={props.rendering} />
                  </div>
                </div>
              </div>

              <div className="image-wrapper d-none d-md-block col-md-8">
                <DottedAccent className="dotted-accent-top" />
                <NextImage
                  field={props.fields.Image}
                  className={`d-block mx-lg-auto img-fluid ${
                    !isPageEditing ? `fade-section ${isVisible ? 'is-visible' : ''}` : ''
                  }`}
                  width={900}
                  height={900}
                />
                <DottedAccent className="dotted-accent-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WithBackgroundImage = (props: PromoCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const [isVisible, domRef] = useVisibility();
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <section
      className={`component promo-cta with-background-image ${sxaStyles}`}
      id={id ? id : undefined}
      ref={domRef}
    >
      <div className="promo-cta-background-wrapper">
        <div className="container-fluid px-0">
          <div className="row g-0 align-items-stretch">
            {/* Left Column - Text Content */}
            <div className="col-12 col-lg-6 promo-cta-text-column">
              <div className="promo-cta-text-content">
                {(isPageEditing || props.fields?.Eyebrow?.value) && (
                  <h6 className="promo-cta-eyebrow">
                    <Text field={props.fields.Eyebrow} />
                  </h6>
                )}
                <h1 className="promo-cta-heading">
                  <Text field={props.fields.Title} />
                </h1>
                {(isPageEditing || props.fields?.Subtitle?.value) && (
                  <p className="promo-cta-subtitle">
                    <Text field={props.fields.Subtitle} />
                  </p>
                )}
                {(isPageEditing || props.fields?.Text?.value) && (
                  <div className="promo-cta-body">
                    <RichText field={props.fields.Text} />
                  </div>
                )}
                <div className="promo-cta-actions">
                  {(isPageEditing || props.fields?.Link?.value?.href) && (
                    <Link
                      field={props.fields.Link}
                      className="button button-outline-white"
                    >
                      {props.fields.Link?.value?.text || 'Learn More'}
                    </Link>
                  )}
                  {(isPageEditing || props.fields?.Link2?.value?.href) && (
                    <Link
                      field={props.fields.Link2}
                      className="button button-outline-white"
                    >
                      {props.fields.Link2?.value?.text || 'Learn More'}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="col-12 col-lg-6 promo-cta-image-column">
              <div className="promo-cta-image-wrapper">
                {(isPageEditing || props.fields?.Image?.value?.src) && (
                  <NextImage
                    field={props.fields.Image}
                    className={`promo-cta-image ${
                      !isPageEditing ? `fade-section ${isVisible ? 'is-visible' : ''}` : ''
                    }`}
                    width={800}
                    height={800}
                    alt={props.fields.Title?.value || 'Promotional image'}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
