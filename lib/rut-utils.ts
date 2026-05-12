/**
 * Utilidades para la validación y manejo de RUT chileno (Módulo 11)
 */

/**
 * Limpia el RUT de puntos y guiones
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '');
}

/**
 * Valida un RUT chileno usando el algoritmo Módulo 11
 */
export function validateRut(rut: string): boolean {
  const clean = cleanRut(rut);
  if (clean.length < 7 || clean.length > 9) return false;

  const dv = clean.slice(-1).toUpperCase();
  const corpo = clean.slice(0, -1);

  let suma = 0;
  let multiplo = 2;

  for (let i = corpo.length - 1; i >= 0; i--) {
    suma += parseInt(corpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = '';

  if (dvEsperado === 11) dvCalculado = '0';
  else if (dvEsperado === 10) dvCalculado = 'K';
  else dvCalculado = dvEsperado.toString();

  return dv === dvCalculado;
}

/**
 * Formatea un RUT con puntos y guion
 */
export function formatRut(rut: string): string {
  const clean = cleanRut(rut);
  if (!clean) return '';
  
  const dv = clean.slice(-1);
  const corpo = clean.slice(0, -1);
  
  return corpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + dv;
}

/**
 * Determina si el RUT es de Persona o Empresa
 * En Chile, los RUT de empresas suelen ser mayores a 50.000.000
 */
export function getRutType(rut: string): 'PERSONA' | 'EMPRESA' {
  const clean = cleanRut(rut);
  const num = parseInt(clean.slice(0, -1));
  
  return num >= 50000000 ? 'EMPRESA' : 'PERSONA';
}
