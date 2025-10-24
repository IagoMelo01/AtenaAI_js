import * as React from 'react';

/**
 * Compose multiple refs into a single callback ref.
 */
function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        try {
          // @ts-expect-error: readonly refs can't be assigned but we only target mutable refs.
          (ref as React.MutableRefObject<T | null>).current = node;
        } catch (error) {
          // Ignore assignment errors for read-only refs to mimic Radix's behaviour.
        }
      }
    }
  };
}

function isSlottable(child: React.ReactNode): child is React.ReactElement<{ children?: React.ReactNode }> {
  return React.isValidElement(child) && child.type === Slottable;
}

type SlotProps = {
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof React.Fragment> & Record<string, unknown>;

type SlotCloneProps = SlotProps;

const SlotClone = React.forwardRef<unknown, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (React.isValidElement(children)) {
    const mergedProps = mergeProps(slotProps, children.props ?? {});

    return React.cloneElement(children, {
      ...mergedProps,
      ref: composeRefs(forwardedRef, (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref),
    });
  }

  if (React.Children.count(children) > 1) {
    return React.Children.only(null);
  }

  return null;
});
SlotClone.displayName = 'SlotClone';

export const Slottable: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  const overrideProps: Record<string, unknown> = { ...childProps };

  for (const propName of Object.keys(childProps)) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);

    if (isHandler) {
      if (typeof slotPropValue === 'function' && typeof childPropValue === 'function') {
        overrideProps[propName] = (...args: unknown[]) => {
          (childPropValue as (...args: unknown[]) => void)(...args);
          (slotPropValue as (...args: unknown[]) => void)(...args);
        };
      } else if (slotPropValue && !childPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style' && (slotPropValue || childPropValue)) {
      overrideProps[propName] = {
        ...(typeof slotPropValue === 'object' && slotPropValue !== null ? slotPropValue : {}),
        ...(typeof childPropValue === 'object' && childPropValue !== null ? childPropValue : {}),
      };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .map((value) => String(value))
        .join(' ');
    }
  }

  return {
    ...slotProps,
    ...overrideProps,
  };
}

export const Slot = React.forwardRef<unknown, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = (slottable as React.ReactElement).props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) {
          return React.Children.only(null);
        }

        return React.isValidElement(newElement) ? newElement.props.children : null;
      }

      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});
Slot.displayName = 'Slot';

export const Root = Slot;

export default Slot;
