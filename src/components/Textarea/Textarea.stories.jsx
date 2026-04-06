import { Textarea } from './Textarea';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    label: 'Project brief',
    placeholder: 'Outline the problem, constraints, and desired outcome.',
    helperText: 'The product team will review this before kickoff.',
    autoResize: false,
    showCharacterCount: false,
    isInvalid: false,
  },
};

export const Default = {};

export const AutoResize = {
  args: {
    label: 'Release notes',
    defaultValue: 'OrbitUI now supports token-driven fields and providers.',
    autoResize: true,
  },
};

export const WithCharacterCount = {
  args: {
    label: 'Summary',
    defaultValue: 'Ship it.',
    maxLength: 120,
    showCharacterCount: true,
  },
};

export const Invalid = {
  args: {
    label: 'Feedback',
    value: 'Too short',
    isInvalid: true,
    errorMessage: 'Please provide more implementation detail.',
  },
};
