import { StyleProp, ViewStyle } from 'react-native';
import { Empty, EmptyIcon, EmptyTitle } from '../ui/empty';
import { Loading, LoadingIcon } from '../ui/loading';
import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectItemAdornment,
  SelectItemContent,
  SelectItemDescription,
  SelectItemTitle,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type SelectProps = React.ComponentPropsWithRef<typeof BaseSelect> & {
  placeholder?: string;
  inputPlaceholder?: string;
  emptyText?: string;
  contentStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  showSearch?: boolean;
};

const Select = ({
  placeholder,
  inputPlaceholder = 'Pesquisar...',
  contentStyle,
  showSearch = true,
  loading,
  emptyText = 'Nenhum registro encontrado!',
  ...props
}: SelectProps) => {
  return (
    <BaseSelect {...props}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent style={contentStyle}>
        {showSearch && (
          <>
            <SelectInput placeholder={inputPlaceholder} />
            <Separator />
          </>
        )}
        {loading ? (
          <Loading>
            <LoadingIcon />
          </Loading>
        ) : (
          <SelectGroup
            ListEmptyComponent={
              <Empty>
                <EmptyIcon />
                <EmptyTitle>{emptyText}</EmptyTitle>
              </Empty>
            }
            renderItem={({ item }) => (
              <SelectItem value={item.value} disabled={item.disabled}>
                {item.adornment && <SelectItemAdornment>{item.adornment}</SelectItemAdornment>}
                <SelectItemContent>
                  <SelectItemTitle>{item.label}</SelectItemTitle>
                  {item.description && <SelectItemDescription>{item.description}</SelectItemDescription>}
                </SelectItemContent>
              </SelectItem>
            )}
          />
        )}
      </SelectContent>
    </BaseSelect>
  );
};

export { Select };
