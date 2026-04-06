import { Textarea } from './Textarea';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Project brief',
    placeholder: 'Outline the problem, constraints, and desired outcome.',
    helperText: 'The product team will review this before kickoff.',
    autoResize: false,
    showCharacterCount: false,
    isInvalid: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Textarea provides multi-line text entry with optional auto-resize behavior, helper text, validation state, and character count feedback.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for the standard multiline field API.',
      },
      source: { state: 'open' },
    },
  },
};

export const AutoResize = {
  parameters: {
    docs: {
      description: {
        story: 'Automatically grows with content for notes, briefs, and response fields.',
      },
    },
  },
  args: {
    label: 'Release notes',
    defaultValue: 'OrbitUI now supports token-driven fields and providers.',
    autoResize: true,
  },
};

export const WithCharacterCount = {
  parameters: {
    docs: {
      description: {
        story:
          'Character count gives writers feedback when an input has a practical or enforced limit.',
      },
    },
  },
  args: {
    label: 'Summary',
    defaultValue: 'Ship it.',
    maxLength: 120,
    showCharacterCount: true,
  },
};

export const Invalid = {
  parameters: {
    docs: {
      description: {
        story: 'Error state keeps the field accessible while surfacing validation feedback.',
      },
    },
  },
  args: {
    label: 'Feedback',
    value: 'Too short',
    isInvalid: true,
    errorMessage: 'Please provide more implementation detail.',
  },
};
