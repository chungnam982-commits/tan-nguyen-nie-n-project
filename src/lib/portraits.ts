import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { portraits as defaults } from "@/data/astra";

export type PortraitOverride = { astra_id: string; image_url: string | null; removed: boolean };

export const portraitsQueryKey = ["character-portraits"] as const;

export function usePortraitOverrides() {
  return useQuery({
    queryKey: portraitsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_portraits")
        .select("astra_id, image_url, removed");
      if (error) throw error;
      const map: Record<string, PortraitOverride> = {};
      for (const row of data ?? []) map[row.astra_id] = row;
      return map;
    },
  });
}

/** Resolves the portrait to show: override → removed (null) → default. */
export function resolvePortrait(
  id: string,
  overrides: Record<string, PortraitOverride> | undefined,
): string | null {
  const o = overrides?.[id];
  if (o) {
    if (o.removed) return null;
    if (o.image_url) return o.image_url;
  }
  return defaults[id] ?? null;
}

export function usePortrait(id: string) {
  const { data } = usePortraitOverrides();
  return resolvePortrait(id, data);
}
