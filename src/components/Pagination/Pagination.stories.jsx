import { useState } from 'react';

import { Pagination } from './Pagination';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    totalPages: 12,
    defaultPage: 6,
    siblingCount: 1,
    showFirstLast: true,
    isDisabled: false,
  },
};

export const Default = {};

export const Compact = {
  args: {
    totalPages: 6,
    defaultPage: 3,
    showFirstLast: false,
  },
};

export const Controlled = {
  render: () => {
    function ControlledPaginationExample() {
      const [page, setPage] = useState(4);

      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-foreground-muted)]">Current page: {page}</p>
          <Pagination totalPages={14} page={page} onPageChange={setPage} />
        </div>
      );
    }

    return <ControlledPaginationExample />;
  },
};

export const DenseEllipsis = {
  args: {
    totalPages: 24,
    defaultPage: 12,
    siblingCount: 1,
  },
};

export const Disabled = {
  args: {
    totalPages: 10,
    defaultPage: 5,
    isDisabled: true,
  },
};
