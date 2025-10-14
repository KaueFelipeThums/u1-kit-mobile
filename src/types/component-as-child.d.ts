export type ComponentPropsWithAsChild<T extends React.ElementType<any>> = React.ComponentPropsWithRef<T> & {
  asChild?: boolean;
};
