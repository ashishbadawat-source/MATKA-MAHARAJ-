// Matka Calculation and Helper Utilities

// Calculate Single Ank from a 3-digit Patti (Pana)
// Rule: Sum of all 3 digits, then take the last digit (modulo 10)
export function calculateAnkFromPana(pana: string): string {
  const clean = pana.replace(/\D/g, '');
  if (clean.length < 3) return '*';
  const sum = clean
    .slice(0, 3)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return (sum % 10).toString();
}

// Generate a valid sorted Matka Patti (Single Pana, Double Pana, or Triple Pana)
export function generateRealisticPana(): { pana: string; ank: string } {
  // In Matka, 0 is counted as the highest value (1,2,3,4,5,6,7,8,9,0)
  const digitsPool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const valueOf = (d: number) => (d === 0 ? 10 : d);

  // 70% chance single pana, 28% double pana, 2% triple pana
  const rand = Math.random();
  let d1: number, d2: number, d3: number;

  if (rand < 0.02) {
    // Triple Pana (e.g. 777, 555)
    const val = digitsPool[Math.floor(Math.random() * digitsPool.length)];
    d1 = d2 = d3 = val;
  } else if (rand < 0.30) {
    // Double Pana (e.g. 118, 224, 550)
    const pairVal = digitsPool[Math.floor(Math.random() * digitsPool.length)];
    let otherVal = digitsPool[Math.floor(Math.random() * digitsPool.length)];
    while (otherVal === pairVal) {
      otherVal = digitsPool[Math.floor(Math.random() * digitsPool.length)];
    }
    const arr = [pairVal, pairVal, otherVal].sort((a, b) => valueOf(a) - valueOf(b));
    [d1, d2, d3] = arr;
  } else {
    // Single Pana (distinct 3 digits)
    const shuffled = [...digitsPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).sort((a, b) => valueOf(a) - valueOf(b));
    [d1, d2, d3] = selected;
  }

  const pana = `${d1}${d2}${d3}`;
  const ank = calculateAnkFromPana(pana);
  return { pana, ank };
}

// Check if a Jodi is a Red Jodi (Half Red or Full Red)
// Red Jodi: Double digits (00, 11, 22, 33, 44, 55, 66, 77, 88, 99)
// Or Cut / Family digits (0-5, 1-6, 2-7, 3-8, 4-9): 05, 50, 16, 61, 27, 72, 38, 83, 49, 94
export function isRedJodi(jodi: string): boolean {
  if (!jodi || jodi.length !== 2 || jodi.includes('*')) return false;
  const d1 = parseInt(jodi[0], 10);
  const d2 = parseInt(jodi[1], 10);
  if (isNaN(d1) || isNaN(d2)) return false;
  if (d1 === d2) return true;
  if (Math.abs(d1 - d2) === 5) return true;
  return false;
}

// Play notification sound when a result updates live
export function playResultChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Play an uplifting two-tone Indian notification chime (G5 -> C6)
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now); // G5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, now + 0.15); // C6
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch {
    // AudioContext autoplay restrictions or disabled sound
  }
}

// Format Time in 12-hour format e.g. "03:45 PM"
export function formatCurrentISTTime(): string {
  const date = new Date();
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// Format full date in Indian convention
export function formatCurrentDate(): string {
  const date = new Date();
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format Matka Display String e.g. "389 - 08 - 369"
export function formatMatkaResult(openPana: string, jodi: string, closePana: string): string {
  return `${openPana || '***'}-${jodi || '**'}-${closePana || '***'}`;
}
