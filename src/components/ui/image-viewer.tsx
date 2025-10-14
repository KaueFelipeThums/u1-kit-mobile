import { useCallback, useRef } from 'react';
import { Animated, Image, LayoutChangeEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import * as ImageViewerPrimitive from '@/components/primitves/image-viewer';
import { useDialogAnimation } from '@/hooks/use-dialog-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const ImageViewer = ({ ...props }: React.ComponentPropsWithRef<typeof ImageViewerPrimitive.Root>) => {
  return <ImageViewerPrimitive.Root {...props} />;
};

const ImageViewerTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof ImageViewerPrimitive.Trigger>) => {
  return <ImageViewerPrimitive.Trigger {...props} />;
};

const ImageViewerPortal = ({ ...props }: React.ComponentPropsWithRef<typeof ImageViewerPrimitive.Portal>) => {
  return <ImageViewerPrimitive.Portal {...props} />;
};

const imageViewerOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const ImageViewerOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof ImageViewerPrimitive.Overlay>) => {
  const styles = useStyles(imageViewerOverlayStyles);

  return (
    <ImageViewerPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const imageViewerPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 50,
  },
});

const ImageViewerPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();

  return (
    <View
      style={[
        imageViewerPanelStyles.panel,
        style,
        {
          paddingBottom: bottom,
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
      pointerEvents="box-none"
      {...props}
    />
  );
};

const imageViewerContentStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.transparent,
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
    },
  });

type ImageViewerContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const ImageViewerContentLayout = ({ onLayoutReady, style, onLayout, ...props }: ImageViewerContentLayoutProps) => {
  const isLayoutReady = useRef<boolean>(false);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!isLayoutReady.current) {
        isLayoutReady.current = true;
        onLayoutReady?.();
      }
      onLayout?.(event);
    },
    [onLayoutReady, onLayout],
  );

  return <View onLayout={handleLayout} style={[StyleSheet.absoluteFillObject, style]} {...props} />;
};

const ImagePanelContentAnimated = Animated.createAnimatedComponent(ImageViewerPanel);
const ImageViewerOverlayAnimated = Animated.createAnimatedComponent(ImageViewerOverlay);

const ImageViewerContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof ImageViewerPrimitive.Content>) => {
  const styles = useStyles(imageViewerContentStyles);
  const { open } = ImageViewerPrimitive.useRootContext();
  const { animateIn, opacityAnim, scaleAnim, visible } = useDialogAnimation({ open });

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <ImageViewerPortal visible={visible}>
      <ImageViewerContentLayout onLayoutReady={animateIn}>
        <ImageViewerOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <ImagePanelContentAnimated shouldRasterizeIOS style={animatedStyle}>
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <ImageViewerPrimitive.Content style={[styles.content, style]} {...props} />
          </TouchableWithoutFeedback>
        </ImagePanelContentAnimated>
      </ImageViewerContentLayout>
    </ImageViewerPortal>
  );
};

const imageViewerHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
    headerButton: {
      height: sizes.dimension.lg,
      width: sizes.dimension.lg,
    },
    headerContent: {
      flexGrow: 1,
    },
  });

const ImageViewerHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(imageViewerHeaderStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={[styles.header, style]} {...props}>
      <View style={styles.headerContent} />
      <ImageViewerPrimitive.Close asChild>
        <Button size="icon" variant="ghost" style={styles.headerButton}>
          <ButtonIcon size={sizes.fontSize.lg} color={colors.white} name="X" />
        </Button>
      </ImageViewerPrimitive.Close>
    </View>
  );
};

const imageViewerImageStyles = StyleSheet.create({
  image: {
    flex: 1,
    height: 300,
    resizeMode: 'contain',
    width: '100%',
  },
});

const ImageViewerImage = ({ style, ...props }: React.ComponentPropsWithRef<typeof Image>) => {
  return <Image style={[imageViewerImageStyles.image, style]} {...props} />;
};

export {
  ImageViewer,
  ImageViewerContent,
  ImageViewerHeader,
  ImageViewerOverlay,
  ImageViewerPortal,
  ImageViewerTrigger,
  ImageViewerImage,
};
