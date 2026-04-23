import React, { JSX } from 'react';

// -----------------------------------------------------------------------------
// Swap image URLs and alt text here (six tiles, flush grid)
// -----------------------------------------------------------------------------

export const WEALTH_MANAGEMENT_IMAGE_BLOCK_IMAGES: ReadonlyArray<{ src: string; alt: string }> = [
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/08/home-tile-1.webp',
    alt: 'Modern glass skyscraper viewed from below',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/08/home-tile-2.webp',
    alt: 'Luxury watch detail',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/08/home-tile-3.webp',
    alt: 'Luxury vehicle front grille',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2024/02/Sailboats.webp',
    alt: 'Tropical coastline from above',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/08/home-tile-5.webp',
    alt: 'Vintage map close-up',
  },
  {
    src: 'https://advisor.wellington-altus.ca/thewonggroup/wp-content/uploads/sites/31/2019/08/home-tile-6.webp',
    alt: 'Sailing yacht on calm water',
  },
];

/** Section heading (two lines; rendered with a line break between). */
export const WEALTH_MANAGEMENT_IMAGE_BLOCK_TITLE_LINES = [
  'We do financial planning differently.',
  "We think you'll like it.",
] as const;

// -----------------------------------------------------------------------------

export function WealthManagementImageBlock(): JSX.Element {
  return (
    <section className="wealth-management-image-block" aria-labelledby="wm-image-block-title">
      {/* Image strip first (matches design); move below `__content` if you prefer Elementor widget order. */}
      <div className="wealth-management-image-block__strip" role="presentation">
        {WEALTH_MANAGEMENT_IMAGE_BLOCK_IMAGES.map((img, index) => (
          <img
            key={index}
            className="wealth-management-image-block__strip-img"
            src={img.src}
            alt={img.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>

      <div className="wealth-management-image-block__content">
        <h1 className="wealth-management-image-block__title" id="wm-image-block-title">
          {WEALTH_MANAGEMENT_IMAGE_BLOCK_TITLE_LINES[0]}
          <br />
          {WEALTH_MANAGEMENT_IMAGE_BLOCK_TITLE_LINES[1]}
        </h1>
        <div className="wealth-management-image-block__body">
          <p>
            You should have confidence that whomever you put in charge of growing your investments consistently has
            your interests at heart. It should be clear that your financial advisor has the freedom to invest your money
            in the best independent solutions for you.
          </p>
          <p>
            At The Wong Group, our team is uniquely positioned to manage your wealth in a way that sets you up for
            financial resiliency, empowering you to build and maintain a{' '}
            <strong>Work-Optional Lifestyle</strong> no matter how long you live.
          </p>
          <p>
            Our best practices focus on getting you the best results. No cookie cutter tactics. No hidden commissions.
            No restriction on investment products. Just peace of mind that your wealth management plan is cultivated
            specifically for you.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WealthManagementImageBlock;
