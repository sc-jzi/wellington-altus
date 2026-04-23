'use client';

import Link from 'next/link';
import React, { FormEvent, JSX, useId, useState } from 'react';

// -----------------------------------------------------------------------------
// Edit copy, images, links, and form endpoint here
// -----------------------------------------------------------------------------

/** Main WAPW logo (white). */
export const WEALTH_MANAGEMENT_FOOTER_BRAND = {
  logo: {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/elementor/thumbs/WAPW-Logo-WHITE-ocp3tbcddg5zb9hublb1g4rpc1td5bwo82ed8ltr9g.png',
    alt: 'Wellington-Altus Private Wealth',
  },
} as const;

export const WEALTH_MANAGEMENT_FOOTER_INTRO =
  'Vancouver-based financial advisors The Wong Group specialize in financial planning and wealth management.';

/** Contact rows: `href` optional (plain text row). Use `fa` icon names without prefix (Font Awesome 4). */
export const WEALTH_MANAGEMENT_FOOTER_CONTACT_ROWS: ReadonlyArray<{
  icon: 'map-marker' | 'phone' | 'envelope';
  lines: readonly string[];
  href?: string;
  external?: boolean;
}> = [
  {
    icon: 'map-marker',
    href: 'https://goo.gl/maps/pZE1Z9qHvsqwgRQr5',
    external: true,
    lines: ['#100 - 1450 Creekside Drive', 'Vancouver BC', 'V6J 5B3'],
  },
  {
    icon: 'phone',
    lines: ['Office: 778-655-2410', 'Toll-Free: 1-833-500-1777'],
  },
  {
    icon: 'envelope',
    href: 'mailto:thewonggroup@wellington-altus.ca',
    lines: ['thewonggroup@wellington-altus.ca'],
  },
];

export const WEALTH_MANAGEMENT_FOOTER_SOCIAL_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  icon: 'linkedin';
  external?: boolean;
}> = [
  {
    label: 'LinkedIn',
    href: 'https://ca.linkedin.com/in/mailiwong?trk=author_mini-profile_title',
    icon: 'linkedin',
    external: true,
  },
];

export const WEALTH_MANAGEMENT_FOOTER_AWARDS: ReadonlyArray<{
  src: string;
  alt: string;
  href?: string;
  external?: boolean;
  /** Wider badge treatment in layout */
  wide?: boolean;
}> = [
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/07/WPA24-Winner-Equiton-Canadian-Advisor.webp',
    alt: 'WPA24 Winner Equiton Canadian Advisor logo',
    href: 'https://advisor.wellington-altus.ca/thewonggroup/maili-wong-takes-home-two-prestigious-awards-at-the-wealth-professional-awards-gala-in-toronto/',
    external: true,
    wide: true,
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/07/WPA25-Winner_Badge.webp',
    alt: 'THE EQUITON AWARD FOR CANADIAN ADVISOR OF THE YEAR',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/07/the-globe-and-mail-find-an-advisor-client.webp',
    alt: 'The Globe and Mail Find an Advisor — Client Approved',
    href: 'https://advisor.wellington-altus.ca/thewonggroup/maili-wong-can-now-be-found-on-the-globe-and-mails-find-an-advisor-directory/',
    external: true,
  },
];

export const WEALTH_MANAGEMENT_FOOTER_FORM = {
  title: 'Get In Touch With Us',
  subtitle: "Please send us a message if you'd like a complimentary consult.",
  /** POST target — add a matching API route or change to your endpoint. */
  action: '/api/wealth-management-contact',
  submitLabel: 'SEND MESSAGE',
  fieldNames: {
    name: 'name',
    phone: 'phone',
    email: 'email',
    message: 'message',
    honeypot: 'city',
  },
} as const;

export const WEALTH_MANAGEMENT_FOOTER_SUB = {
  cipf: {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/elementor/thumbs/CIPF_ENG_Member_WHITE-ocp3tbcbhh2e12q776x1e83rbmvup8hn4oszuip9fi.png',
    alt: 'CIPF, CIPF Wong Group',
    href: 'http://www.cipf.ca',
    external: true,
  },
  ciro: {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/elementor/thumbs/CIRO-Logo-1-qmy6sdyinwwrr81ud6rkeag9mjn02olmancitqdh6c.png',
    alt: 'Canadian Investment Regulatory Organization logo',
    href: 'https://www.ciro.ca/',
    external: true,
  },
  advisorReport: {
    label: 'Know Your Advisor:',
    linkText: 'Advisor Report',
    href: 'https://www.ciro.ca/office-investor/know-your-advisor-advisor-report',
    external: true,
  },
  /** Site-relative legal links */
  legalLinks: [
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Legal', href: '/legal' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ] as const,
  copyrightEntity: 'Wellington-Altus Private Wealth Inc.',
} as const;

// -----------------------------------------------------------------------------

function FaIcon({ name, className }: { name: string; className?: string }): JSX.Element {
  return <i className={`fa fa-${name} ${className || ''}`.trim()} aria-hidden />;
}

export function WealthManagementFooter(): JSX.Element {
  const id = useId();
  const nameId = `${id}-name`;
  const phoneId = `${id}-phone`;
  const emailId = `${id}-email`;
  const messageId = `${id}-message`;
  const hpId = `${id}-city`;

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const hp = WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.honeypot;
    if (data.get(hp)) {
      return;
    }
    const payload: Record<string, string> = {};
    data.forEach((value, key) => {
      payload[key] = String(value);
    });
    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await fetch(WEALTH_MANAGEMENT_FOOTER_FORM.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const year = new Date().getFullYear();

  const renderContactRow = (
    row: (typeof WEALTH_MANAGEMENT_FOOTER_CONTACT_ROWS)[number],
    index: number,
  ): JSX.Element => {
    const body = (
      <>
        <span className="wealth-management-footer__contact-icon">
          <FaIcon name={row.icon} />
        </span>
        <span>
          {row.lines.map((line, i) => (
            <React.Fragment key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </React.Fragment>
          ))}
        </span>
      </>
    );

    return (
      <li key={index} className="wealth-management-footer__contact-item">
        {row.href ? (
          <a
            href={row.href}
            {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {body}
          </a>
        ) : (
          body
        )}
      </li>
    );
  };

  return (
    <footer className="wealth-management-footer">
      <div className="wealth-management-footer__main">
        <div className="wealth-management-footer__inner">
          <div className="wealth-management-footer__grid">
            <div>
              <span className="wealth-management-footer__logo">
                <img
                  src={WEALTH_MANAGEMENT_FOOTER_BRAND.logo.src}
                  alt={WEALTH_MANAGEMENT_FOOTER_BRAND.logo.alt}
                  loading="lazy"
                />
              </span>
              <p className="wealth-management-footer__intro">{WEALTH_MANAGEMENT_FOOTER_INTRO}</p>
              <ul className="wealth-management-footer__contact-list">
                {WEALTH_MANAGEMENT_FOOTER_CONTACT_ROWS.map((row, i) => renderContactRow(row, i))}
              </ul>
              <div className="wealth-management-footer__social">
                {WEALTH_MANAGEMENT_FOOTER_SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.href}
                    className="wealth-management-footer__social-link"
                    href={s.href}
                    aria-label={s.label}
                    {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <FaIcon name="linkedin" />
                  </a>
                ))}
              </div>
              <div className="wealth-management-footer__awards">
                {WEALTH_MANAGEMENT_FOOTER_AWARDS.map((a, i) => {
                  const img = (
                    <img src={a.src} alt={a.alt} loading="lazy" />
                  );
                  const wrapClass =
                    'wealth-management-footer__award' +
                    (a.wide ? ' wealth-management-footer__award--wide' : '');
                  return a.href ? (
                    <a
                      key={i}
                      className={wrapClass}
                      href={a.href}
                      {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {img}
                    </a>
                  ) : (
                    <span key={i} className={wrapClass}>
                      {img}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="wealth-management-footer__form-col">
              <h2 className="wealth-management-footer__form-title">{WEALTH_MANAGEMENT_FOOTER_FORM.title}</h2>
              <p className="wealth-management-footer__form-sub">{WEALTH_MANAGEMENT_FOOTER_FORM.subtitle}</p>
              <form className="wealth-management-footer__form" onSubmit={onSubmit} noValidate>
                <div className="wealth-management-footer__form-row">
                  <div className="wealth-management-footer__field">
                    <label className="wealth-management-footer__label" htmlFor={nameId}>
                      Name
                    </label>
                    <input
                      id={nameId}
                      className="wealth-management-footer__input"
                      type="text"
                      name={WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.name}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="wealth-management-footer__field">
                    <label className="wealth-management-footer__label" htmlFor={phoneId}>
                      Phone
                    </label>
                    <input
                      id={phoneId}
                      className="wealth-management-footer__input"
                      type="tel"
                      name={WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.phone}
                      autoComplete="tel"
                      pattern="[0-9()#&+*\\-=.\\s]+"
                      title="Only numbers and phone characters (#, -, *, etc.) are accepted."
                    />
                  </div>
                </div>
                <div className="wealth-management-footer__field wealth-management-footer__field--full">
                  <label className="wealth-management-footer__label" htmlFor={emailId}>
                    Email
                  </label>
                  <input
                    id={emailId}
                    className="wealth-management-footer__input"
                    type="email"
                    name={WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.email}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="wealth-management-footer__field wealth-management-footer__field--full">
                  <label className="wealth-management-footer__label" htmlFor={messageId}>
                    Message
                  </label>
                  <textarea
                    id={messageId}
                    className="wealth-management-footer__textarea"
                    name={WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.message}
                    rows={4}
                    required
                  />
                </div>
                <input
                  id={hpId}
                  className="wealth-management-footer__hp"
                  type="text"
                  name={WEALTH_MANAGEMENT_FOOTER_FORM.fieldNames.honeypot}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden={true}
                />
                <div className="wealth-management-footer__submit-wrap">
                  <button className="wealth-management-footer__submit" type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : WEALTH_MANAGEMENT_FOOTER_FORM.submitLabel}
                  </button>
                </div>
                {status === 'ok' ? (
                  <p className="wealth-management-footer__form-sub" role="status">
                    Thank you — your message was sent.
                  </p>
                ) : null}
                {status === 'error' ? (
                  <p className="wealth-management-footer__form-sub" role="alert">
                    Something went wrong. Please try again later.
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="wealth-management-footer__sub">
        <div className="wealth-management-footer__sub-inner">
          <div className="wealth-management-footer__sub-grid">
            <div className="wealth-management-footer__sub-col">
              <a
                className="wealth-management-footer__sub-img"
                href={WEALTH_MANAGEMENT_FOOTER_SUB.cipf.href}
                {...(WEALTH_MANAGEMENT_FOOTER_SUB.cipf.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <img
                  src={WEALTH_MANAGEMENT_FOOTER_SUB.cipf.src}
                  alt={WEALTH_MANAGEMENT_FOOTER_SUB.cipf.alt}
                  loading="lazy"
                />
              </a>
            </div>
            <div className="wealth-management-footer__sub-col">
              <a
                className="wealth-management-footer__sub-img wealth-management-footer__sub-img--ciro"
                href={WEALTH_MANAGEMENT_FOOTER_SUB.ciro.href}
                {...(WEALTH_MANAGEMENT_FOOTER_SUB.ciro.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <img
                  src={WEALTH_MANAGEMENT_FOOTER_SUB.ciro.src}
                  alt={WEALTH_MANAGEMENT_FOOTER_SUB.ciro.alt}
                  loading="lazy"
                />
              </a>
              <a
                className="wealth-management-footer__sub-link"
                href={WEALTH_MANAGEMENT_FOOTER_SUB.advisorReport.href}
                {...(WEALTH_MANAGEMENT_FOOTER_SUB.advisorReport.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {WEALTH_MANAGEMENT_FOOTER_SUB.advisorReport.label}{' '}
                <span>{WEALTH_MANAGEMENT_FOOTER_SUB.advisorReport.linkText}</span>
              </a>
            </div>
            <div className="wealth-management-footer__sub-col wealth-management-footer__sub-col--legal">
              <p className="wealth-management-footer__copyright">
                © {year} {WEALTH_MANAGEMENT_FOOTER_SUB.copyrightEntity}, All rights reserved.
              </p>
              <p className="wealth-management-footer__legal">
                {WEALTH_MANAGEMENT_FOOTER_SUB.legalLinks.map((link, i) => (
                  <React.Fragment key={link.href}>
                    {i > 0 ? <span className="wealth-management-footer__legal-sep">|</span> : null}
                    <Link href={link.href}>{link.label}</Link>
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default WealthManagementFooter;
