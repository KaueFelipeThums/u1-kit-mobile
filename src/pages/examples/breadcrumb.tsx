import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbTitle,
} from '@/components/ui/breadcrumb';
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

const BreadcrumbExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Breadcrumb</Text>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbTitle>Home</BreadcrumbTitle>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbTitle>Profile</BreadcrumbTitle>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbTitle>Settings</BreadcrumbTitle>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </View>
  );
};
export default BreadcrumbExample;
