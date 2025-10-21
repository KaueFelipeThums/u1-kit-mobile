import { set } from 'date-fns';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Animated, Dimensions, Easing, InteractionManager } from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type SheetSide = 'top' | 'bottom' | 'left' | 'right';

const getInitialTranslate = (side: SheetSide) => {
  switch (side) {
    case 'top':
      return -HEIGHT;
    case 'bottom':
      return HEIGHT;
    case 'left':
      return -WIDTH;
    case 'right':
      return WIDTH;
    default:
      return 0;
  }
};

type AnimationControls = {
  visible: boolean;
  opacityAnim: Animated.Value;
  translateAnim: Animated.Value;
  animateIn: () => void;
  animateOut: () => void;
};

export function useSheetAnimation({ open, side }: { open: boolean; side: SheetSide }): AnimationControls {
  const [visible, setVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const translateValue = getInitialTranslate(side);
  const translateAnim = useRef(new Animated.Value(translateValue)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 180,
            tension: 80,
            restDisplacementThreshold: 1,
            restSpeedThreshold: 200,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]).start();
      });
    });
  }, [opacityAnim, translateAnim]);

  const animateOut = useCallback(() => {
    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(translateAnim, {
            toValue: translateValue,
            useNativeDriver: true,
            duration: 250,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]).start((result) => {
          if (result.finished) {
            setVisible(false);
            isVisibleRef.current = false;
          }
        });
      });
    });
  }, [opacityAnim, translateValue, translateAnim]);

  useEffect(() => {
    if (open && !isVisibleRef.current) {
      setVisible(true);
      isVisibleRef.current = true;
    } else if (!open && isVisibleRef.current) {
      animateOut();
    }
  }, [open, animateOut]);

  return { visible, opacityAnim, translateAnim, animateIn, animateOut };
}
