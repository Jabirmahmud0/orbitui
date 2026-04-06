import { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { cn } from './cn';
import { composeRefs } from './composeRefs';
import { createPolymorphicComponent } from './polymorphic';

describe('cn', () => {
  it('merges conditional and conflicting tailwind classes', () => {
    const hiddenClass = [null, 'hidden'][0];

    expect(cn('px-2 py-2', hiddenClass, 'px-4', ['text-sm'])).toBe('py-2 px-4 text-sm');
  });
});

describe('composeRefs', () => {
  it('writes to both callback and object refs', () => {
    const objectRef = createRef();
    let callbackValue = null;
    const node = { id: 'node' };

    const ref = composeRefs(objectRef, (value) => {
      callbackValue = value;
    });

    ref(node);

    expect(objectRef.current).toBe(node);
    expect(callbackValue).toBe(node);
  });

  it('ignores missing refs without throwing', () => {
    const ref = composeRefs(null, undefined);

    expect(() => ref(null)).not.toThrow();
  });
});

describe('createPolymorphicComponent', () => {
  it('renders the default tag', () => {
    const Text = createPolymorphicComponent('span', (props, ref, Component) => (
      <Component ref={ref} {...props} />
    ));

    render(<Text>Default tag</Text>);

    expect(screen.getByText('Default tag').tagName).toBe('SPAN');
  });

  it('renders the overridden tag via the as prop', () => {
    const Text = createPolymorphicComponent('span', (props, ref, Component) => (
      <Component ref={ref} {...props} />
    ));

    render(<Text as="button">Action</Text>);

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('uses a custom component display name when the default tag is a component', () => {
    function CustomText(props) {
      return <span {...props} />;
    }

    const Text = createPolymorphicComponent(CustomText, (props, ref, Component) => (
      <Component ref={ref} {...props} />
    ));

    render(<Text>Named component</Text>);

    expect(Text.displayName).toBe('Polymorphic(CustomText)');
    expect(screen.getByText('Named component')).toBeInTheDocument();
  });
});
