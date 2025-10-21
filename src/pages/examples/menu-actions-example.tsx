import { Button } from '@/components/ui-presets/button';
import { MenuActions } from '@/components/ui-presets/menu-actions';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const MenuActionsExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Menu Actions</Text>
      <MenuActions
        items={[
          {
            key: 'item-1',
            shortcut: <Icon name="ChevronRight" />,
            label: 'Item 1',
            icon: <Icon name="Pen" />,
          },
          {
            key: 'item-2',
            shortcut: <Icon name="ChevronRight" />,
            label: 'Item 2',
            icon: <Icon name="Trash" />,
          },
          {
            key: 'item-separator',
            type: 'separator',
          },
          {
            key: 'item-3',
            shortcut: <Icon name="ChevronRight" />,
            label: 'Item 3',
            disabled: true,
            icon: <Icon name="Copy" />,
          },
        ]}
      >
        <Button>Open</Button>
      </MenuActions>
    </View>
  );
};
export default MenuActionsExample;
