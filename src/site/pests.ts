/**
 * Pestología: fichas de las plagas que combate Vetlain. Alimentan el
 * desplegable "Pestología" del header, la página /pestologia y cada ficha
 * /pestologia/:slug (prerenderizadas para SEO). Contenido fijo en código por
 * ahora; si el cliente necesita editarlo, se puede pasar a una tabla del panel.
 */

export type Pest = {
  slug: string
  /** Nombre corto (desplegable del nav, tarjetas, migas). */
  name: string
  /** Icono de service-icons.tsx. */
  icon: 'rodent' | 'insect' | 'bird'
  summary: string
  intro: string
  species: { name: string; sci: string; note: string }[]
  signs: string[]
  risks: string[]
  prevention: string[]
  /** Servicio de Vetlain que resuelve esta plaga. */
  service: { label: string; to: string }
  seoTitle: string
  seoDescription: string
}

export const pests: Pest[] = [
  {
    slug: 'roedores',
    name: 'Roedores',
    icon: 'rodent',
    summary: 'Ratas y ratones: la plaga urbana más dañina para la salud y la infraestructura.',
    intro:
      'Los roedores urbanos están altamente adaptados a convivir con las personas: se reproducen rápido, aprenden a evitar trampas mal ubicadas y aprovechan cualquier acceso de pocos centímetros. Una pareja de ratas puede originar decenas de crías en un año, por eso el control debe combinar eliminación, sellado de accesos y monitoreo.',
    species: [
      { name: 'Rata noruega o de alcantarilla', sci: 'Rattus norvegicus', note: 'Grande y robusta. Vive en alcantarillas, patios y bodegas; cava madrigueras a nivel de suelo.' },
      { name: 'Rata de techo o negra', sci: 'Rattus rattus', note: 'Ágil trepadora. Se mueve por entretechos, cables y árboles.' },
      { name: 'Ratón doméstico', sci: 'Mus musculus', note: 'Pequeño y curioso. Entra por orificios de 6 mm y anida dentro de muebles y muros.' },
    ],
    signs: [
      'Fecas oscuras en rincones, despensas o junto a muros',
      'Roeduras en envases, cables, maderas o puertas',
      'Manchas de grasa en zócalos y rutas de paso',
      'Ruidos de rasguños en entretechos durante la noche',
      'Madrigueras o tierra removida en patios y jardines',
    ],
    risks: [
      'Transmiten enfermedades como leptospirosis y salmonelosis',
      'Contaminan alimentos y superficies con orina y fecas',
      'Roen cables eléctricos: riesgo real de cortocircuito e incendio',
      'En zonas rurales, el ratón colilargo transmite el hantavirus',
    ],
    prevention: [
      'Guardar alimentos y basura en recipientes cerrados',
      'Sellar orificios, rejillas y pasadas de cañerías',
      'Mantener patios sin escombros, leña apilada ni maleza alta',
      'Podar ramas que toquen techos o muros',
    ],
    service: { label: 'Desratización', to: '/servicios/desratizacion' },
    seoTitle: 'Roedores: ratas y ratones | Pestología Vetlain',
    seoDescription:
      'Cómo reconocer ratas y ratones, qué riesgos implican y cómo prevenirlos. Desratización certificada en Talagante y alrededores.',
  },
  {
    slug: 'cucarachas',
    name: 'Cucarachas',
    icon: 'insect',
    summary: 'Insectos nocturnos que contaminan alimentos y se multiplican en cocinas y baños.',
    intro:
      'Las cucarachas buscan calor, humedad y restos de comida. Pasan el día escondidas en grietas, motores de electrodomésticos y cañerías, y salen de noche. Verlas de día suele indicar una población grande: los refugios ya no alcanzan.',
    species: [
      { name: 'Cucaracha alemana', sci: 'Blattella germanica', note: 'Pequeña y café claro. La más común en cocinas, restaurantes y locales de alimentos.' },
      { name: 'Cucaracha americana', sci: 'Periplaneta americana', note: 'Grande y rojiza. Frecuente en alcantarillas, subterráneos y cámaras.' },
      { name: 'Cucaracha oriental', sci: 'Blatta orientalis', note: 'Oscura y lenta. Prefiere zonas frías y húmedas como desagües y sótanos.' },
    ],
    signs: [
      'Fecas como granos de pimienta en cajones y repisas',
      'Ootecas (cápsulas de huevos) detrás de muebles',
      'Olor rancio y persistente en espacios cerrados',
      'Insectos vivos o muertos cerca de desagües y electrodomésticos',
    ],
    risks: [
      'Trasladan bacterias desde desagües hasta los alimentos',
      'Sus restos y fecas desencadenan alergias y crisis de asma',
      'En locales de alimentos, son causal de sumario sanitario',
    ],
    prevention: [
      'No dejar loza sucia ni restos de comida durante la noche',
      'Reparar filtraciones y secar zonas húmedas',
      'Sellar grietas en muros, zócalos y muebles de cocina',
      'Revisar cajas y envases que ingresan desde bodegas',
    ],
    service: { label: 'Desinsectación', to: '/servicios/desinsectacion' },
    seoTitle: 'Cucarachas: tipos y cómo eliminarlas | Pestología Vetlain',
    seoDescription:
      'Cucaracha alemana, americana y oriental: señales de infestación, riesgos y prevención. Desinsectación con productos de bajo impacto.',
  },
  {
    slug: 'hormigas',
    name: 'Hormigas',
    icon: 'insect',
    summary: 'Colonias que forman senderos hacia la comida y reaparecen si no se trata el nido.',
    intro:
      'Lo que vemos es sólo una fracción de la colonia: obreras que buscan alimento y marcan el camino con feromonas. Rociar los senderos las dispersa, pero el nido sigue activo. El control efectivo apunta a la colonia completa, incluidas las reinas.',
    species: [
      { name: 'Hormiga argentina', sci: 'Linepithema humile', note: 'Pequeña y café. Forma supercolonias con muchas reinas; es la más común en la zona central de Chile.' },
      { name: 'Hormiga negra de jardín', sci: 'Lasius niger', note: 'Anida en tierra y bajo pavimentos; entra a las casas buscando azúcares.' },
    ],
    signs: [
      'Senderos de hormigas en muros, mesones o marcos de ventanas',
      'Pequeños montículos de tierra en junturas de pisos y patios',
      'Hormigas en azucareros, frutas o comida de mascotas',
    ],
    risks: [
      'Contaminan alimentos y superficies de preparación',
      'Pueden invadir tableros y equipos eléctricos',
      'Protegen a pulgones y conchuelas que dañan plantas y huertos',
    ],
    prevention: [
      'Limpiar derrames de azúcar y bebidas de inmediato',
      'Guardar alimentos en envases herméticos',
      'Mantener la comida de mascotas sólo a la hora de comer',
      'Sellar grietas por donde ingresan los senderos',
    ],
    service: { label: 'Desinsectación', to: '/servicios/desinsectacion' },
    seoTitle: 'Hormigas en casa: cómo controlarlas | Pestología Vetlain',
    seoDescription:
      'Por qué vuelven las hormigas, cómo reconocer la hormiga argentina y cómo controlar la colonia completa. Desinsectación en Talagante.',
  },
  {
    slug: 'moscas-y-mosquitos',
    name: 'Moscas y mosquitos',
    icon: 'insect',
    summary: 'Insectos voladores que trasladan bacterias y se crían en basura y aguas estancadas.',
    intro:
      'Las moscas se crían en materia orgánica en descomposición y los mosquitos en cualquier acumulación de agua quieta. En pocos días completan su ciclo, por eso el control combina eliminar los focos de crianza con barreras y equipos de captura en los recintos.',
    species: [
      { name: 'Mosca doméstica', sci: 'Musca domestica', note: 'Se posa en basura y luego en alimentos. Muy activa en verano y en recintos con residuos orgánicos.' },
      { name: 'Mosquito común', sci: 'Culex pipiens', note: 'Se cría en sumideros, canaletas y recipientes con agua. Pica de noche.' },
      { name: 'Mosca de la fruta', sci: 'Drosophila melanogaster', note: 'Diminuta. Aparece en fruterías, bodegas de vino y junto a desagües.' },
    ],
    signs: [
      'Presencia constante de moscas alrededor de basureros',
      'Larvas en contenedores de residuos o desagües',
      'Picaduras nocturnas y zumbidos en dormitorios',
      'Agua estancada en canaletas, maceteros o neumáticos',
    ],
    risks: [
      'Trasladan bacterias como Salmonella y E. coli a los alimentos',
      'Las picaduras de mosquito causan reacciones e infecciones en la piel',
      'En la industria alimentaria, comprometen auditorías y certificaciones',
    ],
    prevention: [
      'Retirar la basura a diario y lavar los contenedores',
      'Vaciar recipientes, maceteros y canaletas con agua acumulada',
      'Instalar mallas en ventanas y cortinas en accesos',
      'Usar lámparas UV de captura en zonas de alimentos',
    ],
    service: { label: 'Desinsectación', to: '/servicios/desinsectacion' },
    seoTitle: 'Moscas y mosquitos: control y prevención | Pestología Vetlain',
    seoDescription:
      'Dónde se crían moscas y mosquitos, qué riesgos sanitarios implican y cómo controlarlos en casas, locales e industria alimentaria.',
  },
  {
    slug: 'pulgas',
    name: 'Pulgas',
    icon: 'insect',
    summary: 'Parásitos que viven en mascotas y alfombras; sus huevos pueden esperar meses.',
    intro:
      'La pulga adulta vive sobre el animal, pero la mayor parte de la población (huevos, larvas y pupas) está en alfombras, camas de mascotas y grietas del piso. Por eso tratar sólo a la mascota no basta: hay que tratar también el ambiente.',
    species: [
      { name: 'Pulga del gato', sci: 'Ctenocephalides felis', note: 'La más común en perros y gatos; también pica a personas.' },
      { name: 'Pulga humana', sci: 'Pulex irritans', note: 'Menos frecuente; se asocia a viviendas con poca ventilación y animales de corral.' },
    ],
    signs: [
      'Mascotas que se rascan o muerden de forma insistente',
      'Picaduras en tobillos y piernas, a menudo en grupos de tres',
      'Puntos negros (fecas) en la cama de la mascota',
    ],
    risks: [
      'Picaduras que causan picazón, alergias y dermatitis',
      'Transmiten parásitos intestinales a las mascotas',
      'Infestaciones que reaparecen al eclosionar nuevas pupas',
    ],
    prevention: [
      'Mantener a las mascotas con antiparasitario al día',
      'Aspirar alfombras y sillones con frecuencia',
      'Lavar a alta temperatura las camas de las mascotas',
    ],
    service: { label: 'Desinsectación', to: '/servicios/desinsectacion' },
    seoTitle: 'Pulgas en casa: cómo eliminarlas | Pestología Vetlain',
    seoDescription:
      'Por qué las pulgas vuelven aunque trates a tu mascota y cómo tratar el ambiente. Desinsectación segura para familias y mascotas.',
  },
  {
    slug: 'aves',
    name: 'Aves urbanas',
    icon: 'bird',
    summary: 'Palomas y otras aves que anidan en techos y fachadas, ensuciando y dañando estructuras.',
    intro:
      'Las aves urbanas son móviles, persistentes y vuelven a los mismos puntos de descanso y anidación. Sus fecas son corrosivas y focos de hongos y ácaros. El control efectivo no las daña: se basa en impedir que se posen y aniden mediante disuasión y exclusión.',
    species: [
      { name: 'Paloma doméstica', sci: 'Columba livia', note: 'La más problemática en ciudad: anida en cornisas, galpones y techos.' },
      { name: 'Gorrión', sci: 'Passer domesticus', note: 'Anida en huecos de techumbres, letreros y estructuras metálicas.' },
      { name: 'Tórtola', sci: 'Zenaida auriculata', note: 'Abundante en la zona central; se concentra en bodegas de granos y plantas de alimentos.' },
    ],
    signs: [
      'Acumulación de fecas en cornisas, aleros y veredas',
      'Nidos en canaletas, ductos o letreros',
      'Plumas y ruido constante en techos y galpones',
    ],
    risks: [
      'Sus fecas portan hongos que causan histoplasmosis y criptococosis',
      'Propagan ácaros y otros insectos dentro de los recintos',
      'El ácido de sus fecas corroe techumbres, pinturas y metales',
      'Los nidos tapan canaletas y ductos de ventilación',
    ],
    prevention: [
      'No alimentar a las aves cerca de casas o recintos',
      'Cerrar huecos en techumbres y aleros',
      'Instalar púas, redes o tensados en puntos de posado',
    ],
    service: { label: 'Control de aves', to: '/servicios/control-de-aves' },
    seoTitle: 'Palomas y aves urbanas: control | Pestología Vetlain',
    seoDescription:
      'Riesgos sanitarios y daños que causan las palomas y otras aves urbanas, y cómo alejarlas sin dañarlas con púas, redes y tensados.',
  },
]
