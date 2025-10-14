import { StyleSheet } from 'react-native';
import * as AvatarPrimitve from '@/components/primitves/avatar';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const avatarStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    avatar: {
      borderRadius: sizes.radius.full,
      flexDirection: 'row',
      flexShrink: 0,
      height: sizes.dimension.xl,
      overflow: 'hidden',
      position: 'relative',
      width: sizes.dimension.xl,
    },
  });

const Avatar = ({ style, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitve.Root>) => {
  const styles = useStyles(avatarStyles);
  return <AvatarPrimitve.Root style={[styles.avatar, style]} {...props} />;
};

const avatarImageStyles = StyleSheet.create({
  image: {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  },
});

const AvatarImage = ({ style, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitve.Image>) => {
  return <AvatarPrimitve.Image style={[avatarImageStyles.image, style]} {...props} />;
};

const avatarFallbackStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    fallback: {
      alignItems: 'center',
      backgroundColor: colors.muted,
      borderRadius: sizes.radius.full,
      flexDirection: 'row',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

const AvatarFallback = ({ style, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitve.Fallback>) => {
  const styles = useStyles(avatarFallbackStyles);
  return <AvatarPrimitve.Fallback style={[styles.fallback, style]} {...props} />;
};

export { Avatar, AvatarImage, AvatarFallback };
