import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import { useCallback, useMemo, type JSX } from 'react';

export const Default = (): JSX.Element => {
  const { page } = useSitecore();

  const router = useRouter();
  const { pathname, asPath, query } = router;

  const availableLanguages = useMemo(
    () => [
      { code: 'en', short: 'EN', label: 'English' },
      { code: 'fr-CA', short: 'FR', label: 'Français' },
      { code: 'ja-JP', short: 'JA', label: '日本語' },
    ],
    []
  );

  const changeLanguage = useCallback(
    (langCode: string) => {
      if (pathname && asPath && query) {
        router.push(
          {
            pathname,
            query,
          },
          asPath,
          {
            locale: langCode,
            shallow: false,
          }
        );
      }
    },
    [asPath, pathname, query, router]
  );

  return (
    <nav className="language-switcher language-switcher--inline" aria-label="Language">
      <div className="language-switcher__group">
        {availableLanguages.map((lang) => {
          const isActive = page.locale === lang.code;
          return (
            <button
              type="button"
              key={lang.code}
              className={`language-switcher__pill${isActive ? ' is-active' : ''}`}
              title={lang.label}
              aria-pressed={isActive}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.short}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
