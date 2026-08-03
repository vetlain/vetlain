/**
 * Carga inicial de datos (idempotente: se puede correr varias veces).
 * Rellena la base con el contenido que hoy vive hardcodeado en el sitio, para
 * que el cliente pueda editarlo desde el panel sin perder nada.
 *
 * Se usa desde dos lugares:
 *  - CLI local:   npm run db:seed  (server/db/seed-cli.ts)
 *  - Vercel:      GET /api/setup?token=...  (server/routes/setup.ts)
 *
 * Modo `overwrite`: por defecto el seed sólo INSERTA lo que falta y nunca pisa
 * lo que el cliente haya editado desde el panel. Con `overwrite: true`
 * (`npm run db:seed:force`, o `?overwrite=1` en /api/setup) además re-sincroniza
 * servicios, páginas y productos con el texto de este archivo — útil cuando se
 * incorpora contenido nuevo desde el sitio antiguo, pero descarta ediciones del
 * panel en esas tablas.
 *
 * El administrador se crea con ADMIN_EMAIL / ADMIN_PASSWORD del entorno (o los
 * valores por defecto de abajo, que conviene cambiar tras el primer login).
 */
import { db, schema } from './index.js'
import { hashPassword } from '../auth.js'
import { productsSeed } from './seed-products.js'
// Los textos de la portada viven junto al sitio (una sola fuente de verdad):
// el mismo objeto que usa el front como respaldo es el que se siembra aquí.
import { DEFAULT_HOME, HOME_BLOCKS, homeKey } from '../../src/lib/home-content.js'

export async function runSeed({ overwrite = false }: { overwrite?: boolean } = {}) {
  /* ── Administrador ─────────────────────────────────────────────────── */
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vetlain.cl'
  const adminPassword = process.env.ADMIN_PASSWORD || 'vetlain2026'
  const passwordHash = await hashPassword(adminPassword)
  await db
    .insert(schema.adminUsers)
    .values({ email: adminEmail, passwordHash, name: 'Administrador Vetlain' })
    .onConflictDoNothing({ target: schema.adminUsers.email })
  console.log(`✓ admin: ${adminEmail}`)

  /* ── Contenido suelto ──────────────────────────────────────────────── */
  const content: { key: string; value: unknown; label: string; group: string }[] = [
    { key: 'contact.phone', value: '+56 9 6830 2857', label: 'Teléfono visible', group: 'contacto' },
    { key: 'contact.phone_fijo', value: '+56 2 2815 3975', label: 'Teléfono fijo', group: 'contacto' },
    { key: 'contact.whatsapp', value: '56968302857', label: 'WhatsApp (solo números)', group: 'contacto' },
    { key: 'contact.email', value: 'vetlain@vetlain.cl', label: 'Email', group: 'contacto' },
    { key: 'contact.address', value: 'Juana Canales 987, Talagante', label: 'Dirección', group: 'contacto' },
    { key: 'contact.hours', value: 'Lun a Vie · 09:00 – 18:00', label: 'Horario de atención', group: 'contacto' },
    { key: 'social.facebook', value: '', label: 'Facebook (URL del perfil)', group: 'redes' },
    { key: 'social.instagram', value: '', label: 'Instagram (URL del perfil)', group: 'redes' },
    { key: 'social.linkedin', value: '', label: 'LinkedIn (URL del perfil)', group: 'redes' },
    { key: 'social.youtube', value: '', label: 'YouTube (URL del canal)', group: 'redes' },
  ]
  for (const row of content) {
    await db.insert(schema.siteContent).values(row).onConflictDoNothing({ target: schema.siteContent.key })
  }
  console.log(`✓ contenido suelto: ${content.length} claves`)

  /* ── Portada (bloques editables) ───────────────────────────────────── */
  // Un registro por bloque (home.hero, home.services…), con el objeto completo
  // como valor. Con `overwrite` se restauran los textos originales del código.
  const homeLabels: Record<string, string> = {
    seo: 'Portada · Título y descripción en Google',
    hero: 'Portada · Encabezado principal',
    trust: 'Portada · Cinta de garantías',
    novedades: 'Portada · Novedades (encabezado)',
    services: 'Portada · Qué eliminamos',
    steps: 'Portada · Cómo trabajamos',
    urgency: 'Portada · Franja de urgencia',
    contact: 'Portada · Contacto',
  }
  for (const block of HOME_BLOCKS) {
    const values = {
      key: homeKey(block),
      value: DEFAULT_HOME[block],
      label: homeLabels[block],
      group: 'home',
    }
    const insert = db.insert(schema.siteContent).values(values)
    await (overwrite
      ? insert.onConflictDoUpdate({
          target: schema.siteContent.key,
          set: { value: values.value, label: values.label, group: values.group, updatedAt: new Date() },
        })
      : insert.onConflictDoNothing({ target: schema.siteContent.key }))
  }
  console.log(`✓ portada: ${HOME_BLOCKS.length} bloques`)

  /* ── Servicios ─────────────────────────────────────────────────────── */
  type ServiceSeed = {
    slug: string
    title: string
    kicker: string
    icon: string
    summary: string
    bodyMd: string
    seoTitle?: string
    seoDescription?: string
  }
  const services: ServiceSeed[] = [
    {
      slug: 'desratizacion',
      title: 'Desratización',
      kicker: 'Servicio',
      icon: 'rodent',
      summary:
        'Eliminación y control de ratas y ratones con estaciones certificadas, sellado de accesos y monitoreo posterior.',
      bodyMd:
        '## Control de Roedores\n\nAlgunas especies de roedores están altamente adaptadas al medio urbano y poseen altas capacidades de colonizar nuestros ambientes, siendo un riesgo para la Salud Pública al ser un transmisor de muchas enfermedades. En caso de detectar o necesitar un plan de gestión de plagas contra roedores en AMBIENTE CERO, nos basaremos en el empleo de sistemas preventivos como modificación del medio y sistemas de control directo, es decir, utilizaremos tanto controles físico-mecánicos como otros químicos.\n\n### Cómo trabajamos\n\nRealizamos una inspección en terreno para detectar accesos, madrigueras y rutas de desplazamiento. Instalamos **estaciones de cebo certificadas** en puntos estratégicos, sellamos ingresos y programamos visitas de monitoreo para asegurar el control en el tiempo.\n\n- Diagnóstico y plano de instalación\n- Estaciones a prueba de manipulación\n- Sellado de accesos\n- Informe y certificado del servicio\n\n[Ver los productos que usamos para el control de roedores →](/productos#roedores)',
    },
    {
      slug: 'desinsectacion',
      title: 'Desinsectación',
      kicker: 'Servicio',
      icon: 'insect',
      summary:
        'Control de cucarachas, hormigas, moscas y otros insectos con productos de bajo impacto para casa y negocio.',
      bodyMd:
        '## Control de Insectos\n\nLas plagas urbanas son aquellas especies implicadas en la transferencia de enfermedades infecciosas para el hombre y en el daño o deterioro de nuestro hábitat. Por esto, se ha sentido la necesidad de eliminar, o al menos controlar, las plagas de insectos a fin de disminuir el daño que causan desde épocas remotas.\n\nCon el fin de minimizar estos problemas en ambientes interiores, se vienen desarrollando acciones de control de plagas como son la Desinsectación y Desinfección. Priorizamos la implementación de medidas preventivas, limitando el uso de productos químicos sólo en los casos en los que las medidas naturales sean insuficientes. Así disminuye el riesgo para la salud pública y el impacto medioambiental que lleva asociados el uso de productos químicos.\n\n### Cómo trabajamos\n\nAplicamos tratamientos focalizados según el tipo de insecto y el lugar, priorizando **productos de bajo impacto** para personas y mascotas. Combinamos aspersión, gel y barreras según corresponda.\n\n- Cucarachas, hormigas, moscas, pulgas y más\n- Productos autorizados por la autoridad sanitaria\n- Recomendaciones de prevención posteriores\n\n[Ver los productos que usamos para el control de insectos →](/productos#insectos)',
    },
    {
      slug: 'control-de-aves',
      title: 'Control de aves',
      kicker: 'Servicio',
      icon: 'bird',
      summary:
        'Disuasión, exclusión y captura de aves en fachadas, techos y patios, sin dañar la infraestructura.',
      bodyMd:
        '## Control de Aves\n\nLas aves urbanas pueden causar importantes problemas de salud. Enfermedades producidas por la contaminación con sus heces a los alimentos y propagan plagas de ácaros e insectos. Por ello es que en situaciones urbanas pueden causar numerosos problemas en la infraestructura, especialmente en edificios, llegando a constituirse en plagas. Por todo esto, muchas veces es necesario proteger estos edificios e inclusive llevar a cabo medidas de reducción de la población de las aves.\n\nEl control de aves es un tema complejo y especializado ya que son animales móviles, adaptables y persistentes, por lo tanto, difíciles de controlar. Si no se emplean los métodos adecuados para cada situación tal como lo hacemos nosotros, puede salir más costoso.\n\n### Cómo trabajamos\n\nInstalamos sistemas de **disuasión y exclusión** (púas, redes, tensados) que impiden que las aves aniden sin dañarlas ni afectar la fachada. Evaluamos cada estructura para elegir la solución adecuada.\n\n- Púas y redes anti-aves\n- Limpieza y desinfección de zonas afectadas\n- Soluciones discretas y duraderas\n\n[Ver los productos que usamos para el control de aves →](/productos#aves)',
    },
    {
      slug: 'desinfeccion',
      title: 'Desinfección y sanitización',
      kicker: 'Servicio',
      icon: 'spray',
      summary:
        'Sanitización de superficies y ambientes de trabajo con protocolo certificado y productos autorizados.',
      bodyMd:
        '## Ambientes limpios y seguros\n\nSanitizamos superficies y ambientes con **protocolo certificado**, ideal para oficinas, locales y espacios de atención de público. Entregamos certificado del servicio realizado.\n\n- Nebulización y aspersión de superficies\n- Productos autorizados\n- Certificado de sanitización',
    },
    {
      slug: 'empresas',
      title: 'Empresas y bodegas',
      kicker: 'Servicio',
      icon: 'building',
      summary:
        'Programas de control de plagas a medida bajo norma sanitaria para plantas, bodegas y locales comerciales.',
      bodyMd:
        '## Programas para empresas\n\nDiseñamos un **programa de control de plagas a medida**, con visitas periódicas, registros y documentación lista para auditorías e inspecciones sanitarias (ISO 9001, HACCP, etc.).\n\n- Plan anual con visitas programadas\n- Registros y planos de estaciones\n- Documentación para auditorías\n- Respuesta ante emergencias\n\n### Dónde aplicamos el servicio\n\n- Espacios Comunes\n- Bodegas\n- Oficinas\n- Control Externo de Plagas\n- Plantas Alimentarias\n- Casinos',
    },
    {
      slug: 'capacitaciones',
      title: 'Capacitaciones',
      kicker: 'Servicio',
      icon: 'training',
      summary:
        'Formamos a tu equipo en identificación temprana de plagas, prevención y medidas de control preventivas y correctivas.',
      bodyMd:
        '## Capacitaciones\n\nLos beneficios de capacitar a los clientes en el manejo y control de plagas incluyen:\n\n- **Maneras de conocer y manejar las plagas de forma temprana.** Para ello los capacitamos en identificar las diferentes plagas que pueden encontrar en su propiedad o tipo de negocio.\n- **Medidas para prevenir la propagación de enfermedades y lesiones de los colaboradores.** Cuáles son las condiciones que atraen a las plagas tales como la suciedad, la humedad y los alimentos.\n- **Definición de medidas que protejan sus espacios de las plagas.** Para ello, les presentamos métodos de control de plagas, tanto preventivos como correctivos.',
      seoTitle: 'Capacitaciones en manejo y control de plagas | Vetlain',
      seoDescription:
        'Capacitamos a tu equipo en identificación temprana de plagas, prevención de enfermedades y medidas de control preventivas y correctivas.',
    },
  ]
  for (const [i, s] of services.entries()) {
    const values = { ...s, sortOrder: i, published: true }
    const insert = db.insert(schema.services).values(values)
    await (overwrite
      ? insert.onConflictDoUpdate({
          target: schema.services.slug,
          set: { ...values, updatedAt: new Date() },
        })
      : insert.onConflictDoNothing({ target: schema.services.slug }))
  }
  console.log(`✓ servicios: ${services.length}`)

  /* ── Productos ─────────────────────────────────────────────────────── */
  for (const [i, p] of productsSeed.entries()) {
    const values = { ...p, sortOrder: i, published: true }
    const insert = db.insert(schema.products).values(values)
    await (overwrite
      ? insert.onConflictDoUpdate({
          target: schema.products.slug,
          set: { ...values, updatedAt: new Date() },
        })
      : insert.onConflictDoNothing({ target: schema.products.slug }))
  }
  console.log(`✓ productos: ${productsSeed.length}`)

  /* ── Páginas ───────────────────────────────────────────────────────── */
  const pages = [
    {
      slug: 'nosotros',
      title: 'Nosotros',
      kicker: 'Quiénes somos',
      description:
        'Más de 20 años controlando plagas en la zona poniente de Santiago. Equipo certificado, trabajo con respaldo por escrito y respuesta el mismo día.',
      bodyMd: [
        '## Más de 20 años cuidando hogares y empresas',
        '',
        'Vetlain nació en Talagante con un objetivo simple: entregar control de plagas **serio, medible y con respaldo por escrito**. Empezamos atendiendo casas y almacenes del centro de la comuna, y con los años fuimos sumando comunidades, locales comerciales, bodegas y plantas alimentarias de toda la zona poniente de Santiago.',
        '',
        'Lo que no cambió en todo ese tiempo es la forma de trabajar: llegar rápido, mirar antes de aplicar, explicar qué encontramos y dejar por escrito lo que hicimos. Una plaga rara vez es sólo el bicho que se ve; casi siempre hay una condición detrás —una filtración, un acceso mal sellado, una rutina de basura— y ahí es donde ponemos el foco.',
        '',
        // Ojo: misión, visión y objetivo NO van aquí. Se muestran antes de este
        // cuerpo como bloque estático (AboutPillars, en src/pages/site/parts.tsx).
        '## Nuestros valores',
        '',
        '- **Rigor técnico.** Cada visita parte por un diagnóstico, no por un producto. Aplicamos lo que corresponde, en la dosis que corresponde.',
        '- **Seguridad primero.** Priorizamos productos y métodos de bajo impacto para personas, mascotas y alimentos, y te explicamos siempre los tiempos de reingreso.',
        '- **Transparencia.** Cotización clara antes de empezar, sin costos sorpresa, e informe de lo realizado al terminar.',
        '- **Compromiso ambiental.** Preferimos el control físico y preventivo antes que el químico, y trabajamos con equipos ecocompatibles cuando el caso lo permite.',
        '- **Cercanía.** Somos de Talagante. Contestamos el teléfono y volvemos si algo no quedó resuelto.',
        '',
        '## Cómo trabajamos',
        '',
        '1. **Escuchamos.** Nos cuentas qué viste, dónde y desde cuándo. Con eso ya sabemos qué ir a buscar.',
        '2. **Inspeccionamos en terreno.** Sin costo. Identificamos la especie, el foco y las condiciones que la favorecen.',
        '3. **Proponemos un plan.** Te explicamos el tratamiento, los plazos y el precio antes de aplicar nada.',
        '4. **Ejecutamos y documentamos.** Aplicamos el tratamiento y entregamos informe y certificado del servicio.',
        '5. **Hacemos seguimiento.** Monitoreamos el resultado y, si corresponde, dejamos un programa de visitas periódicas.',
        '',
        '## Respaldo y certificación',
        '',
        'Trabajamos bajo las normas de la **ISO 9001:2015**, que nos obliga a operar de forma ordenada y sistemática: procedimientos escritos, registros de cada visita y trazabilidad de los productos utilizados. Todos los formulados que aplicamos cuentan con **autorización sanitaria vigente**, y nuestros técnicos reciben capacitación continua en manejo seguro y en las plagas propias de cada rubro.',
        '',
        'Para nuestros clientes empresa esto se traduce en algo concreto: la carpeta de documentación que piden las auditorías e inspecciones ya está lista, con planos de estaciones, fichas técnicas y registros al día.',
        '',
        '## Por qué nos eligen',
        '',
        '- **Certificación ISO 9001** y productos autorizados por la autoridad sanitaria.',
        '- **Respuesta el mismo día** y evaluación en terreno sin costo.',
        '- **Informe y certificado** de cada servicio realizado.',
        '- **Programas a medida** para plantas alimentarias, bodegas, oficinas, casinos y espacios comunes.',
        '- Equipo técnico capacitado, uniformado y con trato cercano.',
        '',
        '> Nuestro negocio es mantener el suyo **¡sin plagas!**',
      ].join('\n'),
      seoTitle: 'Nosotros | Vetlain — Control de plagas en Talagante',
      seoDescription:
        'Más de 20 años en control de plagas en la zona poniente de Santiago. Conoce nuestra misión, visión, valores y forma de trabajo. Certificación ISO 9001.',
    },
    {
      slug: 'cobertura',
      title: 'Zonas de cobertura',
      kicker: 'Dónde trabajamos',
      description:
        'Talagante, Peñaflor, El Monte, Isla de Maipo, Padre Hurtado y comunas vecinas. Consulta por tu sector y te confirmamos disponibilidad el mismo día.',
      bodyMd:
        '## Cobertura en la zona poniente de Santiago\n\nTrabajamos en **Talagante y comunas vecinas**. Si tu sector no aparece en la lista, escríbenos igual: probablemente también llegamos.\n\n- Talagante\n- Peñaflor\n- El Monte\n- Isla de Maipo\n- Padre Hurtado\n- Calera de Tango\n- Buin y alrededores\n\n¿No estás seguro? Consulta por tu dirección y te confirmamos disponibilidad el mismo día.',
      seoTitle: 'Zonas de cobertura | Vetlain — Talagante y alrededores',
      seoDescription:
        'Control de plagas en Talagante, Peñaflor, El Monte, Isla de Maipo, Padre Hurtado y comunas vecinas. Confirmación de disponibilidad el mismo día.',
    },
    {
      slug: 'preguntas-frecuentes',
      title: 'Preguntas frecuentes',
      kicker: 'Resolvemos tus dudas',
      description:
        '¿Es seguro para mascotas y niños? ¿Cuánto demora el tratamiento? ¿Entregan certificado? Aquí respondemos lo más consultado.',
      bodyMd:
        '## Preguntas frecuentes\n\n### ¿Es seguro para mascotas y niños?\nSí. Usamos productos autorizados y aplicamos en dosis y ubicaciones seguras. Te indicamos los tiempos de reingreso recomendados según el tratamiento.\n\n### ¿Cuánto demora el tratamiento?\nLa mayoría de los servicios domiciliarios se realizan en una visita de 1 a 2 horas, según el tamaño del lugar y la plaga.\n\n### ¿Entregan certificado?\nSí, entregamos informe y certificado del servicio, útil para inspecciones y auditorías.\n\n### ¿Cada cuánto conviene repetir?\nDepende del caso; para empresas recomendamos un programa con visitas periódicas. Te asesoramos según tu situación.',
      seoTitle: 'Preguntas frecuentes | Vetlain — Control de plagas',
      seoDescription:
        '¿Es seguro para mascotas y niños? ¿Cuánto demora? ¿Entregan certificado? Respondemos las dudas más comunes sobre el control de plagas.',
    },
    {
      slug: 'servicios',
      title: 'Servicios',
      kicker: 'Control de plagas',
      description:
        'Somos una empresa de control y manejo integral de plagas, comprometida con las necesidades, requerimientos ambientales e higiene de nuestros clientes.',
      bodyMd:
        '## Servicio de mantención de ambientes libres de plagas\n\nVelamos por un servicio de excelencia, con atención personalizada y especializada, que responde a cada necesidad que tenga entre nuestros servicios.\n\n**Nuestro negocio es mantener el suyo ¡sin plagas!**',
      seoTitle: 'Servicios de control de plagas | Vetlain — Talagante',
      seoDescription:
        'Desratización, desinsectación, control de aves, capacitaciones y programas para empresas con certificación ISO 9001 en Talagante y alrededores.',
    },
    {
      slug: 'productos',
      title: 'Productos',
      kicker: 'Catálogo',
      description:
        'Equipos y dispositivos que usamos en terreno para el control de roedores, insectos y aves: trampas ecológicas, estaciones de control, lámparas UV, atrayentes y sistemas anti-aves.',
      bodyMd:
        '## Nuestro catálogo\n\nTrabajamos con equipos y dispositivos de marcas especializadas, priorizando siempre la seguridad del entorno: soluciones sin veneno, sin dispersión de cadáveres y aptas para plantas alimentarias, bodegas, oficinas y espacios de atención de público.\n\n¿Necesitas alguno de estos productos o quieres saber cuál se adapta a tu caso? Escríbenos y te asesoramos sin costo.',
      seoTitle: 'Productos para el control de plagas | Vetlain',
      seoDescription:
        'Catálogo Vetlain: Ekomille, Ekologic, EVO, Snap Trap, Nara Lure, Vastrap, Mouse Shield, Tunap, lámparas UV, Blatrap, XLure MST, trampa rotatoria e INOX 80/25.',
    },
    {
      slug: 'contacto',
      title: 'Contacto',
      kicker: 'Hablemos',
      description:
        'Escríbenos por WhatsApp o llámanos. Evaluación en terreno sin costo y cotización el mismo día.',
      bodyMd:
        '## Hablemos\n\nEscríbenos por WhatsApp o llámanos: te respondemos el mismo día, coordinamos una **evaluación en terreno sin costo** y te entregamos una cotización clara.\n\n- **Teléfono / WhatsApp:** +56 9 6830 2857\n- **Email:** vetlain@vetlain.cl\n- **Dirección:** Juana Canales 987, Talagante\n- **Horario:** Lun a Vie · 09:00 – 18:00',
      seoTitle: 'Contacto | Vetlain — Control de plagas en Talagante',
      seoDescription:
        'Contáctanos por WhatsApp o teléfono. Evaluación en terreno sin costo y cotización el mismo día en Talagante y comunas vecinas.',
    },
  ]
  for (const p of pages) {
    const insert = db.insert(schema.pages).values(p)
    await (overwrite
      ? insert.onConflictDoUpdate({ target: schema.pages.slug, set: { ...p, updatedAt: new Date() } })
      : insert.onConflictDoNothing({ target: schema.pages.slug }))
  }
  console.log(`✓ páginas: ${pages.length}`)

  /* ── Entrada de blog de ejemplo ────────────────────────────────────── */
  await db
    .insert(schema.blogPosts)
    .values({
      slug: 'como-prevenir-ratones-en-casa',
      title: 'Cómo prevenir ratones en casa: 7 señales de alerta',
      excerpt:
        'Detectar una plaga a tiempo ahorra dolores de cabeza. Estas son las señales tempranas y qué hacer ante cada una.',
      coverImage: null,
      status: 'published',
      publishedAt: new Date(),
      bodyMd:
        '## Detectar a tiempo lo cambia todo\n\nLos roedores buscan **refugio, comida y agua**. Cuanto antes detectes su presencia, más fácil y económico es controlarla. Estas son las señales más comunes:\n\n1. **Excrementos** pequeños y oscuros cerca de alimentos o rincones.\n2. **Ruidos** nocturnos en cielos o entretechos.\n3. **Marcas de roeduras** en envases, cables o madera.\n4. **Olor** persistente y penetrante.\n5. **Huellas o marcas de grasa** a lo largo de muros.\n6. **Nidos** con papel o tela triturada.\n7. **Mascotas inquietas** mirando fijo a un rincón.\n\n### Qué puedes hacer hoy\n\n- Guarda alimentos en envases herméticos.\n- Sella grietas y accesos bajo puertas.\n- Elimina fuentes de agua y desorden acumulado.\n\nSi ya notaste varias de estas señales, lo mejor es una evaluación profesional. En Vetlain la hacemos **sin costo** y te entregamos un plan claro.',
      seoTitle: 'Cómo prevenir ratones en casa: 7 señales de alerta | Vetlain',
      seoDescription:
        '7 señales tempranas de una plaga de ratones y qué hacer ante cada una. Guía práctica de prevención para tu hogar por Vetlain.',
    })
    .onConflictDoNothing({ target: schema.blogPosts.slug })
  console.log('✓ blog: 1 entrada de ejemplo')

  /* ── Novedades de la portada ───────────────────────────────────────── */
  // No tienen slug ni ninguna otra clave única, así que la idempotencia se
  // resuelve por presencia: si ya hay novedades, no se toca nada (ni siquiera
  // con `overwrite`; son contenido del cliente, no textos del código).
  const [algunaNovedad] = await db.select({ id: schema.news.id }).from(schema.news).limit(1)
  let novedades = 0
  if (!algunaNovedad) {
    const hoy = new Date()
    const diasAtras = (d: number) =>
      new Date(hoy.getTime() - d * 86_400_000).toISOString().slice(0, 10)
    const ejemplos = [
      {
        title: 'Campaña de temporada: control preventivo de moscas',
        excerpt:
          'Con el calor aumentan las moscas en cocinas y patios de comida. Estamos agendando visitas preventivas con tarifa de temporada.',
        image: 'brand/foto-desinsectacion.jpg',
        link: '/servicios/desinsectacion',
        linkLabel: 'Ver el servicio',
        date: diasAtras(3),
        sortOrder: 0,
      },
      {
        title: 'Renovamos nuestra certificación ISO 9001',
        excerpt:
          'Aprobamos la auditoría anual: seguimos trabajando con procedimientos escritos, registros de cada visita y trazabilidad de los productos.',
        image: 'brand/iso-9001.png',
        link: '/nosotros',
        linkLabel: 'Conocer más',
        date: diasAtras(20),
        sortOrder: 1,
      },
      {
        title: 'Nuevas trampas ecológicas sin veneno',
        excerpt:
          'Sumamos equipos de captura para roedores aptos para plantas alimentarias: sin cebos tóxicos y sin dispersión de cadáveres.',
        image: 'brand/productos/ekomille.png',
        link: '/productos',
        linkLabel: 'Ver el catálogo',
        date: diasAtras(45),
        sortOrder: 2,
      },
    ]
    await db.insert(schema.news).values(ejemplos.map((n) => ({ ...n, published: true })))
    novedades = ejemplos.length
  }
  console.log(`✓ novedades: ${novedades || 'ya había, no se tocaron'}`)
  console.log('\nSeed completado ✅')

  return {
    admin: adminEmail,
    modo: overwrite ? 'overwrite (re-sincroniza servicios, páginas, productos y portada)' : 'solo inserta lo que falta',
    content: content.length,
    home: HOME_BLOCKS.length,
    services: services.length,
    products: productsSeed.length,
    pages: pages.length,
    blog: 1,
    novedades,
  }
}
