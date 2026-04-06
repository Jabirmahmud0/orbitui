import { forwardRef } from 'react';

/**
 * Create a polymorphic component that accepts an `as` prop while preserving a default tag.
 *
 * @param {keyof JSX.IntrinsicElements | import('react').ComponentType<any>} defaultTag
 * @param {(props: Record<string, any>, ref: import('react').ForwardedRef<any>, Component: any) => import('react').ReactNode} render
 * @returns {import('react').ForwardRefExoticComponent<any>}
 */
export function createPolymorphicComponent(defaultTag, render) {
  const PolymorphicComponent = forwardRef(function OrbitPolymorphicComponent(props, ref) {
    const { as: asProp, ...restProps } = props;
    const Component = asProp || defaultTag;

    return render(restProps, ref, Component);
  });

  PolymorphicComponent.displayName =
    typeof defaultTag === 'string'
      ? `Polymorphic(${defaultTag})`
      : `Polymorphic(${defaultTag.displayName || defaultTag.name || 'Component'})`;

  return PolymorphicComponent;
}

export default createPolymorphicComponent;
