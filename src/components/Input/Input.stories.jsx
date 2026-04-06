import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email address',
    placeholder: 'you@orbitui.dev',
    helperText: 'We will use this for release notifications.',
    isInvalid: false,
    isRequired: false,
    isDisabled: false,
  },
};

export const Default = {};

export const WithAddons = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <Input
        label="Workspace URL"
        leftAddon={<span aria-hidden="true">https://</span>}
        placeholder="orbitui.app"
        helperText="Choose a unique subdomain."
      />
      <Input
        label="Search"
        placeholder="Find components"
        rightAddon={<span aria-hidden="true">?K</span>}
      />
    </div>
  ),
};

export const Invalid = {
  args: {
    label: 'Password',
    type: 'password',
    value: 'short',
    isInvalid: true,
    errorMessage: 'Password must be at least 12 characters.',
  },
};

export const Disabled = {
  args: {
    label: 'Organization',
    value: 'OrbitUI',
    isDisabled: true,
  },
};
