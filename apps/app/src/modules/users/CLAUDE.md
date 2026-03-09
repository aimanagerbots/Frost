# Users

Accent color: #94A3B8

Admin-only module for managing user accounts and module-level permissions. Admins can create, edit, deactivate users and toggle which sidebar modules each user can access via role defaults + per-user overrides.

## Key Components
- UsersPage — Main layout: SectionHeader + metric cards + UserList
- UserList — DataTable with search/filter by role and status
- UserDrawer — Slide-out panel with Profile and Permissions tabs
- UserForm — React Hook Form + Zod for create/edit
- PermissionEditor — Module toggle grid grouped by nav group
- RolePresetSelector — Dropdown to quick-apply role defaults

## Data Shape
- UserProfile — extends profiles table (id, email, full_name, role, department, is_active)
- UserPermissions — resolved permissions with role_defaults + overrides + allowed_modules
- ModuleDefinition — slug, label, nav_group from module_definitions table
