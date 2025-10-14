import React from 'react';
import { TextAreaBase, TextAreaBaseInput } from '@/components/ui/text-area';

type TextAreaProps = Omit<React.ComponentPropsWithRef<typeof TextAreaBaseInput>, 'style'> &
  Pick<React.ComponentProps<typeof TextAreaBase>, 'style' | 'disabled'>;

const TextArea = ({ disabled, style, ...props }: TextAreaProps) => {
  return (
    <TextAreaBase disabled={disabled} style={style}>
      <TextAreaBaseInput {...props} />
    </TextAreaBase>
  );
};

export { TextArea, type TextAreaProps };
