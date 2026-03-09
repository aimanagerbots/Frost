'use client';

import { useState, useMemo, useCallback } from 'react';
import { RotateCcw, Save, Loader2 } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useUserPermissions } from '@/modules/users/hooks/useUsers';
import { useModuleDefinitions } from '@/modules/users/hooks/useModuleDefinitions';
import { useSetUserOverrides } from '@/modules/users/hooks/useUserMutations';
import { RolePresetSelector } from './RolePresetSelector';
import type { ModuleOverride } from '@/modules/auth/types';

interface PermissionEditorProps {
  userId: string;
  userRole: string;
}

export function PermissionEditor({ userId, userRole }: PermissionEditorProps) {
  const { data: permissions, isLoading: permsLoading } = useUserPermissions(userId);
  const { data: modules, isLoading: modulesLoading } = useModuleDefinitions();
  const setOverrides = useSetUserOverrides();

  // Local state for pending changes (before save)
  const [localOverrides, setLocalOverrides] = useState<Map<string, boolean> | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(userRole);

  // Initialize local overrides from server data
  const effectiveOverrides = useMemo(() => {
    if (localOverrides) return localOverrides;
    if (!permissions) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const o of permissions.overrides) {
      map.set(o.module_slug, o.granted);
    }
    return map;
  }, [localOverrides, permissions]);

  // Group modules by nav_group
  const groupedModules = useMemo(() => {
    if (!modules) return [];
    const groups = new Map<string, typeof modules>();
    for (const m of modules) {
      const existing = groups.get(m.nav_group) ?? [];
      existing.push(m);
      groups.set(m.nav_group, existing);
    }
    return [...groups.entries()].map(([group, items]) => ({ group, items }));
  }, [modules]);

  const roleDefaults = useMemo(
    () => new Set(permissions?.role_defaults ?? []),
    [permissions],
  );

  const isModuleEnabled = useCallback(
    (slug: string) => {
      const override = effectiveOverrides.get(slug);
      if (override !== undefined) return override;
      return roleDefaults.has(slug);
    },
    [effectiveOverrides, roleDefaults],
  );

  const getOverrideState = useCallback(
    (slug: string): 'default' | 'granted' | 'revoked' => {
      const override = effectiveOverrides.get(slug);
      if (override === true) return 'granted';
      if (override === false) return 'revoked';
      return 'default';
    },
    [effectiveOverrides],
  );

  function toggleModule(slug: string) {
    const current = isModuleEnabled(slug);
    const isDefault = roleDefaults.has(slug);
    const newMap = new Map(effectiveOverrides);

    if (current && isDefault) {
      // Currently on (default) → turn off via override
      newMap.set(slug, false);
    } else if (current && !isDefault) {
      // Currently on (via grant override) → remove override (falls back to off)
      newMap.delete(slug);
    } else if (!current && isDefault) {
      // Currently off (via revoke override) → remove override (falls back to on)
      newMap.delete(slug);
    } else {
      // Currently off (default) → turn on via override
      newMap.set(slug, true);
    }

    setLocalOverrides(newMap);
  }

  function resetToDefaults() {
    setLocalOverrides(new Map());
    setSelectedRole(userRole);
  }

  async function handleSave() {
    const overrides: ModuleOverride[] = [];
    for (const [slug, granted] of effectiveOverrides.entries()) {
      overrides.push({ module_slug: slug, granted });
    }
    await setOverrides.mutateAsync({ userId, overrides });
    setLocalOverrides(null);
  }

  const hasChanges =
    localOverrides !== null &&
    (localOverrides.size > 0 || (permissions?.overrides.length ?? 0) > 0);

  if (permsLoading || modulesLoading) {
    return <LoadingSkeleton variant="list" />;
  }

  return (
    <div className="space-y-6">
      {/* Role Preset */}
      <RolePresetSelector selectedRole={selectedRole} onChange={setSelectedRole} />

      {/* Module Grid */}
      {groupedModules.map(({ group, items }) => (
        <div key={group}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted/60">
            {group}
          </h3>
          <div className="space-y-1">
            {items.map((mod) => {
              const enabled = isModuleEnabled(mod.slug);
              const state = getOverrideState(mod.slug);

              return (
                <button
                  key={mod.slug}
                  onClick={() => toggleModule(mod.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    enabled
                      ? 'text-text-bright'
                      : 'text-text-muted/50 line-through'
                  } hover:bg-accent-hover`}
                >
                  <span className="flex items-center gap-2">
                    {mod.label}
                    {state === 'granted' && (
                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        added
                      </span>
                    )}
                    {state === 'revoked' && (
                      <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                        removed
                      </span>
                    )}
                  </span>

                  {/* Toggle indicator */}
                  <span
                    className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                      enabled ? 'justify-end' : 'justify-start'
                    }`}
                    style={{
                      backgroundColor: enabled ? '#94A3B840' : '#ffffff10',
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: enabled ? '#94A3B8' : '#ffffff30',
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Action Bar */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-default">
        <button
          onClick={handleSave}
          disabled={!hasChanges || setOverrides.isPending}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: '#94A3B8' }}
        >
          {setOverrides.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Permissions
        </button>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:text-text-default transition-colors"
        >
          <RotateCcw size={14} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
