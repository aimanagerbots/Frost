import type {
  TeamMember,
  TeamChannel,
  TeamDM,
  TeamChatMessage,
} from '@/modules/chat/types/team-chat';

// ---------------------------------------------------------------------------
// Current user ID (the viewer)
// ---------------------------------------------------------------------------
export const CURRENT_USER_ID = 'tm-you';

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-you',
    name: 'You',
    role: 'Operations Lead',
    department: 'Operations',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-alex',
    name: 'Alex Rivera',
    role: 'CEO',
    department: 'Executive',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-marcus',
    name: 'Marcus Johnson',
    role: 'Sales Director',
    department: 'Sales',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-sarah',
    name: 'Sarah Kim',
    role: 'Operations Manager',
    department: 'Operations',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-maria',
    name: 'María García',
    role: 'Cultivation Manager',
    department: 'Cultivation',
    language: 'es',
    status: 'online',
  },
  {
    id: 'tm-carlos',
    name: 'Carlos Mendez',
    role: 'Cultivation Tech',
    department: 'Cultivation',
    language: 'es',
    status: 'away',
  },
  {
    id: 'tm-david',
    name: 'David Chen',
    role: 'Manufacturing Lead',
    department: 'Manufacturing',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-miguel',
    name: 'Miguel Santos',
    role: 'Manufacturing Tech',
    department: 'Manufacturing',
    language: 'es',
    status: 'offline',
  },
  {
    id: 'tm-jessica',
    name: 'Jessica Park',
    role: 'Packaging Lead',
    department: 'Packaging',
    language: 'en',
    status: 'away',
  },
  {
    id: 'tm-roberto',
    name: 'Roberto Flores',
    role: 'Fulfillment Coordinator',
    department: 'Fulfillment',
    language: 'es',
    status: 'online',
  },
  {
    id: 'tm-emily',
    name: 'Emily Watson',
    role: 'Finance Manager',
    department: 'Finance',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-james',
    name: 'James Cooper',
    role: 'Sales Rep',
    department: 'Sales',
    language: 'en',
    status: 'online',
  },
  {
    id: 'tm-ana',
    name: 'Ana Delgado',
    role: 'QA Specialist',
    department: 'Quality',
    language: 'es',
    status: 'online',
  },
];

// ---------------------------------------------------------------------------
// Channel Messages
// ---------------------------------------------------------------------------
const GENERAL_MESSAGES: TeamChatMessage[] = [
  {
    id: 'gm-1',
    channelId: 'ch-general',
    senderId: 'tm-alex',
    senderName: 'Alex Rivera',
    originalText:
      'Good morning team! Quick update — Q1 revenue is tracking 12% above forecast. Great work across all departments.',
    language: 'en',
    timestamp: '2026-03-07T08:00:00Z',
  },
  {
    id: 'gm-2',
    channelId: 'ch-general',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Huge win yesterday — Greenfield Dispensary signed a 6-month exclusive on our Wedding Cake and Blue Dream lines. $45K/month commitment.',
    language: 'en',
    timestamp: '2026-03-07T08:05:00Z',
  },
  {
    id: 'gm-3',
    channelId: 'ch-general',
    senderId: 'tm-sarah',
    senderName: 'Sarah Kim',
    originalText:
      'Congrats Marcus! Reminder: all-hands meeting this Friday at 2 PM. Agenda going out today — please add any topics to the shared doc.',
    language: 'en',
    timestamp: '2026-03-07T08:12:00Z',
  },
  {
    id: 'gm-4',
    channelId: 'ch-general',
    senderId: 'tm-emily',
    senderName: 'Emily Watson',
    originalText:
      'Nice one Marcus. I\'ll get the contract processed today. Also — payroll runs Thursday, please submit any expense reports by EOD Wednesday.',
    language: 'en',
    timestamp: '2026-03-07T08:18:00Z',
  },
  {
    id: 'gm-5',
    channelId: 'ch-general',
    senderId: 'tm-roberto',
    senderName: 'Roberto Flores',
    originalText:
      'Felicidades Marcus! Tenemos capacidad para cumplir con ese volumen sin problema.',
    translatedText:
      'Congrats Marcus! We have the capacity to fulfill that volume without any issues.',
    language: 'es',
    timestamp: '2026-03-07T08:22:00Z',
  },
  {
    id: 'gm-6',
    channelId: 'ch-general',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Manufacturing can handle it. We\'re running at 78% capacity this week so we have room.',
    language: 'en',
    timestamp: '2026-03-07T08:25:00Z',
  },
  {
    id: 'gm-7',
    channelId: 'ch-general',
    senderId: 'tm-alex',
    senderName: 'Alex Rivera',
    originalText:
      'Love the teamwork. Let\'s make sure we nail delivery on the first Greenfield order — first impressions matter.',
    language: 'en',
    timestamp: '2026-03-07T08:30:00Z',
  },
  {
    id: 'gm-8',
    channelId: 'ch-general',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText:
      'Packaging team is ready. We just finished the new label designs for the Wedding Cake line — they look fantastic.',
    language: 'en',
    timestamp: '2026-03-07T08:35:00Z',
  },
  {
    id: 'gm-9',
    channelId: 'ch-general',
    senderId: 'tm-ana',
    senderName: 'Ana Delgado',
    originalText:
      'Los resultados del COA para el lote WC-2026-03 están listos. Todo dentro de especificaciones.',
    translatedText:
      'The COA results for batch WC-2026-03 are ready. Everything is within specifications.',
    language: 'es',
    timestamp: '2026-03-07T08:40:00Z',
  },
];

const CULTIVATION_MESSAGES: TeamChatMessage[] = [
  {
    id: 'cm-1',
    channelId: 'ch-cultivation',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Buenos días equipo. Las plantas de la sala 1 se ven increíbles hoy. Los tricomas están muy desarrollados.',
    translatedText:
      'Good morning team. The plants in Room 1 look incredible today. The trichomes are very well developed.',
    language: 'es',
    timestamp: '2026-03-07T07:30:00Z',
  },
  {
    id: 'cm-2',
    channelId: 'ch-cultivation',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Confirmado. Revisé el riego esta mañana — el pH está en 6.2 y la EC de drenaje en 1.8. Todo perfecto.',
    translatedText:
      'Confirmed. I checked the irrigation this morning — pH is at 6.2 and runoff EC at 1.8. Everything is perfect.',
    language: 'es',
    timestamp: '2026-03-07T07:45:00Z',
  },
  {
    id: 'cm-3',
    channelId: 'ch-cultivation',
    senderId: 'tm-alex',
    senderName: 'Alex Rivera',
    originalText:
      'Great to hear. What\'s the estimated harvest date for Room 1?',
    language: 'en',
    timestamp: '2026-03-07T08:00:00Z',
  },
  {
    id: 'cm-4',
    channelId: 'ch-cultivation',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Estimo entre 3 y 4 días más. El 60% de los tricomas están ámbar. Wedding Cake necesita un poco más de tiempo.',
    translatedText:
      'I estimate 3 to 4 more days. 60% of the trichomes are amber. Wedding Cake needs a bit more time.',
    language: 'es',
    timestamp: '2026-03-07T08:10:00Z',
  },
  {
    id: 'cm-5',
    channelId: 'ch-cultivation',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Perfect timing. I\'ll schedule dry room prep for Thursday. María, do we need any supplies?',
    language: 'en',
    timestamp: '2026-03-07T08:15:00Z',
  },
  {
    id: 'cm-6',
    channelId: 'ch-cultivation',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Sí, necesitamos más ganchos de secado y bolsas de curado. Al menos 200 ganchos y 50 bolsas.',
    translatedText:
      'Yes, we need more drying hooks and curing bags. At least 200 hooks and 50 bags.',
    language: 'es',
    timestamp: '2026-03-07T08:20:00Z',
  },
  {
    id: 'cm-7',
    channelId: 'ch-cultivation',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'También quiero reportar un problema de humedad en la sala 3. Está al 72%, necesitamos bajarla a 55%.',
    translatedText:
      'I also want to report a humidity issue in Room 3. It\'s at 72%, we need to bring it down to 55%.',
    language: 'es',
    timestamp: '2026-03-07T08:30:00Z',
  },
  {
    id: 'cm-8',
    channelId: 'ch-cultivation',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'I\'ll put in a maintenance ticket for the Room 3 dehumidifier. Carlos, can you run a manual check on it in the meantime?',
    language: 'en',
    timestamp: '2026-03-07T08:35:00Z',
  },
  {
    id: 'cm-9',
    channelId: 'ch-cultivation',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Sí, ya lo revisé. Parece que el filtro necesita limpieza. Lo haré después del almuerzo.',
    translatedText:
      'Yes, I already checked it. It looks like the filter needs cleaning. I\'ll do it after lunch.',
    language: 'es',
    timestamp: '2026-03-07T08:40:00Z',
  },
  {
    id: 'cm-10',
    channelId: 'ch-cultivation',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Equipo, recuerden revisar los niveles de pH en las salas de vegetación antes del mediodía. Las lecturas de ayer estaban un poco altas.',
    translatedText:
      'Team, remember to check pH levels in the veg rooms before noon. Yesterday\'s readings were a bit high.',
    language: 'es',
    timestamp: '2026-03-07T09:00:00Z',
  },
  {
    id: 'cm-11',
    channelId: 'ch-cultivation',
    senderId: 'tm-alex',
    senderName: 'Alex Rivera',
    originalText:
      'Are we still on track to switch Room 3 from 18/6 to 12/12 after the humidity is resolved?',
    language: 'en',
    timestamp: '2026-03-07T09:15:00Z',
  },
  {
    id: 'cm-12',
    channelId: 'ch-cultivation',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Sí, una vez que la humedad esté controlada podemos cambiar el fotoperiodo. Probablemente el lunes.',
    translatedText:
      'Yes, once humidity is under control we can switch the photoperiod. Probably Monday.',
    language: 'es',
    timestamp: '2026-03-07T09:20:00Z',
  },
  {
    id: 'cm-13',
    channelId: 'ch-cultivation',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Las lecturas de EC del drenaje de la sala 5 son: mesa 1 = 1.6, mesa 2 = 1.9, mesa 3 = 1.7. Todo normal.',
    translatedText:
      'Room 5 runoff EC readings: table 1 = 1.6, table 2 = 1.9, table 3 = 1.7. All normal.',
    language: 'es',
    timestamp: '2026-03-07T09:30:00Z',
  },
];

const MANUFACTURING_MESSAGES: TeamChatMessage[] = [
  {
    id: 'mm-1',
    channelId: 'ch-manufacturing',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Morning team. Today\'s targets: 500 prerolls, 200 vape carts, and we need to finish the Blue Dream extraction batch.',
    language: 'en',
    timestamp: '2026-03-07T07:00:00Z',
  },
  {
    id: 'mm-2',
    channelId: 'ch-manufacturing',
    senderId: 'tm-miguel',
    senderName: 'Miguel Santos',
    originalText:
      'La mesa de recorte 2 está lista. Procesamos 12 libras de Blue Dream ayer, hoy debemos terminar las últimas 8.',
    translatedText:
      'Trim table 2 is ready. We processed 12 pounds of Blue Dream yesterday, today we should finish the last 8.',
    language: 'es',
    timestamp: '2026-03-07T07:15:00Z',
  },
  {
    id: 'mm-3',
    channelId: 'ch-manufacturing',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Good. Miguel, what was the extraction yield on yesterday\'s run?',
    language: 'en',
    timestamp: '2026-03-07T07:20:00Z',
  },
  {
    id: 'mm-4',
    channelId: 'ch-manufacturing',
    senderId: 'tm-miguel',
    senderName: 'Miguel Santos',
    originalText:
      'El rendimiento fue del 18.5%, un poco por encima de nuestro promedio de 17%. La calidad del material de entrada fue excelente.',
    translatedText:
      'The yield was 18.5%, slightly above our 17% average. The input material quality was excellent.',
    language: 'es',
    timestamp: '2026-03-07T07:25:00Z',
  },
  {
    id: 'mm-5',
    channelId: 'ch-manufacturing',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Nice yield. Equipment note: the pen filling machine needs scheduled maintenance next Tuesday. I\'ll coordinate with Sarah on downtime.',
    language: 'en',
    timestamp: '2026-03-07T07:30:00Z',
  },
  {
    id: 'mm-6',
    channelId: 'ch-manufacturing',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Can we front-load the vape cart production before maintenance? We have the Greenfield order to fill.',
    language: 'en',
    timestamp: '2026-03-07T07:35:00Z',
  },
  {
    id: 'mm-7',
    channelId: 'ch-manufacturing',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Absolutely. We\'ll run double shifts Monday if needed. The preroll line can cover while pen filling is down.',
    language: 'en',
    timestamp: '2026-03-07T07:40:00Z',
  },
  {
    id: 'mm-8',
    channelId: 'ch-manufacturing',
    senderId: 'tm-ana',
    senderName: 'Ana Delgado',
    originalText:
      'Recordatorio: necesito muestras del lote BD-2026-03 para el COA antes de las 2 PM.',
    translatedText:
      'Reminder: I need samples from batch BD-2026-03 for the COA before 2 PM.',
    language: 'es',
    timestamp: '2026-03-07T08:00:00Z',
  },
  {
    id: 'mm-9',
    channelId: 'ch-manufacturing',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Got it Ana. Miguel, please pull samples after the morning run and label them for QA.',
    language: 'en',
    timestamp: '2026-03-07T08:05:00Z',
  },
];

const SALES_MESSAGES: TeamChatMessage[] = [
  {
    id: 'sm-1',
    channelId: 'ch-sales',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Morning briefing: We have 22 active accounts, 3 flagged for attention. Rainier Remedies is 15 days overdue on payment.',
    language: 'en',
    timestamp: '2026-03-07T08:00:00Z',
  },
  {
    id: 'sm-2',
    channelId: 'ch-sales',
    senderId: 'tm-james',
    senderName: 'James Cooper',
    originalText:
      'Had a great meeting with Greenfield Dispensary yesterday. They\'re expanding to a second location and want us as primary supplier.',
    language: 'en',
    timestamp: '2026-03-07T08:10:00Z',
  },
  {
    id: 'sm-3',
    channelId: 'ch-sales',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Excellent James. Let\'s put together a custom pricing tier for them. Volume discount at 15% over $30K/month.',
    language: 'en',
    timestamp: '2026-03-07T08:15:00Z',
  },
  {
    id: 'sm-4',
    channelId: 'ch-sales',
    senderId: 'tm-james',
    senderName: 'James Cooper',
    originalText:
      'On it. Also, Pacific Leaf has been quiet for 2 weeks. Their buyer said they\'re testing a competitor\'s flower line.',
    language: 'en',
    timestamp: '2026-03-07T08:20:00Z',
  },
  {
    id: 'sm-5',
    channelId: 'ch-sales',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'We need a retention play for Pacific Leaf. Let\'s offer them first access to the new Wedding Cake batch — it tested at 28% THC.',
    language: 'en',
    timestamp: '2026-03-07T08:25:00Z',
  },
  {
    id: 'sm-6',
    channelId: 'ch-sales',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'I can confirm the Wedding Cake numbers. COA results came back strong. María says harvest is 3-4 days out.',
    language: 'en',
    timestamp: '2026-03-07T08:30:00Z',
  },
  {
    id: 'sm-7',
    channelId: 'ch-sales',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Perfect. James, set up a tasting session with Pacific Leaf for next week. Let\'s win them back.',
    language: 'en',
    timestamp: '2026-03-07T08:35:00Z',
  },
  {
    id: 'sm-8',
    channelId: 'ch-sales',
    senderId: 'tm-james',
    senderName: 'James Cooper',
    originalText:
      'Will do. I\'ll also prep a comparison sheet showing our quality metrics vs the competitor they\'re testing.',
    language: 'en',
    timestamp: '2026-03-07T08:40:00Z',
  },
];

const PACKAGING_MESSAGES: TeamChatMessage[] = [
  {
    id: 'pm-1',
    channelId: 'ch-packaging',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText:
      'Packaging queue update: 350 preroll tubes, 180 vape boxes, and 45 eighth jars on deck for today.',
    language: 'en',
    timestamp: '2026-03-07T07:30:00Z',
  },
  {
    id: 'pm-2',
    channelId: 'ch-packaging',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText:
      'New Wedding Cake labels are in from the printer. The holographic foil looks amazing. Sending photos to #general.',
    language: 'en',
    timestamp: '2026-03-07T08:00:00Z',
  },
  {
    id: 'pm-3',
    channelId: 'ch-packaging',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Great, Jessica. Make sure the compliance info matches the latest COA batch numbers before printing the full run.',
    language: 'en',
    timestamp: '2026-03-07T08:10:00Z',
  },
  {
    id: 'pm-4',
    channelId: 'ch-packaging',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText:
      'Already cross-referenced with Ana\'s COA results. All batch numbers and test dates are aligned.',
    language: 'en',
    timestamp: '2026-03-07T08:15:00Z',
  },
  {
    id: 'pm-5',
    channelId: 'ch-packaging',
    senderId: 'tm-ana',
    senderName: 'Ana Delgado',
    originalText:
      'Confirmado. Los números del lote WC-2026-03 coinciden. El THC total es 28.1%, CBD 0.3%.',
    translatedText:
      'Confirmed. Batch numbers for WC-2026-03 match. Total THC is 28.1%, CBD 0.3%.',
    language: 'es',
    timestamp: '2026-03-07T08:20:00Z',
  },
  {
    id: 'pm-6',
    channelId: 'ch-packaging',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText:
      'Perfect. We\'ll start the Wedding Cake packaging run tomorrow once we clear today\'s queue.',
    language: 'en',
    timestamp: '2026-03-07T08:25:00Z',
  },
];

const FULFILLMENT_MESSAGES: TeamChatMessage[] = [
  {
    id: 'fm-1',
    channelId: 'ch-fulfillment',
    senderId: 'tm-roberto',
    senderName: 'Roberto Flores',
    originalText:
      'Buenos días. Tenemos 8 órdenes pendientes de envío hoy. 3 son urgentes para entrega antes del mediodía.',
    translatedText:
      'Good morning. We have 8 orders pending shipment today. 3 are urgent for delivery before noon.',
    language: 'es',
    timestamp: '2026-03-07T06:30:00Z',
  },
  {
    id: 'fm-2',
    channelId: 'ch-fulfillment',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Which accounts are the urgent ones?',
    language: 'en',
    timestamp: '2026-03-07T06:35:00Z',
  },
  {
    id: 'fm-3',
    channelId: 'ch-fulfillment',
    senderId: 'tm-roberto',
    senderName: 'Roberto Flores',
    originalText:
      'Summit Health, Cascade Wellness y Emerald City. Ya empaqué las dos primeras, Emerald City necesita 20 más prerolls que aún están en producción.',
    translatedText:
      'Summit Health, Cascade Wellness, and Emerald City. I already packed the first two, Emerald City needs 20 more prerolls that are still in production.',
    language: 'es',
    timestamp: '2026-03-07T06:40:00Z',
  },
  {
    id: 'fm-4',
    channelId: 'ch-fulfillment',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'I\'ll check with David on the preroll timeline. We should have those ready by 10 AM.',
    language: 'en',
    timestamp: '2026-03-07T06:45:00Z',
  },
  {
    id: 'fm-5',
    channelId: 'ch-fulfillment',
    senderId: 'tm-roberto',
    senderName: 'Roberto Flores',
    originalText:
      'Perfecto. También necesitamos actualizar las rutas de entrega. La ruta norte tiene una construcción en la calle 5ta.',
    translatedText:
      'Perfect. We also need to update the delivery routes. The north route has construction on 5th Street.',
    language: 'es',
    timestamp: '2026-03-07T06:50:00Z',
  },
  {
    id: 'fm-6',
    channelId: 'ch-fulfillment',
    senderId: 'tm-sarah',
    senderName: 'Sarah Kim',
    originalText:
      'Roberto, I updated the route in the system. Should add about 10 minutes to the north deliveries. Let the drivers know.',
    language: 'en',
    timestamp: '2026-03-07T07:00:00Z',
  },
  {
    id: 'fm-7',
    channelId: 'ch-fulfillment',
    senderId: 'tm-roberto',
    senderName: 'Roberto Flores',
    originalText:
      'Gracias Sarah. Ya les avisé a los conductores. Todo listo para salir a las 9 AM.',
    translatedText:
      'Thanks Sarah. I already notified the drivers. Everything ready to go at 9 AM.',
    language: 'es',
    timestamp: '2026-03-07T07:05:00Z',
  },
];

const RANDOM_MESSAGES: TeamChatMessage[] = [
  {
    id: 'rm-1',
    channelId: 'ch-random',
    senderId: 'tm-james',
    senderName: 'James Cooper',
    originalText: 'Anyone want to do a lunch run to that new taco place on Rainier Ave?',
    language: 'en',
    timestamp: '2026-03-07T11:30:00Z',
  },
  {
    id: 'rm-2',
    channelId: 'ch-random',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText: 'Sí, yo me apunto. Sus tacos al pastor son increíbles.',
    translatedText: 'Yes, count me in. Their tacos al pastor are incredible.',
    language: 'es',
    timestamp: '2026-03-07T11:32:00Z',
  },
  {
    id: 'rm-3',
    channelId: 'ch-random',
    senderId: 'tm-jessica',
    senderName: 'Jessica Park',
    originalText: 'I\'m in! Can someone grab me a chicken burrito if I can\'t leave the floor?',
    language: 'en',
    timestamp: '2026-03-07T11:35:00Z',
  },
  {
    id: 'rm-4',
    channelId: 'ch-random',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Happy Friday Eve everyone. Also, who keeps leaving their lunch in the break room fridge for weeks? Asking for my nose.',
    language: 'en',
    timestamp: '2026-03-07T11:40:00Z',
  },
  {
    id: 'rm-5',
    channelId: 'ch-random',
    senderId: 'tm-emily',
    senderName: 'Emily Watson',
    originalText: 'Guilty as charged on the fridge situation. I\'ll clean it out today, promise.',
    language: 'en',
    timestamp: '2026-03-07T11:42:00Z',
  },
  {
    id: 'rm-6',
    channelId: 'ch-random',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText: 'Traigo tamales de mi abuela mañana para el equipo. Alguien tiene alguna alergia que deba saber?',
    translatedText: 'I\'m bringing my grandma\'s tamales tomorrow for the team. Does anyone have any allergies I should know about?',
    language: 'es',
    timestamp: '2026-03-07T11:45:00Z',
  },
  {
    id: 'rm-7',
    channelId: 'ch-random',
    senderId: 'tm-james',
    senderName: 'James Cooper',
    originalText: 'No allergies here, just an allergy to NOT eating tamales. Sign me up!',
    language: 'en',
    timestamp: '2026-03-07T11:48:00Z',
  },
];

// ---------------------------------------------------------------------------
// DM Messages
// ---------------------------------------------------------------------------
const DM_MARIA_MESSAGES: TeamChatMessage[] = [
  {
    id: 'dm-maria-1',
    dmId: 'dm-maria',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Hola, quería hablar contigo sobre la cosecha de la sala 1. Los tricomas están casi listos.',
    translatedText:
      'Hi, I wanted to talk to you about the Room 1 harvest. The trichomes are almost ready.',
    language: 'es',
    timestamp: '2026-03-07T09:00:00Z',
  },
  {
    id: 'dm-maria-2',
    dmId: 'dm-maria',
    senderId: 'tm-you',
    senderName: 'You',
    originalText: 'Great to hear! What\'s your estimate on timing?',
    language: 'en',
    timestamp: '2026-03-07T09:05:00Z',
  },
  {
    id: 'dm-maria-3',
    dmId: 'dm-maria',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Creo que necesitamos 3-4 días más. El 60% de los tricomas están ámbar.',
    translatedText:
      'I think we need 3-4 more days. 60% of the trichomes are amber.',
    language: 'es',
    timestamp: '2026-03-07T09:08:00Z',
  },
  {
    id: 'dm-maria-4',
    dmId: 'dm-maria',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Perfect. Should I schedule the dry room prep for Thursday?',
    language: 'en',
    timestamp: '2026-03-07T09:12:00Z',
  },
  {
    id: 'dm-maria-5',
    dmId: 'dm-maria',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'Sí, eso sería ideal. También necesitamos más ganchos de secado.',
    translatedText:
      'Yes, that would be ideal. We also need more drying hooks.',
    language: 'es',
    timestamp: '2026-03-07T09:15:00Z',
  },
  {
    id: 'dm-maria-6',
    dmId: 'dm-maria',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'I\'ll add drying hooks to the supply order. Anything else?',
    language: 'en',
    timestamp: '2026-03-07T09:18:00Z',
  },
  {
    id: 'dm-maria-7',
    dmId: 'dm-maria',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText:
      'También necesitamos bolsas de curado. Y quiero hablar sobre el plan de rotación para la sala 3 cuando tengas tiempo.',
    translatedText:
      'We also need curing bags. And I want to talk about the rotation plan for Room 3 when you have time.',
    language: 'es',
    timestamp: '2026-03-07T09:22:00Z',
  },
  {
    id: 'dm-maria-8',
    dmId: 'dm-maria',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Absolutely. Let\'s block 30 minutes after lunch to go over Room 3 planning.',
    language: 'en',
    timestamp: '2026-03-07T09:25:00Z',
  },
  {
    id: 'dm-maria-9',
    dmId: 'dm-maria',
    senderId: 'tm-maria',
    senderName: 'María García',
    originalText: 'Perfecto. Nos vemos después del almuerzo. ¡Gracias!',
    translatedText: 'Perfect. See you after lunch. Thanks!',
    language: 'es',
    timestamp: '2026-03-07T09:28:00Z',
  },
  {
    id: 'dm-maria-10',
    dmId: 'dm-maria',
    senderId: 'tm-you',
    senderName: 'You',
    originalText: 'Sounds good, see you then!',
    language: 'en',
    timestamp: '2026-03-07T09:30:00Z',
  },
];

const DM_CARLOS_MESSAGES: TeamChatMessage[] = [
  {
    id: 'dm-carlos-1',
    dmId: 'dm-carlos',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Hola, tengo una pregunta sobre el tratamiento IPM de la sala 4. ¿Podemos usar neem o necesitamos algo más fuerte?',
    translatedText:
      'Hi, I have a question about the IPM treatment for Room 4. Can we use neem or do we need something stronger?',
    language: 'es',
    timestamp: '2026-03-07T10:00:00Z',
  },
  {
    id: 'dm-carlos-2',
    dmId: 'dm-carlos',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'What are you seeing in Room 4? Mites or fungus gnats?',
    language: 'en',
    timestamp: '2026-03-07T10:05:00Z',
  },
  {
    id: 'dm-carlos-3',
    dmId: 'dm-carlos',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Encontré algunos ácaros en las hojas inferiores. Todavía es temprano, no hay telarañas. Solo puntos blancos pequeños.',
    translatedText:
      'I found some mites on the lower leaves. It\'s still early, no webs. Just small white dots.',
    language: 'es',
    timestamp: '2026-03-07T10:10:00Z',
  },
  {
    id: 'dm-carlos-4',
    dmId: 'dm-carlos',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Good catch, early is good. Start with neem oil spray on the affected plants. If it doesn\'t clear up in 3 days, we\'ll escalate to predatory mites.',
    language: 'en',
    timestamp: '2026-03-07T10:15:00Z',
  },
  {
    id: 'dm-carlos-5',
    dmId: 'dm-carlos',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Entendido. Voy a aplicar el neem esta tarde. ¿Debo aislar las plantas afectadas?',
    translatedText:
      'Understood. I\'ll apply the neem this afternoon. Should I isolate the affected plants?',
    language: 'es',
    timestamp: '2026-03-07T10:20:00Z',
  },
  {
    id: 'dm-carlos-6',
    dmId: 'dm-carlos',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Yes, move them to the quarantine area. Better safe than sorry. Log everything in the IPM tracker.',
    language: 'en',
    timestamp: '2026-03-07T10:25:00Z',
  },
  {
    id: 'dm-carlos-7',
    dmId: 'dm-carlos',
    senderId: 'tm-carlos',
    senderName: 'Carlos Mendez',
    originalText:
      'Perfecto, lo haré. Gracias por la guía.',
    translatedText:
      'Perfect, I\'ll do it. Thanks for the guidance.',
    language: 'es',
    timestamp: '2026-03-07T10:28:00Z',
  },
];

const DM_MARCUS_MESSAGES: TeamChatMessage[] = [
  {
    id: 'dm-marcus-1',
    dmId: 'dm-marcus',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Hey, wanted to loop you in on the Greenfield expansion strategy. They\'re opening a second location in Bellevue.',
    language: 'en',
    timestamp: '2026-03-07T10:30:00Z',
  },
  {
    id: 'dm-marcus-2',
    dmId: 'dm-marcus',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'That\'s exciting. What kind of volume are we looking at for both locations?',
    language: 'en',
    timestamp: '2026-03-07T10:35:00Z',
  },
  {
    id: 'dm-marcus-3',
    dmId: 'dm-marcus',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Current location does $30K/month. They\'re projecting the Bellevue spot to match within 3 months. So we\'re potentially looking at $60K/month.',
    language: 'en',
    timestamp: '2026-03-07T10:40:00Z',
  },
  {
    id: 'dm-marcus-4',
    dmId: 'dm-marcus',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Can manufacturing and cultivation support that? I\'ll check with David and María on capacity.',
    language: 'en',
    timestamp: '2026-03-07T10:45:00Z',
  },
  {
    id: 'dm-marcus-5',
    dmId: 'dm-marcus',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'That would be great. I don\'t want to commit to volumes we can\'t deliver. Also, they want exclusive access to our limited drops.',
    language: 'en',
    timestamp: '2026-03-07T10:50:00Z',
  },
  {
    id: 'dm-marcus-6',
    dmId: 'dm-marcus',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Exclusivity on limited drops is tricky. We\'d need to carve out allocation rules. Let\'s discuss at the leadership sync.',
    language: 'en',
    timestamp: '2026-03-07T10:55:00Z',
  },
  {
    id: 'dm-marcus-7',
    dmId: 'dm-marcus',
    senderId: 'tm-marcus',
    senderName: 'Marcus Johnson',
    originalText:
      'Agreed. I\'ll prep a proposal with tiered exclusivity — first 48 hours for premium accounts, then general release.',
    language: 'en',
    timestamp: '2026-03-07T11:00:00Z',
  },
];

const DM_DAVID_MESSAGES: TeamChatMessage[] = [
  {
    id: 'dm-david-1',
    dmId: 'dm-david',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Hey, I need to flag a bottleneck. The pen filling machine is running 15% slower than spec. We might miss the Greenfield deadline.',
    language: 'en',
    timestamp: '2026-03-07T11:00:00Z',
  },
  {
    id: 'dm-david-2',
    dmId: 'dm-david',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'How many carts are we behind? And what\'s causing the slowdown?',
    language: 'en',
    timestamp: '2026-03-07T11:05:00Z',
  },
  {
    id: 'dm-david-3',
    dmId: 'dm-david',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'We\'re about 80 carts behind schedule. The viscosity of this batch is higher than usual so the fill heads are running slower to avoid air bubbles.',
    language: 'en',
    timestamp: '2026-03-07T11:10:00Z',
  },
  {
    id: 'dm-david-4',
    dmId: 'dm-david',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Can we adjust the temperature on the oil reservoir to reduce viscosity? Or do we need to modify the fill speed settings?',
    language: 'en',
    timestamp: '2026-03-07T11:15:00Z',
  },
  {
    id: 'dm-david-5',
    dmId: 'dm-david',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Good idea on the temperature. I\'ll bump it up 5 degrees and run a test batch. If that works we should be back on track by tomorrow.',
    language: 'en',
    timestamp: '2026-03-07T11:20:00Z',
  },
  {
    id: 'dm-david-6',
    dmId: 'dm-david',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Perfect. Keep me posted. If we need to prioritize, let\'s push the preroll run to afternoon and focus on carts first.',
    language: 'en',
    timestamp: '2026-03-07T11:25:00Z',
  },
  {
    id: 'dm-david-7',
    dmId: 'dm-david',
    senderId: 'tm-david',
    senderName: 'David Chen',
    originalText:
      'Will do. I\'ll have an update by 2 PM after the test batch runs through.',
    language: 'en',
    timestamp: '2026-03-07T11:30:00Z',
  },
];

const DM_SARAH_MESSAGES: TeamChatMessage[] = [
  {
    id: 'dm-sarah-1',
    dmId: 'dm-sarah',
    senderId: 'tm-sarah',
    senderName: 'Sarah Kim',
    originalText:
      'Quick heads up — I\'m finalizing the vendor day schedule for next week. Can you confirm which departments need to present?',
    language: 'en',
    timestamp: '2026-03-07T09:00:00Z',
  },
  {
    id: 'dm-sarah-2',
    dmId: 'dm-sarah',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Cultivation, Manufacturing, and Sales for sure. Maybe QA too — Ana has some new testing workflow improvements.',
    language: 'en',
    timestamp: '2026-03-07T09:10:00Z',
  },
  {
    id: 'dm-sarah-3',
    dmId: 'dm-sarah',
    senderId: 'tm-sarah',
    senderName: 'Sarah Kim',
    originalText:
      'Good call on QA. I\'ll reach out to Ana. Also, the maintenance crew flagged that the HVAC in Room 3 needs a filter replacement — is that related to the humidity issue?',
    language: 'en',
    timestamp: '2026-03-07T09:15:00Z',
  },
  {
    id: 'dm-sarah-4',
    dmId: 'dm-sarah',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Yes, Carlos flagged the same thing in #cultivation. The humidity is at 72% and we need it at 55%. Filter cleaning should fix it.',
    language: 'en',
    timestamp: '2026-03-07T09:20:00Z',
  },
  {
    id: 'dm-sarah-5',
    dmId: 'dm-sarah',
    senderId: 'tm-sarah',
    senderName: 'Sarah Kim',
    originalText:
      'I\'ll fast-track the maintenance request. Should be done by end of day.',
    language: 'en',
    timestamp: '2026-03-07T09:25:00Z',
  },
  {
    id: 'dm-sarah-6',
    dmId: 'dm-sarah',
    senderId: 'tm-you',
    senderName: 'You',
    originalText:
      'Thanks Sarah. You\'re a lifesaver.',
    language: 'en',
    timestamp: '2026-03-07T09:28:00Z',
  },
];

// ---------------------------------------------------------------------------
// Message lookup maps
// ---------------------------------------------------------------------------
const CHANNEL_MESSAGES: Record<string, TeamChatMessage[]> = {
  'ch-general': GENERAL_MESSAGES,
  'ch-cultivation': CULTIVATION_MESSAGES,
  'ch-manufacturing': MANUFACTURING_MESSAGES,
  'ch-sales': SALES_MESSAGES,
  'ch-packaging': PACKAGING_MESSAGES,
  'ch-fulfillment': FULFILLMENT_MESSAGES,
  'ch-random': RANDOM_MESSAGES,
};

const DM_MESSAGES: Record<string, TeamChatMessage[]> = {
  'dm-marcus': DM_MARCUS_MESSAGES,
  'dm-maria': DM_MARIA_MESSAGES,
  'dm-david': DM_DAVID_MESSAGES,
  'dm-sarah': DM_SARAH_MESSAGES,
  'dm-carlos': DM_CARLOS_MESSAGES,
};

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------
function lastMsg(msgs: TeamChatMessage[]): TeamChatMessage | undefined {
  return msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
}

const ALL_MEMBER_IDS = TEAM_MEMBERS.map((m) => m.id);

const CHANNELS: TeamChannel[] = [
  {
    id: 'ch-general',
    name: 'general',
    displayName: '#general',
    description: 'Company-wide announcements and general discussion',
    memberIds: ALL_MEMBER_IDS,
    unreadCount: 3,
    lastMessage: lastMsg(GENERAL_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ch-cultivation',
    name: 'cultivation',
    displayName: '#cultivation',
    description: 'Cultivation team — grow room updates, IPM, harvest planning',
    memberIds: ['tm-you', 'tm-alex', 'tm-maria', 'tm-carlos', 'tm-sarah'],
    moduleLink: '/cultivation',
    unreadCount: 5,
    lastMessage: lastMsg(CULTIVATION_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ch-manufacturing',
    name: 'manufacturing',
    displayName: '#manufacturing',
    description: 'Manufacturing — extraction, prerolls, vape carts, production targets',
    memberIds: ['tm-you', 'tm-david', 'tm-miguel', 'tm-ana', 'tm-sarah'],
    moduleLink: '/manufacturing',
    unreadCount: 2,
    lastMessage: lastMsg(MANUFACTURING_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ch-packaging',
    name: 'packaging',
    displayName: '#packaging',
    description: 'Packaging — labels, compliance, packaging queue',
    memberIds: ['tm-you', 'tm-jessica', 'tm-ana', 'tm-sarah'],
    moduleLink: '/packaging',
    unreadCount: 0,
    lastMessage: lastMsg(PACKAGING_MESSAGES),
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'ch-fulfillment',
    name: 'fulfillment',
    displayName: '#fulfillment',
    description: 'Fulfillment & delivery — orders, routes, shipment tracking',
    memberIds: ['tm-you', 'tm-roberto', 'tm-sarah', 'tm-marcus'],
    moduleLink: '/fulfillment',
    unreadCount: 4,
    lastMessage: lastMsg(FULFILLMENT_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ch-sales',
    name: 'sales',
    displayName: '#sales',
    description: 'Sales team — accounts, pipeline, wins, strategy',
    memberIds: ['tm-you', 'tm-marcus', 'tm-james', 'tm-alex', 'tm-emily'],
    moduleLink: '/crm',
    unreadCount: 1,
    lastMessage: lastMsg(SALES_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ch-random',
    name: 'random',
    displayName: '#random',
    description: 'Off-topic, water cooler, lunch plans',
    memberIds: ALL_MEMBER_IDS,
    unreadCount: 0,
    lastMessage: lastMsg(RANDOM_MESSAGES),
    createdAt: '2025-01-15T00:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Direct Messages
// ---------------------------------------------------------------------------
const DMS: TeamDM[] = [
  {
    id: 'dm-marcus',
    participantIds: ['tm-you', 'tm-marcus'],
    unreadCount: 2,
    lastMessage: lastMsg(DM_MARCUS_MESSAGES),
  },
  {
    id: 'dm-maria',
    participantIds: ['tm-you', 'tm-maria'],
    unreadCount: 3,
    lastMessage: lastMsg(DM_MARIA_MESSAGES),
  },
  {
    id: 'dm-david',
    participantIds: ['tm-you', 'tm-david'],
    unreadCount: 1,
    lastMessage: lastMsg(DM_DAVID_MESSAGES),
  },
  {
    id: 'dm-sarah',
    participantIds: ['tm-you', 'tm-sarah'],
    unreadCount: 0,
    lastMessage: lastMsg(DM_SARAH_MESSAGES),
  },
  {
    id: 'dm-carlos',
    participantIds: ['tm-you', 'tm-carlos'],
    unreadCount: 0,
    lastMessage: lastMsg(DM_CARLOS_MESSAGES),
  },
];

// ---------------------------------------------------------------------------
// Context Panel Data (for module-linked channels)
// ---------------------------------------------------------------------------
export type ChannelContextData = {
  label: string;
  items: { name: string; value: string; status?: 'success' | 'warning' | 'danger' }[];
};

const CHANNEL_CONTEXT: Record<string, ChannelContextData> = {
  'ch-cultivation': {
    label: 'Grow Room Status',
    items: [
      { name: 'Room 1 — Wedding Cake', value: 'Flowering (Day 52)', status: 'success' },
      { name: 'Room 2 — Blue Dream', value: 'Vegetative', status: 'success' },
      { name: 'Room 3 — OG Kush', value: 'Humidity Alert (72%)', status: 'warning' },
      { name: 'Room 4 — Gelato', value: 'IPM Treatment', status: 'warning' },
      { name: 'Room 5 — Sour Diesel', value: 'Vegetative', status: 'success' },
    ],
  },
  'ch-manufacturing': {
    label: "Today's Production",
    items: [
      { name: 'Prerolls', value: '320 / 500 target', status: 'warning' },
      { name: 'Vape Carts', value: '120 / 200 target', status: 'warning' },
      { name: 'Extraction (Blue Dream)', value: '12 / 20 lbs', status: 'success' },
      { name: 'Equipment Status', value: 'All Operational', status: 'success' },
    ],
  },
  'ch-packaging': {
    label: 'Packaging Queue',
    items: [
      { name: 'Preroll Tubes', value: '350 units', status: 'success' },
      { name: 'Vape Boxes', value: '180 units', status: 'success' },
      { name: 'Eighth Jars', value: '45 units', status: 'success' },
      { name: 'Wedding Cake Labels', value: 'Ready (pending batch)', status: 'warning' },
    ],
  },
  'ch-fulfillment': {
    label: 'Orders Pending',
    items: [
      { name: 'Urgent (Before Noon)', value: '3 orders', status: 'danger' },
      { name: 'Standard (Today)', value: '5 orders', status: 'warning' },
      { name: 'Scheduled (This Week)', value: '12 orders', status: 'success' },
    ],
  },
  'ch-sales': {
    label: 'Pipeline Summary',
    items: [
      { name: 'Active Accounts', value: '22', status: 'success' },
      { name: 'Needs Attention', value: '3', status: 'warning' },
      { name: 'Overdue Payments', value: '1 (Rainier)', status: 'danger' },
      { name: 'New This Month', value: '2', status: 'success' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Async data fetchers (for TanStack Query hooks)
// ---------------------------------------------------------------------------
export async function getTeamMembers(): Promise<TeamMember[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...TEAM_MEMBERS];
}

export async function getTeamChannels(): Promise<TeamChannel[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...CHANNELS];
}

export async function getTeamDMs(): Promise<TeamDM[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...DMS];
}

export async function getChannelMessages(
  channelId: string,
): Promise<TeamChatMessage[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [...(CHANNEL_MESSAGES[channelId] ?? [])];
}

export async function getDMMessages(
  dmId: string,
): Promise<TeamChatMessage[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [...(DM_MESSAGES[dmId] ?? [])];
}

export function getChannelContext(
  channelId: string,
): ChannelContextData | undefined {
  return CHANNEL_CONTEXT[channelId];
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}
