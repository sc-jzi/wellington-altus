'use client';

import Link from 'next/link';
import React, { JSX, useCallback, useEffect, useId, useState } from 'react';
import { ComponentProps } from 'lib/component-props';
import { ImageField } from '@sitecore-content-sdk/nextjs';

// -----------------------------------------------------------------------------
// Edit routes, assets, and external links here
// -----------------------------------------------------------------------------

/** Primary navigation — use site-relative paths (see Next.js i18n locale prefixing). */
export const WEALTH_MANAGEMENT_NAV_ITEMS: ReadonlyArray<{
  label: string;
  href: string;
  children?: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: 'Our Team', href: '/about/our-team' },
      { label: 'Financial Freedom', href: '/about/financial-freedom' },
    ],
  },
  { label: 'SERVICES', href: '/services' },
  { label: 'INNER CIRCLE', href: '/inner-circle' },
  { label: 'PRESS', href: '/press' },
  { label: 'INSIGHTS', href: '/insights' },
  { label: 'CONTACT', href: '/contact' },
];

/** Logo images (remote URLs until moved into Sitecore / `public`). */
export const WEALTH_MANAGEMENT_HEADER_BRAND = {
  wongGroupHomeHref: '/',
  wongGroupLogo: {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/elementor/thumbs/TheWongGroupLogoKO-ocu4k65mxzghvdud04bm4o5uff9dks8tdh452gabcw.png',
    alt: 'The Wong Group',
  },
  wapwLogo: {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/elementor/thumbs/WAPW-Logo-WHITE-ocp3tbcaie29kjexgzuj25j36oq42fh73j0ykq2eio.png',
    alt: 'Wellington-Altus Private Wealth',
  },
} as const;

/** Site search form (WordPress-style `s` query on home; change if your app uses another route). */
export const WEALTH_MANAGEMENT_HEADER_SEARCH = {
  formAction: '/',
  queryParam: 's',
  placeholder: 'Search...',
} as const;

/** Client login — external portfolio site. */
export const WEALTH_MANAGEMENT_HEADER_CLIENT_LOGIN = {
  href: 'https://myportfolioplus.ca/wellington-altus/login',
  openInNewTab: true,
} as const;

// -----------------------------------------------------------------------------

function UserLockIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden={true}
      focusable="false"
      fill="currentColor"
    >
      <path d="M12 1a5 5 0 0 0-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 0 1 6 0v3H9z" />
    </svg>
  );
}

export type WealthManagementHeaderProps = ComponentProps & {
  fields: {
    Logo: ImageField;
  }
}

const WealthManagementHeader = (props: WealthManagementHeaderProps): JSX.Element => {
  console.log(props);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchFieldId = useId();

  const openSearchOverlay = (): void => {
    setSearchOpen(true);
    setMobileOpen(false);
  };

  const closeOverlays = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    if (!searchOpen && !mobileOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOverlays();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, mobileOpen, closeOverlays]);

  useEffect(() => {
    if (searchOpen || mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, mobileOpen]);

  const renderDesktopNav = (): JSX.Element => (
    <nav aria-label="Main">
      <ul className="wealth-management-header__nav">
        {WEALTH_MANAGEMENT_NAV_ITEMS.map((item) =>
          item.children && item.children.length > 0 ? (
            <li
              key={item.label}
              className="wealth-management-header__nav-item wealth-management-header__nav-item--has-children"
            >
              <Link href={item.href} className="wealth-management-header__link">
                {item.label}
                <i className="fa fa-caret-down wealth-management-header__caret" aria-hidden />
              </Link>
              <ul className="wealth-management-header__submenu" role="list">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="wealth-management-header__submenu-link">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={item.href} className="wealth-management-header__nav-item">
              <Link href={item.href} className="wealth-management-header__link">
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );

  const renderMobileNav = (): JSX.Element => (
    <ul className="wealth-management-header__mobile-nav">
      {WEALTH_MANAGEMENT_NAV_ITEMS.map((item) => (
        <li key={item.label} className="wealth-management-header__mobile-nav-item">
          <Link href={item.href} className="wealth-management-header__mobile-link" onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
          {item.children && item.children.length > 0 ? (
            <ul className="wealth-management-header__mobile-children">
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="wealth-management-header__mobile-child-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );

  const renderSearchButton = (): JSX.Element => (
    <button
      type="button"
      className="wealth-management-header__icon-btn"
      aria-label="Search"
      onClick={openSearchOverlay}
    >
      <i className="fa fa-search wealth-management-header__icon-btn-icon" aria-hidden />
    </button>
  );

  const renderClientLoginLink = (): JSX.Element => (
    <a
      href={WEALTH_MANAGEMENT_HEADER_CLIENT_LOGIN.href}
      className="wealth-management-header__icon-btn"
      {...(WEALTH_MANAGEMENT_HEADER_CLIENT_LOGIN.openInNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      aria-label="Client login"
    >
      <UserLockIcon className="wealth-management-header__user-lock" />
    </a>
  );

  return (
    <header className="wealth-management-header" id="top">
      <div className="wealth-management-header__inner">
        <div className="wealth-management-header__logos">
          <Link href={WEALTH_MANAGEMENT_HEADER_BRAND.wongGroupHomeHref} className="wealth-management-header__logo-link">
            <img
              className="wealth-management-header__logo-img"
              src={WEALTH_MANAGEMENT_HEADER_BRAND.wongGroupLogo.src}
              alt={WEALTH_MANAGEMENT_HEADER_BRAND.wongGroupLogo.alt}
              loading="lazy"
            />
          </Link>
          <span className="wealth-management-header__logo-wrap">
            <img
              className="wealth-management-header__logo-img"
              src={WEALTH_MANAGEMENT_HEADER_BRAND.wapwLogo.src}
              alt={WEALTH_MANAGEMENT_HEADER_BRAND.wapwLogo.alt}
              loading="lazy"
            />
          </span>
        </div>

        <div className="wealth-management-header__desktop">
          {renderDesktopNav()}
          <div className="wealth-management-header__utils">
            {renderSearchButton()}
            {renderClientLoginLink()}
          </div>
        </div>

        <div className="wealth-management-header__mobile-tools">
          {renderSearchButton()}
          {renderClientLoginLink()}
          <button
            type="button"
            className="wealth-management-header__burger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="wm-mobile-panel"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <i className="fa fa-bars" aria-hidden />
            <i className="fa fa-times" aria-hidden />
          </button>
        </div>
      </div>

      <div
        id="wm-mobile-panel"
        className="wealth-management-header__mobile-panel"
        hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {renderMobileNav()}
      </div>

      <div
        className="wealth-management-header__search-backdrop"
        hidden={!searchOpen}
        role="presentation"
        onClick={closeOverlays}
      >
        <div
          className="wealth-management-header__search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            className="wealth-management-header__search-form"
            action={WEALTH_MANAGEMENT_HEADER_SEARCH.formAction}
            method="get"
          >
            <div className="wealth-management-header__search-row">
              <label className="visually-hidden" htmlFor={searchFieldId}>
                Search
              </label>
              <input
                id={searchFieldId}
                className="wealth-management-header__search-input"
                type="search"
                name={WEALTH_MANAGEMENT_HEADER_SEARCH.queryParam}
                placeholder={WEALTH_MANAGEMENT_HEADER_SEARCH.placeholder}
                autoFocus
              />
              <button
                type="button"
                className="wealth-management-header__search-close"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <i className="fa fa-times" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}

export const Default = WealthManagementHeader;