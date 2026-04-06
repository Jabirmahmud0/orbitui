import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Checkbox,
  Input,
  OrbitProvider,
  Pagination,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  cn,
  composeRefs,
  createPolymorphicComponent,
  createSafeContext,
  orbitTokens,
  orbitUiVersion,
  useControllableState,
  useId,
  useMediaQuery,
  useOrbitContext,
} from './index';

describe('public API barrel', () => {
  it('exposes the documented root exports', () => {
    expect(orbitUiVersion).toBe('0.1.0');
    expect(Button).toBeTruthy();
    expect(Input).toBeTruthy();
    expect(Textarea).toBeTruthy();
    expect(Checkbox).toBeTruthy();
    expect(RadioGroup).toBeTruthy();
    expect(RadioGroupItem).toBeTruthy();
    expect(Tabs).toBeTruthy();
    expect(TabsList).toBeTruthy();
    expect(TabsTrigger).toBeTruthy();
    expect(TabsContent).toBeTruthy();
    expect(Breadcrumbs).toBeTruthy();
    expect(BreadcrumbsItem).toBeTruthy();
    expect(Pagination).toBeTruthy();
    expect(Tooltip).toBeTruthy();
    expect(OrbitProvider).toBeTruthy();
    expect(useOrbitContext).toBeTypeOf('function');
    expect(useControllableState).toBeTypeOf('function');
    expect(useId).toBeTypeOf('function');
    expect(useMediaQuery).toBeTypeOf('function');
    expect(cn).toBeTypeOf('function');
    expect(composeRefs).toBeTypeOf('function');
    expect(createSafeContext).toBeTypeOf('function');
    expect(createPolymorphicComponent).toBeTypeOf('function');
    expect(orbitTokens).toBeTypeOf('object');
    expect(orbitTokens.color.primary[500].value).toBe('#6366f1');
  });
});
