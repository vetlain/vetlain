/**
 * Punto de entrada serverless para Vercel.
 * Vercel enruta /api/* a esta función (ver rewrites en vercel.json).
 * Una app de Express es un handler (req, res), así que se exporta directamente.
 */
import { createApp } from '../server/app'

export default createApp()
