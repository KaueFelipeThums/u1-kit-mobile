import * as React from 'react';
import * as CollapsiblePrimitive from '@/components/primitves/collapsible';

const Collapsible = ({ ...props }: React.ComponentPropsWithRef<typeof CollapsiblePrimitive.Root>) => {
  return <CollapsiblePrimitive.Root {...props} />;
};

const CollapsibleTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof CollapsiblePrimitive.Trigger>) => {
  return <CollapsiblePrimitive.Trigger {...props} />;
};

const CollapsibleContent = ({ ...props }: React.ComponentPropsWithRef<typeof CollapsiblePrimitive.Content>) => {
  return <CollapsiblePrimitive.Content {...props} />;
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
