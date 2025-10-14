import React, { ReactElement, ReactNode } from 'react';
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

type DialogProps = React.ComponentPropsWithRef<typeof BaseDialog> & {
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  trigger?: ReactNode;
};

const Dialog = ({ title, description, footer, children, trigger, ...props }: DialogProps): ReactElement => {
  return (
    <BaseDialog {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogBody>{children}</DialogBody>
        {footer && (
          <>
            <Separator />
            <DialogFooter>{footer}</DialogFooter>
          </>
        )}
      </DialogContent>
    </BaseDialog>
  );
};

export { Dialog };
