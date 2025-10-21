import { useState, useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';

type AnimationControls = {
  visible: boolean;
  opacityAnim: Animated.Value;
  scaleAnim: Animated.Value;
  animateIn: () => void;
  animateOut: () => void;
};

export function useDialogAnimation({ open }: { open: boolean }): AnimationControls {
  const [visible, setVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 50 }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    });
  }, [opacityAnim, scaleAnim]);

  const animateOut = useCallback(() => {
    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 0.8, useNativeDriver: true, friction: 40, tension: 700 }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(({ finished }) => {
          if (finished) {
            setVisible(false);
            isVisibleRef.current = false;
          }
        });
      });
    });
  }, [opacityAnim, scaleAnim]);

  useEffect(() => {
    if (open && !isVisibleRef.current) {
      setVisible(true);
      isVisibleRef.current = true;
    } else if (!open && isVisibleRef.current) {
      animateOut();
    }
  }, [open, animateOut]);

  return { visible, opacityAnim, scaleAnim, animateIn, animateOut };
}
