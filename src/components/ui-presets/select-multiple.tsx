import { StyleProp, ViewStyle } from 'react-native';
import { Empty, EmptyIcon, EmptyTitle } from '../ui/empty';
import { Loading, LoadingIcon } from '../ui/loading';
import {
  SelectMultiple as BaseSelectMultiple,
  SelectMultipleContent,
  SelectMultipleGroup,
  SelectMultipleInput,
  SelectMultipleItem,
  SelectMultipleItemAdornment,
  SelectMultipleItemAll,
  SelectMultipleItemContent,
  SelectMultipleItemDescription,
  SelectMultipleItemTitle,
  SelectMultipleTag,
  SelectMultipleTagCount,
  SelectMultipleTrigger,
  SelectMultipleValue,
} from '@/components/ui/select-multiple';
import { Separator } from '@/components/ui/separator';

type SelectMultipleProps = React.ComponentPropsWithRef<typeof BaseSelectMultiple> & {
  placeholder?: string;
  inputPlaceholder?: string;
  emptyText?: string;
  contentStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  showSearch?: boolean;
  tagCount?: number;
};

const SelectMultiple = ({
  placeholder,
  inputPlaceholder = 'Pesquisar...',
  contentStyle,
  showSearch = true,
  loading,
  tagCount = 3,
  emptyText = 'Nenhum registro encontrado!',
  ...props
}: SelectMultipleProps) => {
  return (
    <BaseSelectMultiple {...props}>
      <SelectMultipleTrigger>
        <SelectMultipleValue
          renderItem={(items) => (
            <>
              {items.slice(0, tagCount).map((item) => (
                <SelectMultipleTag key={item.value} value={item.value}>
                  {item.label}
                </SelectMultipleTag>
              ))}
              {items.length > tagCount && <SelectMultipleTagCount>+{items.length - tagCount}</SelectMultipleTagCount>}
            </>
          )}
          placeholder={placeholder}
        />
      </SelectMultipleTrigger>
      <SelectMultipleContent style={contentStyle}>
        {showSearch && (
          <>
            <SelectMultipleInput placeholder={inputPlaceholder} />
            <Separator />
          </>
        )}
        {loading ? (
          <Loading>
            <LoadingIcon />
          </Loading>
        ) : (
          <SelectMultipleGroup
            ListHeaderComponent={<SelectMultipleItemAll>Selecionar todos</SelectMultipleItemAll>}
            ListEmptyComponent={
              <Empty>
                <EmptyIcon />
                <EmptyTitle>{emptyText}</EmptyTitle>
              </Empty>
            }
            renderItem={({ item }) => (
              <SelectMultipleItem value={item.value} disabled={item.disabled}>
                {item.adornment && <SelectMultipleItemAdornment>{item.adornment}</SelectMultipleItemAdornment>}
                <SelectMultipleItemContent>
                  <SelectMultipleItemTitle>{item.label}</SelectMultipleItemTitle>
                  {item.description && (
                    <SelectMultipleItemDescription>{item.description}</SelectMultipleItemDescription>
                  )}
                </SelectMultipleItemContent>
              </SelectMultipleItem>
            )}
          />
        )}
      </SelectMultipleContent>
    </BaseSelectMultiple>
  );
};

export { SelectMultiple };
