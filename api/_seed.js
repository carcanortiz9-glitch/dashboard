// Datos con los que arranca la base vacía: clientes, semana base y umbrales.
// Solo se usan la primera vez; después todo se edita desde la app.
export const SEED = {
  'clients/hastens': {
    name: 'Hästens', order: 1, industry: 'Colchones de lujo',
    funnel: 'Landing → reserva de Spa Session', platforms: 'Meta, Google', currency: 'MXN',
    cprLabel: 'Costo por cita', cprTarget: 0, budget: 0,
    notes: 'Se mide citas agendadas y asistencias. Los cierres no se miden por ahora.',
    metrics: [
      { key: 'citas', label: 'Citas agendadas', goal: 0, result: true },
      { key: 'asistencias', label: 'Asistencias', goal: 0 },
    ],
  },
  'clients/kordata': {
    name: 'Kordata', order: 2, industry: 'Software de gestión para negocios',
    funnel: 'Google → demo · Meta → WhatsApp y landing con cita', platforms: 'Google, Meta', currency: 'MXN',
    cprLabel: 'Costo por MQL', cprTarget: 0, budget: 0,
    notes: 'Segmentos: talleres mecánicos, transporte y general (boutiques, veterinarias, negocios con inventario). Se mide la suma de las tres estrategias.',
    metrics: [
      { key: 'mql', label: 'MQLs', goal: 0, result: true },
      { key: 'sql', label: 'SQLs', goal: 0 },
    ],
  },
  'clients/goled': {
    name: 'GoLED', order: 3, industry: 'Iluminación para casa, automóvil y proyectos',
    funnel: '3 segmentos de prospección', platforms: '', currency: 'MXN',
    cprLabel: 'Costo por prospecto', cprTarget: 0, budget: 0,
    notes: 'Meta: 90 prospectos por semana, 30 por segmento. Mensual ≈ 130 por segmento. Mayoristas = refaccionarias que compren bulbos.',
    metrics: [
      { key: 'campos', label: 'Campos deportivos', goal: 130, result: true },
      { key: 'industrial', label: 'Industrial', goal: 130, result: true },
      { key: 'mayoristas', label: 'Mayoristas', goal: 130, result: true },
    ],
  },
  'clients/carlos-estrada': {
    name: 'Carlos Estrada', order: 4, industry: 'Asesor de seguros (PPR)',
    funnel: 'Landing → cita en Calendly', platforms: 'Meta', currency: 'MXN',
    cprLabel: 'Costo por cita', cprTarget: 0, budget: 0, notes: 'Meta por definir.',
    metrics: [{ key: 'citas', label: 'Citas agendadas', goal: 0, result: true }],
  },
  'clients/visas-sierra': {
    name: 'Visas Sierra', order: 5, industry: 'Trámite de visas',
    funnel: 'Anuncios → WhatsApp', platforms: 'Meta', currency: 'MXN',
    cprLabel: 'Costo por conversación', cprTarget: 0, budget: 0,
    notes: 'Llegan alrededor de 100 WhatsApps al día.',
    metrics: [
      { key: 'conversaciones', label: 'Conversaciones de WhatsApp', goal: 0, result: true },
      { key: 'cierres', label: 'Cierres', goal: 0 },
    ],
  },
  'clients/victory-tracks': {
    name: 'Victory Tracks', order: 6, industry: 'Reparación de pistas de atletismo (Texas, EE. UU.)',
    funnel: 'Landing con formulario', platforms: 'Meta', currency: 'USD',
    cprLabel: 'Costo por lead', cprTarget: 0, budget: 0,
    notes: 'Ciclo de cierre de 6 meses a 3 años: los cierres se dejan como seguimiento, sin meta mensual.',
    metrics: [
      { key: 'leads', label: 'Leads (formulario)', goal: 0, result: true },
      { key: 'cierres', label: 'Cierres', goal: 0 },
    ],
  },
  'clients/auditivos': {
    name: 'Auditivos de México', order: 7, industry: 'Aparatos auditivos',
    funnel: 'Anuncios → WhatsApp → cita', platforms: 'Meta', currency: 'MXN',
    cprLabel: 'Costo por conversación', cprTarget: 0, budget: 0, notes: '',
    metrics: [
      { key: 'conversaciones', label: 'Conversaciones de WhatsApp', goal: 0, result: true },
      { key: 'citas', label: 'Citas', goal: 0 },
      { key: 'cierres', label: 'Cierres', goal: 0 },
    ],
  },
  'config/schedule': {
    mon: ['goled'], tue: ['kordata'], wed: ['hastens'],
    thu: ['visas-sierra', 'auditivos'], fri: ['carlos-estrada', 'victory-tracks'],
  },
  'config/settings': { green: 90, orange: 70 },
};
