// ─── Cultivation Module Translation Dictionary ────────────────
// 50+ EN/ES pairs covering navigation, environment, stages, tasks,
// general labels, section headings, buttons, and status terms.

export const translations: Record<string, { en: string; es: string }> = {
  // ── Navigation ──────────────────────────────────────────────
  dashboard: { en: 'Dashboard', es: 'Panel de Control' },
  allRooms: { en: 'All Rooms', es: 'Todos los Cuartos' },
  calendar: { en: 'Calendar', es: 'Calendario' },
  supplies: { en: 'Supplies', es: 'Insumos' },
  genetics: { en: 'Genetics', es: 'Genética' },
  aiChat: { en: 'AI Chat', es: 'Chat IA' },
  growAdvisor: { en: 'Grow Advisor', es: 'Asesor de Cultivo' },
  translator: { en: 'Translator', es: 'Traductor' },

  // ── Environment Metrics ─────────────────────────────────────
  temperature: { en: 'Temperature', es: 'Temperatura' },
  humidity: { en: 'Humidity', es: 'Humedad' },
  co2: { en: 'CO₂', es: 'CO₂' },
  vpd: { en: 'VPD', es: 'DPV' },
  lightIntensity: { en: 'Light Intensity', es: 'Intensidad Lumínica' },
  lightHours: { en: 'Light Hours', es: 'Horas de Luz' },
  waterEC: { en: 'Water EC', es: 'CE del Agua' },
  waterPH: { en: 'Water pH', es: 'pH del Agua' },
  soilMoisture: { en: 'Soil Moisture', es: 'Humedad del Suelo' },
  airflow: { en: 'Airflow', es: 'Circulación de Aire' },
  environmentStatus: { en: 'Environment Status', es: 'Estado del Ambiente' },

  // ── Growth Stages ───────────────────────────────────────────
  clone: { en: 'Clone', es: 'Clon' },
  veg: { en: 'Vegetative', es: 'Vegetativo' },
  flower: { en: 'Flower', es: 'Floración' },
  harvest: { en: 'Harvest', es: 'Cosecha' },
  dry: { en: 'Drying', es: 'Secado' },
  cure: { en: 'Curing', es: 'Curado' },
  transition: { en: 'Transition', es: 'Transición' },

  // ── Task Categories ─────────────────────────────────────────
  feeding: { en: 'Feeding', es: 'Alimentación' },
  inspection: { en: 'Inspection', es: 'Inspección' },
  ipm: { en: 'Pest Management', es: 'Control de Plagas' },
  defoliation: { en: 'Defoliation', es: 'Defoliación' },
  training: { en: 'Training', es: 'Entrenamiento' },
  transplant: { en: 'Transplant', es: 'Trasplante' },
  flush: { en: 'Flush', es: 'Lavado de Raíces' },
  harvestPrep: { en: 'Harvest Prep', es: 'Preparación de Cosecha' },
  environmental: { en: 'Environmental', es: 'Ambiental' },
  cleaning: { en: 'Cleaning', es: 'Limpieza' },

  // ── General Labels ──────────────────────────────────────────
  alerts: { en: 'Alerts', es: 'Alertas' },
  plants: { en: 'Plants', es: 'Plantas' },
  rooms: { en: 'Rooms', es: 'Cuartos' },
  room: { en: 'Room', es: 'Cuarto' },
  strain: { en: 'Strain', es: 'Cepa' },
  strains: { en: 'Strains', es: 'Cepas' },
  breeder: { en: 'Breeder', es: 'Criador' },
  yield: { en: 'Yield', es: 'Rendimiento' },
  nutrients: { en: 'Nutrients', es: 'Nutrientes' },
  schedule: { en: 'Schedule', es: 'Calendario' },
  notes: { en: 'Notes', es: 'Notas' },
  status: { en: 'Status', es: 'Estado' },
  day: { en: 'Day', es: 'Día' },
  week: { en: 'Week', es: 'Semana' },
  today: { en: 'Today', es: 'Hoy' },

  // ── Section Headings ────────────────────────────────────────
  activeRooms: { en: 'Active Rooms', es: 'Cuartos Activos' },
  totalPlants: { en: 'Total Plants', es: 'Total de Plantas' },
  nextHarvest: { en: 'Next Harvest', es: 'Próxima Cosecha' },
  harvestHistory: { en: 'Harvest History', es: 'Historial de Cosechas' },
  geneticsLibrary: { en: 'Genetics Library', es: 'Biblioteca Genética' },
  supplyInventory: { en: 'Supply Inventory', es: 'Inventario de Insumos' },
  environmentOverview: { en: 'Environment Overview', es: 'Resumen del Ambiente' },
  taskCalendar: { en: 'Task Calendar', es: 'Calendario de Tareas' },
  recentActivity: { en: 'Recent Activity', es: 'Actividad Reciente' },

  // ── Button Labels ───────────────────────────────────────────
  save: { en: 'Save', es: 'Guardar' },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  edit: { en: 'Edit', es: 'Editar' },
  delete: { en: 'Delete', es: 'Eliminar' },
  add: { en: 'Add', es: 'Agregar' },
  search: { en: 'Search', es: 'Buscar' },
  filter: { en: 'Filter', es: 'Filtrar' },
  viewAll: { en: 'View All', es: 'Ver Todo' },
  viewDetails: { en: 'View Details', es: 'Ver Detalles' },
  acknowledge: { en: 'Acknowledge', es: 'Confirmar' },
  markComplete: { en: 'Mark Complete', es: 'Marcar Completo' },
  reorder: { en: 'Reorder', es: 'Reordenar' },
  export: { en: 'Export', es: 'Exportar' },

  // ── Status Terms ────────────────────────────────────────────
  optimal: { en: 'Optimal', es: 'Óptimo' },
  warning: { en: 'Warning', es: 'Advertencia' },
  critical: { en: 'Critical', es: 'Crítico' },
  active: { en: 'Active', es: 'Activo' },
  empty: { en: 'Empty', es: 'Vacío' },
  inStock: { en: 'In Stock', es: 'En Existencia' },
  lowStock: { en: 'Low Stock', es: 'Stock Bajo' },
  outOfStock: { en: 'Out of Stock', es: 'Agotado' },
  complete: { en: 'Complete', es: 'Completo' },
  upcoming: { en: 'Upcoming', es: 'Próximo' },
  overdue: { en: 'Overdue', es: 'Atrasado' },
  onTrack: { en: 'On Track', es: 'En Curso' },

  // ── Strain / Genetics ───────────────────────────────────────
  indica: { en: 'Indica', es: 'Índica' },
  sativa: { en: 'Sativa', es: 'Sativa' },
  hybrid: { en: 'Hybrid', es: 'Híbrido' },
  cbd: { en: 'CBD', es: 'CBD' },
  terpenes: { en: 'Terpenes', es: 'Terpenos' },
  lineage: { en: 'Lineage', es: 'Linaje' },
  motherPlant: { en: 'Mother Plant', es: 'Planta Madre' },
  phenotype: { en: 'Phenotype', es: 'Fenotipo' },
  flowerTime: { en: 'Flower Time', es: 'Tiempo de Floración' },
  vegTime: { en: 'Veg Time', es: 'Tiempo Vegetativo' },
};

export function t(key: string, lang: 'en' | 'es'): string {
  return translations[key]?.[lang] ?? key;
}
