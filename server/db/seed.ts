/**
 * Carga inicial de datos (idempotente: se puede correr varias veces).
 * Rellena la base con el contenido que hoy vive hardcodeado en el sitio, para
 * que el cliente pueda editarlo desde el panel sin perder nada.
 *
 * Se usa desde dos lugares:
 *  - CLI local:   npm run db:seed  (server/db/seed-cli.ts)
 *  - Vercel:      GET /api/setup?token=...  (server/routes/setup.ts)
 *
 * El administrador se crea con ADMIN_EMAIL / ADMIN_PASSWORD del entorno (o los
 * valores por defecto de abajo, que conviene cambiar tras el primer login).
 */
import { db, schema } from './index.js'
import { hashPassword } from '../auth.js'

export async function runSeed() {
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

  /* ── Servicios ─────────────────────────────────────────────────────── */
  const services = [
    {
      slug: 'desratizacion',
      title: 'Desratización',
      kicker: 'Servicio',
      icon: 'rodent',
      summary:
        'Eliminación y control de ratas y ratones con estaciones certificadas, sellado de accesos y monitoreo posterior.',
      bodyMd:
        '## Control integral de roedores\n\nRealizamos una inspección en terreno para detectar accesos, madrigueras y rutas de desplazamiento. Instalamos **estaciones de cebo certificadas** en puntos estratégicos, sellamos ingresos y programamos visitas de monitoreo para asegurar el control en el tiempo.\n\n- Diagnóstico y plano de instalación\n- Estaciones a prueba de manipulación\n- Sellado de accesos\n- Informe y certificado del servicio',
    },
    {
      slug: 'desinsectacion',
      title: 'Desinsectación',
      kicker: 'Servicio',
      icon: 'insect',
      summary:
        'Control de cucarachas, hormigas, moscas y otros insectos con productos de bajo impacto para casa y negocio.',
      bodyMd:
        '## Adiós a las plagas de insectos\n\nAplicamos tratamientos focalizados según el tipo de insecto y el lugar, priorizando **productos de bajo impacto** para personas y mascotas. Combinamos aspersión, gel y barreras según corresponda.\n\n- Cucarachas, hormigas, moscas, pulgas y más\n- Productos autorizados por la autoridad sanitaria\n- Recomendaciones de prevención posteriores',
    },
    {
      slug: 'control-de-aves',
      title: 'Control de aves',
      kicker: 'Servicio',
      icon: 'bird',
      summary:
        'Disuasión, exclusión y captura de aves en fachadas, techos y patios, sin dañar la infraestructura.',
      bodyMd:
        '## Manejo responsable de aves\n\nInstalamos sistemas de **disuasión y exclusión** (púas, redes, tensados) que impiden que las aves aniden sin dañarlas ni afectar la fachada. Evaluamos cada estructura para elegir la solución adecuada.\n\n- Púas y redes anti-aves\n- Limpieza y desinfección de zonas afectadas\n- Soluciones discretas y duraderas',
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
        '## Programas para empresas\n\nDiseñamos un **programa de control de plagas a medida**, con visitas periódicas, registros y documentación lista para auditorías e inspecciones sanitarias (ISO 9001, HACCP, etc.).\n\n- Plan anual con visitas programadas\n- Registros y planos de estaciones\n- Documentación para auditorías\n- Respuesta ante emergencias',
    },
  ]
  for (const [i, s] of services.entries()) {
    await db
      .insert(schema.services)
      .values({ ...s, sortOrder: i, published: true })
      .onConflictDoNothing({ target: schema.services.slug })
  }
  console.log(`✓ servicios: ${services.length}`)

  /* ── Páginas ───────────────────────────────────────────────────────── */
  const pages = [
    {
      slug: 'nosotros',
      title: 'Nosotros',
      kicker: 'Quiénes somos',
      description:
        'Más de 20 años controlando plagas en la zona poniente de Santiago. Equipo certificado, trabajo con respaldo por escrito y respuesta el mismo día.',
      bodyMd:
        '## Más de 20 años cuidando hogares y empresas\n\nVetlain nació en Talagante con un objetivo simple: entregar control de plagas **serio, medible y con respaldo por escrito**. Hoy atendemos hogares, locales comerciales, bodegas y plantas en toda la zona poniente de Santiago.\n\n### Por qué nos eligen\n\n- **Certificación ISO 9001** y productos autorizados por la autoridad sanitaria.\n- **Respuesta el mismo día** y evaluación en terreno sin costo.\n- **Informe y certificado** de cada servicio realizado.\n- Equipo técnico capacitado y trato cercano.',
      seoTitle: 'Nosotros | Vetlain — Control de plagas en Talagante',
      seoDescription:
        'Más de 20 años en control de plagas en la zona poniente de Santiago. Equipo certificado ISO 9001, respuesta el mismo día y respaldo por escrito.',
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
        'Desratización, desinsectación, control de aves, desinfección y programas para empresas. Cobertura en Talagante y alrededores con certificación ISO 9001.',
      bodyMd:
        '## Nuestros servicios\n\nControlamos las principales plagas urbanas para hogares y empresas, con productos autorizados y respaldo por escrito. Revisa cada servicio para conocer el detalle, o escríbenos y te asesoramos según tu caso.',
      seoTitle: 'Servicios de control de plagas | Vetlain — Talagante',
      seoDescription:
        'Desratización, desinsectación, control de aves, desinfección y programas para empresas con certificación ISO 9001 en Talagante y alrededores.',
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
    await db.insert(schema.pages).values(p).onConflictDoNothing({ target: schema.pages.slug })
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
  console.log('\nSeed completado ✅')

  return {
    admin: adminEmail,
    content: content.length,
    services: services.length,
    pages: pages.length,
    blog: 1,
  }
}
