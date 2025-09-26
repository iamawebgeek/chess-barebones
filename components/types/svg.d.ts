declare module '*.svg' {
  import { ComponentPropsWithRef } from 'react';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,unused-imports/no-unused-vars
  export default (props: ComponentPropsWithRef<'svg'>) => JSX.Element;
}
