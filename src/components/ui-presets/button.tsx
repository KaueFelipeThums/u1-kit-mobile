import { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Button as BaseButton, ButtonTitle, ButtonIcon, ButtonLoader } from '@/components/ui/button';
import { IconName } from '@/components/ui/icon';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type ButtonProps = Omit<React.ComponentPropsWithRef<typeof BaseButton>, 'children'> &
  Pick<React.ComponentProps<typeof ButtonTitle>, 'children'> & {
    icon?: IconName;
    loading?: boolean;
    iconPlacement?: 'left' | 'right';
  };

const buttonStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    iconLeft: {
      marginRight: sizes.margin.sm,
    },
    iconRight: {
      marginLeft: sizes.margin.sm,
    },
  });

const Button = ({
  children,
  loading = false,
  disabled = false,
  size = 'default',
  icon,
  iconPlacement = 'left',
  ...props
}: ButtonProps): ReactElement => {
  const styles = useStyles(buttonStyles);
  const isIconSize = size === 'icon';

  const iconElement = loading ? (
    <ButtonLoader style={!isIconSize && (iconPlacement === 'left' ? styles.iconLeft : styles.iconRight)} />
  ) : (
    icon && (
      <ButtonIcon name={icon} style={!isIconSize && (iconPlacement === 'left' ? styles.iconLeft : styles.iconRight)} />
    )
  );

  return (
    <BaseButton {...props} disabled={disabled || loading} size={size}>
      {iconPlacement === 'left' && iconElement}
      {children && <ButtonTitle>{children}</ButtonTitle>}
      {iconPlacement === 'right' && iconElement}
    </BaseButton>
  );
};

export { Button };
