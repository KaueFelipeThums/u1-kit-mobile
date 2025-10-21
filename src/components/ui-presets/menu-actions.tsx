import React, { ReactElement, ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import {
  MenuActions as BaseMenuActions,
  MenuActionsBody,
  MenuActionsBodyScroll,
  MenuActionsContent,
  MenuActionsItem,
  MenuActionsItemContent,
  MenuActionsTrigger,
} from '@/components/ui/menu-actions';
import { Text } from '@/components/ui/text';
import { Separator } from '../ui/separator';

type MenuActionsItemProps = {
  key: React.Key;
  type?: 'item' | 'separator';
  icon?: ReactNode;
  label?: ReactNode | string;
  shortcut?: ReactNode;
  disabled?: boolean;
  children?: MenuActionsItemProps[];
  onPress?: () => void;
};

type MenuActionsProps = React.ComponentProps<typeof BaseMenuActions> & {
  items: MenuActionsItemProps[];
  withScroll?: boolean;
  bodyHeight?: ViewStyle['height'];
};

const MenuActions = ({ items, children, withScroll = false, bodyHeight, ...props }: MenuActionsProps): ReactElement => {
  const Body = withScroll ? MenuActionsBodyScroll : MenuActionsBody;
  return (
    <BaseMenuActions {...props}>
      <MenuActionsTrigger asChild>{children}</MenuActionsTrigger>
      <MenuActionsContent>
        <Body style={{ height: bodyHeight }}>
          {items.map((item) => {
            if (item.type === 'separator') {
              return <Separator key={item.key} />;
            }

            return (
              <MenuActionsItem onPress={() => item.onPress?.()} key={item.key} disabled={item.disabled}>
                {item.icon}
                <MenuActionsItemContent>
                  {typeof item.label === 'string' ? <Text>{item.label}</Text> : item.label}
                </MenuActionsItemContent>
                {item.shortcut}
              </MenuActionsItem>
            );
          })}
        </Body>
      </MenuActionsContent>
    </BaseMenuActions>
  );
};

export { MenuActions, type MenuActionsItemProps };
