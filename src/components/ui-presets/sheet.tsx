import React, { ReactElement, ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Sheet as BaseSheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetBody,
} from '@/components/ui/sheet';

type SheetProps = React.ComponentPropsWithRef<typeof BaseSheet> & {
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  trigger?: ReactNode;
};

const Sheet = ({ title, description, footer, children, trigger, ...props }: SheetProps): ReactElement => {
  return (
    <BaseSheet {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Separator />
        <SheetBody>{children}</SheetBody>
        {footer && (
          <>
            <Separator />
            <SheetFooter>{footer}</SheetFooter>
          </>
        )}
      </SheetContent>
    </BaseSheet>
  );
};

export { Sheet };
