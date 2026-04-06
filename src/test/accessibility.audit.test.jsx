import { axe } from 'vitest-axe';

import { renderWithProviders } from './setup';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { Pagination } from '../components/Pagination';
import { RadioGroup } from '../components/RadioGroup';
import { Tabs } from '../components/Tabs';
import { Textarea } from '../components/Textarea';
import { Tooltip } from '../components/Tooltip';

describe('accessibility audit', () => {
  const auditCases = [
    {
      name: 'Button',
      element: <Button>Save changes</Button>,
    },
    {
      name: 'Input',
      element: (
        <Input
          label="Email address"
          type="email"
          placeholder="you@orbitui.dev"
          helperText="We only use this for product updates."
        />
      ),
    },
    {
      name: 'Textarea',
      element: (
        <Textarea
          label="Release notes"
          helperText="Share what changed in this release."
          showCharacterCount
          maxLength={180}
          defaultValue="OrbitUI accessibility audit pass."
        />
      ),
    },
    {
      name: 'Checkbox',
      element: (
        <Checkbox
          label="Notify workspace admins"
          helperText="Admins receive rollout confirmation emails."
        />
      ),
    },
    {
      name: 'RadioGroup',
      element: (
        <RadioGroup
          label="Deployment strategy"
          helperText="Choose one rollout path."
          defaultValue="staged"
        >
          <RadioGroup.Item value="staged" description="Roll out over 24 hours.">
            Staged rollout
          </RadioGroup.Item>
          <RadioGroup.Item value="instant">Instant release</RadioGroup.Item>
        </RadioGroup>
      ),
    },
    {
      name: 'Tooltip',
      element: (
        <Tooltip content="Copy deployment URL" trigger="focus" delay={0} closeDelay={0}>
          <Button variant="secondary">Copy link</Button>
        </Tooltip>
      ),
    },
    {
      name: 'Tabs',
      element: (
        <Tabs defaultValue="overview">
          <Tabs.List aria-label="Project tabs">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">Overview panel</Tabs.Content>
          <Tabs.Content value="activity">Activity panel</Tabs.Content>
        </Tabs>
      ),
    },
    {
      name: 'Breadcrumbs',
      element: (
        <Breadcrumbs aria-label="Project breadcrumb trail">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/projects">Projects</Breadcrumbs.Item>
          <Breadcrumbs.Item>OrbitUI</Breadcrumbs.Item>
        </Breadcrumbs>
      ),
    },
    {
      name: 'Pagination',
      element: <Pagination totalPages={12} defaultPage={6} />,
    },
  ];

  it.each(auditCases)('$name has no axe violations', async ({ element }) => {
    const { container } = renderWithProviders(element);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
