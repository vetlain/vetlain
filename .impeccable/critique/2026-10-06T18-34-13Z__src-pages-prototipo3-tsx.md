---
target: portada / (Prototipo3)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\56947\\Desktop\\Proyectos\\vetlain\\src\\pages\\Prototipo3.tsx"
target_fingerprint: "sha256:5c34a27202da071b11891c981003db8f9f7757af0610a37033a827d710297647"
target_path: "C:\\Users\\56947\\Desktop\\Proyectos\\vetlain\\src\\pages\\Prototipo3.tsx"
timestamp: 2026-10-06T18-34-13Z
slug: src-pages-prototipo3-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Heurísticas (21/32, n/a: 7, 10)
1 Estado 3 · 2 Lenguaje 2 (copy hogar, sin vocabulario B2B) · 3 Control 3 · 4 Consistencia 3 (Garantía en "06 servicios") · 5 Prevención 2 (comuna texto libre, sin campo empresa) · 6 Reconocimiento 3 · 7 n/a · 8 Minimalismo 2 (6 CTAs en primera pantalla móvil) · 9 Recuperación 3 (error sin role=alert) · 10 n/a

## Especificidad
Visual propia (cinta, Anton, cortes); estructura de plantilla de servicios locales; prueba B2B ausente (logos clientes, sello ISO, documentación, fotos de sectores).
Detector: CLI limpio; navegador 14/13: hero-eyebrow-chip, icon-tile-stack x6, low-contrast placeholders x4, all-caps-body x2 (FP), repeating-stripes (FP, cinta de marca).

## Prioridades
- [P0] Portada habla al público secundario; falta prueba B2B. clarify + layout.
- [P1] Acentos chocan en títulos Anton (leading 0.92, Á de RÁPIDO toca L). typeset.
- [P1] Exceso de CTAs, WhatsApp sin foco único. distill + clarify.
- [P2] Servicios sin jerarquía, Garantía no es servicio, tarjetas sin enlace. layout.
- [P2] Hero no preparado para carrusel (LCP 1920px sin srcset, opacidad 0 inicial, imagen única en panel). shape/harden/optimize/adapt.

## Personas
Jordan: cobertura no visible, comuna libre. Riley: acentos, títulos largos 6 líneas, focus:outline-none, error no anunciado, redes '#'. Casey: CTAs arriba, sin safe-area, menú 40px, footer links 17px. Jefa de calidad: sin logos/ISO/informe; formulario "¿Qué viste?".

## Menores
max-w-7xl vs 6xl en pasos; verde 4.23:1 solo texto grande; logo 146KB; Novedades sobre servicios; salto forzado urgencia; H3 footer bajo H2 contacto.
