import { icons, LucideProps } from 'lucide-react-native';
import { ReactElement } from 'react';
import { useTheme } from '@/theme/theme-provider/theme-provider';

type IconName = keyof typeof icons;

type IconProps = LucideProps & {
  name: IconName;
};

const Icon = ({ name, size, color, ...props }: IconProps): ReactElement => {
  const { sizes, colors } = useTheme();

  const LucideIcon = icons[name];
  return <LucideIcon size={size ?? sizes.dimension.xs * 1.2} color={color ?? colors.foreground} {...props} />;
};

export { Icon, type IconName };
