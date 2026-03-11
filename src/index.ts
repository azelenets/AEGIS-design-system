import '@/foundations/globals.css';

// ─── Foundations ─────────────────────────────────────────────────────────────
export { aegisTailwindTheme, aegisTokens, aegisCSSVars } from '@/foundations/aegisTheme';
export { aegisLayers } from '@/foundations/layers';
export { ThemeProvider, useTheme }                       from '@/foundations/ThemeContext';
export type { Theme, ThemeContextValue, ThemeProviderProps } from '@/foundations/ThemeContext';
export type { AegisLayerName } from '@/foundations/layers';

// ─── Atoms ───────────────────────────────────────────────────────────────────
export { default as Avatar }       from '@/components/atoms/Avatar';
export { default as Badge }        from '@/components/atoms/Badge';
export { default as Button }       from '@/components/atoms/Button';
export { default as Checkbox }     from '@/components/atoms/Checkbox';
export { default as Divider }      from '@/components/atoms/Divider';
export { default as Input }        from '@/components/atoms/Input';
export { default as Kbd }          from '@/components/atoms/Kbd';
export { default as MaterialIcon } from '@/components/atoms/MaterialIcon';
export { default as RadioGroup, RadioOption } from '@/components/atoms/Radio';
export { default as Rating }       from '@/components/atoms/Rating';
export { default as SearchInput }  from '@/components/atoms/SearchInput';
export { default as Select }       from '@/components/atoms/Select';
export { default as Skeleton }     from '@/components/atoms/Skeleton';
export { default as Slider }       from '@/components/atoms/Slider';
export { default as Spinner }      from '@/components/atoms/Spinner';
export { default as Tag }          from '@/components/atoms/Tag';
export { default as Textarea }     from '@/components/atoms/Textarea';
export { default as ThemeToggle }  from '@/components/atoms/ThemeToggle';
export { default as Toggle }       from '@/components/atoms/Toggle';
export { default as Tooltip }      from '@/components/atoms/Tooltip';

// ─── Molecules ────────────────────────────────────────────────────────────────
export { default as Accordion }    from '@/components/molecules/Accordion';
export { default as Alert }        from '@/components/molecules/Alert';
export { default as AvatarGroup }  from '@/components/molecules/AvatarGroup';
export { default as Breadcrumbs }  from '@/components/molecules/Breadcrumbs';
export { default as Card, CardHeader, CardBody, CardFooter } from '@/components/molecules/Card';
export { default as Form, FormSection, FormRow, FormActions } from '@/components/molecules/Form';
export { default as Pagination }   from '@/components/molecules/Pagination';
export { default as ProgressBar }  from '@/components/molecules/ProgressBar';
export { default as ProgressCircle } from '@/components/molecules/ProgressCircle';

// ─── Organisms ────────────────────────────────────────────────────────────────
export { default as Carousel, CarouselSlide } from '@/components/organisms/Carousel';
export { default as DataGrid }     from '@/components/organisms/DataGrid';
export { default as Dropdown, DropdownItem, DropdownSeparator, DropdownGroup } from '@/components/organisms/Dropdown';
export { default as Footer }       from '@/components/organisms/Footer';
export { default as Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/organisms/Modal';
export { default as Navbar }       from '@/components/organisms/Navbar';
export { default as Sidebar }      from '@/components/organisms/Sidebar';
export { default as Stepper }      from '@/components/organisms/Stepper';
export { default as Table }        from '@/components/organisms/Table';
export { default as Tabs, TabList, TabTrigger, TabPanel } from '@/components/organisms/Tabs';
export { ToastProvider, Toaster, useToast } from '@/components/organisms/Toast';
export { default as Wizard }      from '@/components/organisms/Wizard';
export { default as Map }         from '@/components/organisms/Map';

// ─── Layout ──────────────────────────────────────────────────────────────────
export { default as Container }    from '@/components/layout/Container';
export { default as Grid, GridItem } from '@/components/layout/Grid';
export { default as Overlay }      from '@/components/layout/Overlay';
export { default as PageHeader }   from '@/components/layout/PageHeader';
export { default as Stack, HStack, VStack, ZStack, Spacer, Center } from '@/components/layout/Stack';

// ─── Types — Atoms ────────────────────────────────────────────────────────────
export type { AvatarProps, AvatarSize, AvatarVariant }                  from '@/components/atoms/Avatar';
export type { BadgeProps, BadgeVariant }                                 from '@/components/atoms/Badge';
export type { ButtonProps, ButtonVariant, ButtonSize }                   from '@/components/atoms/Button';
export type { CheckboxProps }                                            from '@/components/atoms/Checkbox';
export type { DividerProps, DividerVariant }                             from '@/components/atoms/Divider';
export type { InputProps }                                               from '@/components/atoms/Input';
export type { KbdProps }                                                 from '@/components/atoms/Kbd';
export type { MaterialIconProps }                                        from '@/components/atoms/MaterialIcon';
export type { RadioGroupProps, RadioOptionProps, RadioGroupOrientation } from '@/components/atoms/Radio';
export type { RatingProps, RatingVariant }                               from '@/components/atoms/Rating';
export type { SearchInputProps }                                         from '@/components/atoms/SearchInput';
export type { SelectProps, SelectOption }                                from '@/components/atoms/Select';
export type { SkeletonProps, SkeletonShape }                             from '@/components/atoms/Skeleton';
export type { SliderProps, SliderVariant }                               from '@/components/atoms/Slider';
export type { SpinnerProps, SpinnerSize, SpinnerVariant }                from '@/components/atoms/Spinner';
export type { TagProps, TagVariant }                                     from '@/components/atoms/Tag';
export type { TextareaProps }                                            from '@/components/atoms/Textarea';
export type { ThemeToggleProps, ThemeToggleSize, ThemeToggleVariant }    from '@/components/atoms/ThemeToggle';
export type { ToggleProps, ToggleSize, ToggleVariant }                   from '@/components/atoms/Toggle';
export type { TooltipProps, TooltipPlacement }                           from '@/components/atoms/Tooltip';

// ─── Types — Molecules ────────────────────────────────────────────────────────
export type { AccordionProps, AccordionItemData }                        from '@/components/molecules/Accordion';
export type { AlertProps, AlertVariant }                                 from '@/components/molecules/Alert';
export type { AvatarGroupProps }                                         from '@/components/molecules/AvatarGroup';
export type { BreadcrumbsProps, BreadcrumbItem, BreadcrumbSeparator }    from '@/components/molecules/Breadcrumbs';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardVariant } from '@/components/molecules/Card';
export type { FormSectionProps, FormRowProps, FormRowCols, FormActionsProps, FormProps } from '@/components/molecules/Form';
export type { PaginationProps }                                          from '@/components/molecules/Pagination';
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize }   from '@/components/molecules/ProgressBar';
export type { ProgressCircleProps, ProgressCircleVariant, ProgressCircleSize } from '@/components/molecules/ProgressCircle';

// ─── Types — Organisms ────────────────────────────────────────────────────────
export type { CarouselProps, CarouselSlideProps, CarouselIndicator, CarouselTransition } from '@/components/organisms/Carousel';
export type { DataGridProps, DataGridColumn, DGSortDir, DGAlign, DGDensity, DGSelectMode } from '@/components/organisms/DataGrid';
export type { DropdownProps, DropdownItemProps, DropdownGroupProps }     from '@/components/organisms/Dropdown';
export type { FooterProps, FooterGroup, FooterLink }                     from '@/components/organisms/Footer';
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps, ModalSize, ModalVariant } from '@/components/organisms/Modal';
export type { NavbarProps, NavItem }                                     from '@/components/organisms/Navbar';
export type { SidebarProps, SidebarGroup, SidebarNavItem }               from '@/components/organisms/Sidebar';
export type { StepperProps, StepData, StepStatus, StepperOrientation }   from '@/components/organisms/Stepper';
export type { TableColumn, TableProps, SortDirection, ColumnAlign }      from '@/components/organisms/Table';
export type { TabsProps, TabListProps, TabTriggerProps, TabPanelProps, TabsVariant } from '@/components/organisms/Tabs';
export type { ToastData, ToastVariant, ToastPosition }                   from '@/components/organisms/Toast';
export type { WizardProps, WizardStep }                                  from '@/components/organisms/Wizard';
export type { MapProps, MapMarker }                                      from '@/components/organisms/Map';

// ─── Types — Layout ───────────────────────────────────────────────────────────
export type { ContainerProps, ContainerSize }                            from '@/components/layout/Container';
export type { GridProps, GridItemProps, GridCols, GridGap, GridSpan, GridAlign, GridJustify } from '@/components/layout/Grid';
export type { OverlayProps }                                             from '@/components/layout/Overlay';
export type { StackProps, HStackProps, VStackProps, ZStackProps, SpacerProps, CenterProps, StackDirection, StackGap, StackAlign, StackJustify, ZStackAlign } from '@/components/layout/Stack';

// ─── Domain components ────────────────────────────────────────────────────────
export { default as FilterButton } from '@/components/arsenal/FilterButton';
export { default as SpecCard }     from '@/components/arsenal/SpecCard';
export { default as StatusItem }   from '@/components/arsenal/StatusItem';
export { default as EntryCard }    from '@/components/credentials/EntryCard';
export { default as TimelineEntry } from '@/components/credentials/TimelineEntry';
export { default as TagGroup }     from '@/components/credentials/TagGroup';
export { default as StatBlock }    from '@/components/dashboard/StatBlock';
export { default as StatCard }     from '@/components/dashboard/StatCard';
export { default as LabCard }      from '@/components/laboratory/LabCard';
export { default as MissionItem }  from '@/components/mission-log/MissionItem';
export type { TimelineEntryProps, TimelineField } from '@/components/credentials/TimelineEntry';
