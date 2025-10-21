import { Icon } from '@/components/ui/icon';
import { ItemAdornment, ItemContent, ItemDescription, ItemPressable, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
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

const ItemExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Item</Text>
      <View>
        <ItemPressable>
          <ItemAdornment>
            <Icon name="Wallet" />
          </ItemAdornment>
          <ItemContent>
            <ItemTitle>Wallet</ItemTitle>
            <ItemDescription>My primary wallet</ItemDescription>
          </ItemContent>
          <ItemAdornment>
            <Icon name="ChevronRight" />
          </ItemAdornment>
        </ItemPressable>
        <Separator />
        <ItemPressable>
          <ItemAdornment>
            <Icon name="Gamepad2" />
          </ItemAdornment>
          <ItemContent>
            <ItemTitle>Games</ItemTitle>
            <ItemDescription>My favorite games</ItemDescription>
          </ItemContent>
          <ItemAdornment>
            <Icon name="ChevronRight" />
          </ItemAdornment>
        </ItemPressable>
      </View>
    </View>
  );
};
export default ItemExample;
