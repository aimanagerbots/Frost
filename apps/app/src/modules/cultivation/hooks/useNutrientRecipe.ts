'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getNutrientRecipeForRoom } from '@/mocks/cultivation';
import type { NutrientRecipe } from '../types';

export function useNutrientRecipe(roomId: string) {
  return useDemoQuery<NutrientRecipe | undefined>({
    queryKey: ['cultivation', 'nutrient-recipe', roomId],
    demoQueryFn: () => getNutrientRecipeForRoom(roomId),
    emptyValue: undefined,
    enabled: !!roomId,
  });
}
