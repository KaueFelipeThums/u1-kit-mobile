import { ReactElement, ReactNode } from 'react';
import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ButtonTitle } from '@/components/ui/button';
import { Icon, IconName } from '@/components/ui/icon';
import { useTheme } from '@/theme/theme-provider/theme-provider';

type IconVariants = 'default' | 'destructive' | 'success';

const iconNameVariants: Record<IconVariants, IconName> = {
  default: 'TriangleAlert',
  destructive: 'CircleX',
  success: 'CircleCheck',
};

type AlertDialogProps = React.ComponentProps<typeof BaseAlertDialog> & {
  title: string;
  description?: string;
  variant?: IconVariants;
  renderIcon?: ReactElement;
  children?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  disabled?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  hideCancelButton?: boolean;
};

const AlertDialog = ({
  title,
  description,
  variant = 'default',
  children,
  cancelText = 'Cancelar',
  confirmText = 'Sim',
  disabled = false,
  onCancel,
  onConfirm,
  hideCancelButton = false,
  ...props
}: AlertDialogProps): ReactElement => {
  const { colors, sizes } = useTheme();

  const iconColors = {
    default: colors.orange[500],
    destructive: colors.destructive,
    success: colors.green[500],
  };

  return (
    <BaseAlertDialog {...props}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <Icon name={iconNameVariants[variant]} size={sizes.dimension.lg} color={iconColors[variant]} />
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description ?? `Pressione "${confirmText}" para confirmar`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hideCancelButton && (
            <AlertDialogCancel onPress={onCancel} disabled={disabled}>
              <ButtonTitle>{cancelText}</ButtonTitle>
            </AlertDialogCancel>
          )}

          <AlertDialogAction onPress={onConfirm} disabled={disabled}>
            <ButtonTitle>{confirmText}</ButtonTitle>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog>
  );
};

export { AlertDialog };
