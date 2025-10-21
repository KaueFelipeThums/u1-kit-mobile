import { Button } from '@/components/ui-presets/button';
import {
  FileList,
  FileListAction,
  FileListActions,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListIconContent,
  FileListInfo,
  FileListItem,
  FileListName,
} from '@/components/ui/file-list';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/ui/toast';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const FileListExample = () => {
  const styles = useStyles(exampleStyles);
  const { sizes } = useTheme();

  return (
    <View style={styles.content}>
      <Text weight="medium">File List</Text>
      <FileList>
        <FileListItem>
          <FileListHeader>
            <FileListIconContent>
              <FileListIcon name="Image" />
            </FileListIconContent>
            <FileListInfo>
              <FileListName>Imagem.png</FileListName>
              <FileListDescription>24 MB</FileListDescription>
            </FileListInfo>

            <FileListActions>
              <FileListAction size="icon">
                <Icon name="Download" size={sizes.fontSize.md} />
              </FileListAction>
            </FileListActions>
          </FileListHeader>
        </FileListItem>

        <FileListItem>
          <FileListHeader>
            <FileListIconContent>
              <FileListIcon name="Image" />
            </FileListIconContent>
            <FileListInfo>
              <FileListName>Imagem.png</FileListName>
              <FileListDescription>245 MB</FileListDescription>
            </FileListInfo>

            <FileListActions>
              <FileListAction size="icon">
                <Icon name="Download" size={sizes.fontSize.md} />
              </FileListAction>
              <FileListAction size="icon">
                <Icon name="X" size={sizes.fontSize.md} />
              </FileListAction>
            </FileListActions>
          </FileListHeader>
        </FileListItem>
      </FileList>
    </View>
  );
};
export default FileListExample;
