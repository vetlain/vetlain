# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primario: empresas.** Encargados de operaciones, calidad o mantención de plantas alimentarias, bodegas, casinos, oficinas y espacios comunes de la zona poniente de Santiago. Necesitan un programa de control de plagas continuo, con visitas programadas, registros, planos de estaciones y documentación lista para auditorías e inspecciones sanitarias (ISO 9001, HACCP). Evalúan seriedad, respaldo por escrito y continuidad del proveedor.

**Secundario: hogares y negocios chicos.** Personas con una plaga hoy (ratas, cucarachas, palomas) en Talagante y comunas vecinas, normalmente desde el celular y con urgencia. Quieren saber rápido si los atienden en su sector y cuándo pueden ir.

Tercera audiencia, interna: **el administrador del sitio** (el cliente, no técnico) que edita contenido, blog y novedades desde el panel `/admin` y publica cambios.

## Product Purpose

Sitio comercial de Vetlain, empresa de control de plagas de Talagante. Existe para generar contactos de calidad, sobre todo contratos con empresas, y para posicionarse en búsquedas locales (SEO es prioridad transversal). Éxito: conversaciones de WhatsApp iniciadas desde el sitio, en particular de empresas que piden un programa de control.

## Positioning

Proveedor local con más de 20 años de oficio en la zona poniente de Santiago, certificado ISO 9001:2015, que entrega todo por escrito (qué se aplicó, dónde y con qué producto) y responde el mismo día. Combina la formalidad documental que exigen las plantas y bodegas con la cercanía de una empresa de Talagante que contesta el teléfono y vuelve si algo no quedó resuelto.

## Operating Context

- Contacto principal por **WhatsApp** (+56 9 6830 2857); llamada (incl. fijo +56 2 2815 3975) y formulario (leads al panel) son respaldo.
- Flujo de servicio: el cliente escribe o llama → evaluación en terreno sin costo → tratamiento y plan de control → informe y certificado del servicio.
- Empresas: plan anual con visitas periódicas, registros, planos de estaciones y documentación para auditorías.
- Dirección: Juana Canales 987, Talagante. Horario Lun–Vie 09:00–18:00. Email vetlain@vetlain.cl.
- Cobertura: Talagante, Peñaflor, El Monte, Isla de Maipo, Padre Hurtado y comunas vecinas.

## Capabilities and Constraints

- Servicios: desratización, desinsectación, control de aves, desinfección y sanitización, programas para empresas y bodegas, capacitaciones.
- Catálogo de productos (roedores, insectos, aves) como vitrina; la compra ocurre en una tienda externa (vzgroups.com), no en este sitio.
- Blog y novedades editables por el cliente desde el panel.
- Stack existente: React + Vite + Tailwind v3, Express serverless y Neon en Vercel; páginas públicas prerenderizadas (SSG) para SEO; despliegue automático desde `main`.
- Todo texto público debe ser editable desde el panel; la UI no puede depender de copy fijo que el cliente no controle.
- Idioma: español de Chile.
- Pendiente: el contenido semilla actual está orientado a hogares con urgencia; aún no refleja que las empresas son el público primario.

## Brand Commitments

- Nombre: Vetlain. Logo y assets en `public/brand/`.
- Colores de marca del logo: verde `#3d8b40` y carbón `#1a1a1a`, sobre fondo blanco. (No azul.)
- Voz: directa, cercana y concreta, tuteo chileno ("cotización al toque"), sin jerga técnica innecesaria.

## Evidence on Hand

- Certificación ISO 9001 vigente (`public/brand/iso-9001.png`).
- Más de 20 años de oficio, nacidos en Talagante.
- Respuesta el mismo día y evaluación en terreno sin costo.
- Logos de clientes reales autorizados: Aristia, Bruggen, Huentelauquén, Pacífico Sur, Puratos (`public/brand/cliente-*.png`).
- Fotos reales: técnico, desinsectación, industria; fotos de sectores (`public/brand/sectores/`) y de productos (`public/brand/productos/`).
- No existen testimonios, cifras de clientes atendidos, casos de estudio ni precios publicados: no inventarlos. Redes sociales aún sin URL real.

## Product Principles

1. **Empresas primero, sin perder al hogar urgente.** La jerarquía habla a quien contrata programas; el camino rápido a WhatsApp sigue a un toque para quien tiene una plaga hoy.
2. **Respaldo por escrito como prueba.** ISO, registros, certificados y clientes reales valen más que adjetivos.
3. **WhatsApp es la puerta.** Cada página termina en una forma inmediata de escribir.
4. **Local y encontrable.** Cada página sirve al SEO local: contenido real, rutas propias, comunas nombradas.
5. **Editable por un no técnico.** Lo que el cliente edita en el panel debe verse bien con textos de cualquier largo.

## Accessibility & Inclusion

Uso mayoritario desde celular; objetivo WCAG 2.1 AA en contraste, foco visible y movimiento reducido.
