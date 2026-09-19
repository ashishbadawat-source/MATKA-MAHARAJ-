import { MatkaMarket, ChartRecord } from '../types';

// Helper to generate realistic historical chart records for 28 days (4 weeks)
function generateHistoricalRecords(seedPrefix: string): ChartRecord[] {
  const records: ChartRecord[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Create records for the last 24 working days
  let dayOffset = 1;
  while (records.length < 24) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOffset);
    dayOffset++;
    
    // Skip Sundays
    if (d.getDay() === 0) continue;

    const dayName = days[d.getDay() - 1] || 'Sat';
    const dateStr = d.toISOString().split('T')[0];

    // Semi-deterministic realistic numbers based on seed + offset
    const pseudoRand = (seedPrefix.charCodeAt(0) * 17 + dayOffset * 31) % 900 + 100;
    const p1 = `${(pseudoRand % 7) + 1}${(pseudoRand % 5) + 2}${((pseudoRand % 8) + 2) % 10}`;
    const p2 = `${((pseudoRand + 3) % 7) + 1}${((pseudoRand + 5) % 5) + 3}${((pseudoRand + 7) % 8) % 10}`;
    
    const d1Sum = p1.split('').reduce((a, b) => a + parseInt(b, 10), 0) % 10;
    const d2Sum = p2.split('').reduce((a, b) => a + parseInt(b, 10), 0) % 10;
    const jodi = `${d1Sum}${d2Sum}`;

    records.push({
      date: dateStr,
      day: dayName,
      openPana: p1,
      jodi,
      closePana: p2,
    });
  }

  return records;
}

export const INITIAL_MARKETS: MatkaMarket[] = [
  {
    id: 'kalyan',
    name: 'KALYAN',
    hindiName: 'कल्याण',
    openTime: '03:45 PM',
    closeTime: '05:45 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    openPana: '389',
    jodi: '08',
    closePana: '369',
    status: 'closed',
    isPopular: true,
    lastUpdated: 'Today at 05:46 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('KALYAN'),
  },
  {
    id: 'main-bazar',
    name: 'MAIN BAZAR',
    hindiName: 'मेन बाजार',
    openTime: '09:40 PM',
    closeTime: '12:05 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    openPana: '147',
    jodi: '25',
    closePana: '168',
    status: 'open_declared',
    isPopular: true,
    lastUpdated: 'Today at 09:45 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('MAIN'),
  },
  {
    id: 'kalyan-night',
    name: 'KALYAN NIGHT',
    hindiName: 'कल्याण नाईट',
    openTime: '09:25 PM',
    closeTime: '11:25 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '246',
    jodi: '29',
    closePana: '360',
    status: 'closed',
    isPopular: true,
    lastUpdated: 'Today at 11:26 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('KNIGHT'),
  },
  {
    id: 'milan-day',
    name: 'MILAN DAY',
    hindiName: 'मिलन डे',
    openTime: '03:00 PM',
    closeTime: '05:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '579',
    jodi: '14',
    closePana: '149',
    status: 'closed',
    isPopular: true,
    lastUpdated: 'Today at 05:01 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('MDAY'),
  },
  {
    id: 'milan-night',
    name: 'MILAN NIGHT',
    hindiName: 'मिलन नाईट',
    openTime: '09:00 PM',
    closeTime: '11:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '180',
    jodi: '9*',
    closePana: '***',
    status: 'open_declared',
    isPopular: true,
    lastUpdated: 'Today at 09:05 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('MNIGHT'),
  },
  {
    id: 'rajdhani-day',
    name: 'RAJDHANI DAY',
    hindiName: 'राजधानी डे',
    openTime: '03:15 PM',
    closeTime: '05:15 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    openPana: '258',
    jodi: '56',
    closePana: '358',
    status: 'closed',
    isPopular: true,
    lastUpdated: 'Today at 05:16 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('RDAY'),
  },
  {
    id: 'rajdhani-night',
    name: 'RAJDHANI NIGHT',
    hindiName: 'राजधानी नाईट',
    openTime: '09:35 PM',
    closeTime: '11:35 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    openPana: '157',
    jodi: '37',
    closePana: '278',
    status: 'closed',
    isPopular: true,
    lastUpdated: 'Today at 11:36 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('RNIGHT'),
  },
  {
    id: 'time-bazar',
    name: 'TIME BAZAR',
    hindiName: 'टाइम बाजार',
    openTime: '01:00 PM',
    closeTime: '02:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    openPana: '468',
    jodi: '82',
    closePana: '138',
    status: 'closed',
    isPopular: false,
    lastUpdated: 'Today at 02:02 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('TIME'),
  },
  {
    id: 'sridevi',
    name: 'SRIDEVI',
    hindiName: 'श्रीदेवी',
    openTime: '11:35 AM',
    closeTime: '12:35 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '347',
    jodi: '49',
    closePana: '469',
    status: 'closed',
    isPopular: false,
    lastUpdated: 'Today at 12:36 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('SRIDEVI'),
  },
  {
    id: 'madhur-day',
    name: 'MADHUR DAY',
    hindiName: 'मधुर डे',
    openTime: '01:30 PM',
    closeTime: '02:30 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '127',
    jodi: '03',
    closePana: '490',
    status: 'closed',
    isPopular: false,
    lastUpdated: 'Today at 02:32 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('MADHUR'),
  },
  {
    id: 'supreme-day',
    name: 'SUPREME DAY',
    hindiName: 'सुप्रीम डे',
    openTime: '03:35 PM',
    closeTime: '05:35 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openPana: '239',
    jodi: '4*',
    closePana: '***',
    status: 'open_declared',
    isPopular: false,
    lastUpdated: 'Today at 03:40 PM',
    autoUpdateEnabled: true,
    chartHistory: generateHistoricalRecords('SUPREME'),
  },
];
