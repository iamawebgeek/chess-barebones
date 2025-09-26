import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './styles.module.css';

import type { ReactNode } from 'react';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
const FeatureList: FeatureItem[] = [
  {
    title: 'Flexible',
    Svg: require('@site/static/img/customizable-icon.svg').default,
    description: (
      <>
        Built in a way to serve as a backbone for a variation of games based on
        chess or similar to it
      </>
    ),
  },
  {
    title: 'Headless mode',
    Svg: require('@site/static/img/headless-icon.svg').default,
    description: (
      <>You can run the library both on the client and the server sides</>
    ),
  },
  {
    title: 'Type safe',
    Svg: require('@site/static/img/typesafe-icon.svg').default,
    description: (
      <>Built with TypeScript, it ensures high type safety and stability</>
    ),
  },
];
/* eslint-enable @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
