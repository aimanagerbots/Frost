from pydantic import BaseModel


class ModuleDefinition(BaseModel):
    slug: str
    label: str
    nav_group: str


class RoleModuleDefault(BaseModel):
    role: str
    module_slug: str


class UserModuleOverride(BaseModel):
    module_slug: str
    granted: bool


class ResolvedPermissions(BaseModel):
    allowed_modules: list[str]


class SetOverridesRequest(BaseModel):
    overrides: list[UserModuleOverride]


class SetRoleModulesRequest(BaseModel):
    module_slugs: list[str]


class UserPermissionsResponse(BaseModel):
    user_id: str
    role: str
    role_defaults: list[str]
    overrides: list[UserModuleOverride]
    allowed_modules: list[str]
