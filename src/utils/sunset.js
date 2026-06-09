const SF_LAT = 37.7749;
const SF_LNG = -122.4194;

export function getSFSunTimes(date = new Date()) {
  const lw = -SF_LNG;
  const jd = date.valueOf() / 86400000 + 2440587.5;
  const n = Math.ceil(jd - 2451545.0009 - lw / 360);
  const jStar = 2451545.0009 + lw / 360 + n;
  const M = (357.5291 + 0.98560028 * (jStar - 2451545)) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C =
    1.9148 * Math.sin(Mrad) +
    0.02 * Math.sin(2 * Mrad) +
    0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = (lambda * Math.PI) / 180;
  const jTransit =
    jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const sinDec = Math.sin(lambdaRad) * Math.sin((23.4397 * Math.PI) / 180);
  const cosDec = Math.cos(Math.asin(sinDec));
  const latRad = (SF_LAT * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.833 * Math.PI) / 180) - Math.sin(latRad) * sinDec) /
    (Math.cos(latRad) * cosDec);
  if (Math.abs(cosH) > 1) return null;
  const H = (Math.acos(cosH) * 180) / Math.PI;
  const fromJulian = jd => new Date((jd - 2440587.5) * 86400000);
  return {
    sunrise: fromJulian(jTransit - H / 360),
    sunset: fromJulian(jTransit + H / 360),
  };
}

export function isAfterSunset() {
  const now = new Date();
  const times = getSFSunTimes(now);
  if (!times) return false;
  return now >= times.sunset || now < times.sunrise;
}
