import { StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const tableStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    table: {
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      overflow: 'hidden',
      width: '100%',
    },
  });

const Table = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableStyles);
  return <View style={[styles.table, style]} {...props} />;
};

const tableHeaderStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.muted,
    },
  });

const TableHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableHeaderStyles);
  return <View style={[styles.header, style]} {...props} />;
};

const tableFooterStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    footer: {
      backgroundColor: colors.muted,
    },
  });

const TableFooter = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableFooterStyles);
  return <View style={[styles.footer, style]} {...props} />;
};

const tableBodyStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    body: {
      backgroundColor: colors.background,
    },
  });

const TableBody = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableBodyStyles);
  return <View style={[styles.body, style]} {...props} />;
};

const tableRowStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    row: {
      borderBottomColor: colors.border,
      borderBottomWidth: sizes.border.sm,
      flexDirection: 'row',
    },
  });

const TableRow = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableRowStyles);
  return <View style={[styles.row, style]} {...props} />;
};

const tableHeadStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    head: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      height: sizes.dimension.lg,
      justifyContent: 'flex-start',
      paddingHorizontal: sizes.padding.md,
    },
  });

const TableHead = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableHeadStyles);
  return <View style={[styles.head, style]} {...props} />;
};

const tableHeadTitle = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const TableHeadTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(tableHeadTitle);
  return <Text numberOfLines={1} style={[styles.title, style]} {...props} />;
};

const tableCellStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    cell: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      height: sizes.dimension.lg,
      justifyContent: 'flex-start',
      paddingHorizontal: sizes.padding.md,
    },
  });

const TableCell = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(tableCellStyles);
  return <View style={[styles.cell, style]} {...props} />;
};

const tableCellTitle = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const TableCellTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(tableCellTitle);
  return <Text numberOfLines={1} style={[styles.title, style]} {...props} />;
};

export {
  Table,
  TableHeader,
  TableFooter,
  TableRow,
  TableHead,
  TableHeadTitle,
  TableCell,
  tableStyles,
  TableBody,
  tableHeaderStyles,
  tableFooterStyles,
  tableRowStyles,
  tableHeadStyles,
  TableCellTitle,
  tableHeadTitle,
  tableCellStyles,
};
