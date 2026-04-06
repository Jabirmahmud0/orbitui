import { useState } from 'react';

import { Button } from '../Button';
import { ToastProvider, toast, useToast } from './Toast';

function ImperativeStory() {
  return (
    <ToastProvider>
      <div className="flex min-h-48 items-start gap-3 p-6">
        <Button
          onClick={() =>
            toast.success({
              title: 'Deployment complete',
              description: 'orbitui.dev was updated successfully.',
            })
          }
        >
          Trigger success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error({
              title: 'Publish failed',
              description: 'The registry rejected your package token.',
            })
          }
        >
          Trigger error toast
        </Button>
      </div>
    </ToastProvider>
  );
}

function HookStory() {
  const [count, setCount] = useState(0);

  function TriggerPanel() {
    const { show } = useToast();

    return (
      <div className="flex min-h-48 items-start gap-3 p-6">
        <Button
          onClick={() => {
            const nextCount = count + 1;
            setCount(nextCount);
            show({
              title: `Queued task #${nextCount}`,
              description: 'Background sync has started.',
              actionLabel: 'Undo',
            });
          }}
        >
          Queue toast
        </Button>
      </div>
    );
  }

  return (
    <ToastProvider>
      <TriggerPanel />
    </ToastProvider>
  );
}

export default {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toast pairs a provider-backed queue with an imperative API so notifications can be triggered from hooks, actions, or external modules while still rendering in a consistent stacked viewport.',
      },
    },
  },
};

export const ImperativeApi = {
  render: () => <ImperativeStory />,
  parameters: {
    docs: {
      description: {
        story: 'Global imperative helpers are useful for surfacing async success and failure states from outside React event boundaries.',
      },
      source: { state: 'open' },
    },
  },
};

export const HookDriven = {
  render: () => <HookStory />,
  parameters: {
    docs: {
      description: {
        story: 'The hook API keeps notifications colocated with user flows while preserving the same viewport stack and dismissal logic.',
      },
    },
  },
};
