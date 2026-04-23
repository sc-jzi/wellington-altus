import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Text, Field } from '@sitecore-content-sdk/nextjs';

// -----------------------------------------------------------------------------
// Edit hero copy and optional background image here
// -----------------------------------------------------------------------------

export const WEALTH_MANAGEMENT_FULL_WIDTH_BANNER = {
  /** Main heading (includes ™ if desired). */
  title: 'WEALTH MADE CLEAR™',
  /** Supporting line under the title. */
  subtitle: 'Where you can trust your interests are being heard and addressed.',
  /**
   * Optional full-bleed background photo URL.
   * Leave empty to use the built-in soft mist gradient only.
   */
  backgroundImageUrl: '' as string | undefined,
} as const;

// -----------------------------------------------------------------------------

export type WealthManagementFullWidthBannerProps = ComponentProps & {
  fields: {
    Title: Field<string>;
    Subtitle: Field<string>;
  }
};

const WealthManagementFullWidthBanner = (props: WealthManagementFullWidthBannerProps): JSX.Element => {
    return (
    <section
      className="wealth-management-full-width-banner wealth-management-full-width-banner--has-image"
      style={{backgroundImage: 'url("https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2024/01/home-banner-opt.webp")'}}
    >
      <div className="wealth-management-full-width-banner__bg-overlay" aria-hidden />
      <div className="wealth-management-full-width-banner__grain" aria-hidden />
      <div className="wealth-management-full-width-banner__inner">
        <h1 className="wealth-management-full-width-banner__title"><Text field={props.fields.Title} /></h1>
        <p className="wealth-management-full-width-banner__subtitle"><Text field={props.fields.Subtitle} /></p>
      </div>
    </section>
  );
}

export const Default = WealthManagementFullWidthBanner;