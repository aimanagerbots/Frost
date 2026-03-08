'use client';

import { useQuery } from '@tanstack/react-query';
import { getNutrientRecipeForRoom } from '@/mocks/cultivation';

export function useNutrientRecipe(roomId: string) {
  return useQuery({
    queryKey: ['cultivation', 'nutrient-recipe', roomId],
    queryFn: () => getNutrientRecipeForRoom(roomId),
    enabled: !!roomId,
  });
}
