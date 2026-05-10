export const formatRut = (rut: string) => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length === 0) return '';
  if (cleanRut.length <= 1) return cleanRut;
  
  let result = cleanRut.slice(-1);
  let body = cleanRut.slice(0, -1);
  
  result = '-' + result;
  while (body.length > 3) {
    result = '.' + body.slice(-3) + result;
    body = body.slice(0, -3);
  }
  result = body + result;
  
  return result;
}

export const validateRut = (rut: string) => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length < 2) return false;

  const dv = cleanRut.slice(-1);
  let rutBody = parseInt(cleanRut.slice(0, -1), 10);

  let m = 0, s = 1;
  for (; rutBody; rutBody = Math.floor(rutBody / 10)) {
    s = (s + rutBody % 10 * (9 - m++ % 6)) % 11;
  }
  const expectedDv = s ? String(s - 1) : 'K';

  return expectedDv === dv;
}
