import { ImageField, NextImage, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import React, { JSX } from 'react';

interface HeaderFields {
  LogoImage?: ImageField;
}

export const Default = (props: ComponentProps & { fields?: HeaderFields }): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  // Get logo image from Header Data datasource
  const logoImage = props.fields?.LogoImage;
  const hasLogo = logoImage?.value?.src;

  return (
    <div className={`component header ${props.params.styles?.trimEnd()}`} id={id ? id : undefined}>
      <div className={`container container-${props.params?.ContainerWidth?.toLowerCase()}-fluid`}>
        <div className="row align-items-center main-row">
          <div className="col-auto">
            {hasLogo || isEditing ? (
              <NextImage field={logoImage} width={200} height={50} alt="Logo" />
            ) : (
              <Placeholder name="header-left" rendering={props.rendering} />
            )}
          </div>
          <div className="col">
            <Placeholder name="header-right" rendering={props.rendering} />
          </div>
        </div>
      </div>
    </div>
  );
};

export type WithImageProps = ComponentProps & {
  fields: {
    LogoImage: ImageField;
  };
};

export const WithLogoImage = (props: WithImageProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component header ${sxaStyles}`} id={id ? id : undefined}>
      <div className={`container container-${props.params?.ContainerWidth?.toLowerCase()}-fluid`}>
        <div className="row align-items-center main-row">
          <div className="col-auto">
            <NextImage field={props.fields.LogoImage} width={200} height={50} />
          </div>
          <div className="col">
            <Placeholder name="header-right" rendering={props.rendering} />
          </div>
        </div>
      </div>
    </div>
  );
};
