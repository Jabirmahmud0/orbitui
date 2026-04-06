import { useState } from 'react';

import { Pagination } from './Pagination';

function ControlledPaginationExample() {
  const [page, setPage] = useState(4);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-foreground-muted)]">Current page: {page}</p>
      <Pagination totalPages={14} page={page} onPageChange={setPage} />
    </div>
  );
}

export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    totalPages: 12,
    defaultPage: 6,
    siblingCount: 1,
    showFirstLast: true,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Pagination renders page navigation controls with ellipsis handling, controlled state support, and optional first or last shortcuts.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive pagination playground for the standard page range API.',
      },
      source: { state: 'open' },
    },
  },
};

export const Compact = {
  parameters: {
    docs: {
      description: {
        story: 'Compact pagination hides first and last shortcuts for tighter toolbars.',
      },
    },
  },
  args: {
    totalPages: 6,
    defaultPage: 3,
    showFirstLast: false,
  },
};

export const Controlled = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled usage keeps the active page in application state.',
      },
      source: { state: 'open' },
    },
  },
  render: () => <ControlledPaginationExample />,
};

export const DenseEllipsis = {
  parameters: {
    docs: {
      description: {
        story: 'Long ranges collapse into ellipsis while preserving nearby context.',
      },
    },
  },
  args: {
    totalPages: 24,
    defaultPage: 12,
    siblingCount: 1,
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled pagination prevents interaction across the full control set.',
      },
    },
  },
  args: {
    totalPages: 10,
    defaultPage: 5,
    isDisabled: true,
  },
};
