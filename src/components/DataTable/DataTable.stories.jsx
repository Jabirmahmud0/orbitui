import { DataTable } from './DataTable';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'team', header: 'Team' },
  {
    key: 'health',
    header: 'Health',
    sortable: true,
    render: (value) => (
      <span
        className={
          value === 'Excellent'
            ? 'inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700'
            : value === 'Watch'
              ? 'inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700'
              : 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700'
        }
      >
        {value}
      </span>
    ),
  },
  { key: 'velocity', header: 'Velocity', sortable: true },
];

const rows = [
  { id: 'r1', name: 'Atlas Migration', team: 'Platform', health: 'Excellent', velocity: 96 },
  { id: 'r2', name: 'Helix Billing', team: 'Finance', health: 'Watch', velocity: 78 },
  { id: 'r3', name: 'Nova Search', team: 'AI', health: 'Excellent', velocity: 88 },
  { id: 'r4', name: 'Pulse Inbox', team: 'Core UX', health: 'Stable', velocity: 71 },
  { id: 'r5', name: 'Quartz Ops', team: 'Operations', health: 'Watch', velocity: 67 },
  { id: 'r6', name: 'Rift Assist', team: 'Support', health: 'Excellent', velocity: 91 },
];

export default {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    columns,
    data: rows,
    visibleRowCount: 5,
  },
  parameters: {
    docs: {
      description: {
        component:
          'DataTable handles client-side sorting, filtering, selection, and row windowing without forcing consumers into a headless table stack.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline analytics table with sortable numeric columns and a built-in filter field.',
      },
      source: { state: 'open' },
    },
  },
};

export const Selectable = {
  args: {
    selectable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Selection mode adds bulk selection and per-row checkboxes for operational workflows.',
      },
    },
  },
};

export const LoadingState = {
  args: {
    data: [],
    loading: true,
    loadingMessage: 'Fetching the latest workspace metrics...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading and empty states keep table containers stable while data refreshes.',
      },
    },
  },
};
