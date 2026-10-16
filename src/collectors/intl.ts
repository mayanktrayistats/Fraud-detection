export interface IntlData {
  timezone: {
    name: string;
    cityLocation: string;
    offsetMinutes: number;
    historicOffset: number;
    timezoneString: string;
  };
  intl: {
    locale: string;
    monthTimeZone: string;
    languageName: string;
    compactNumber: string;
    relativeTime: string;
    pluralRuleZero: string;
    pluralRuleOne: string;
  };
}

export function collectIntl(): IntlData {
  // Timezone calculations
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset(); // e.g. -330
  const dtf = Intl.DateTimeFormat();
  const resolved = dtf.resolvedOptions();
  const timeZoneName = resolved.timeZone || 'unknown';

  // Format timezone city display (e.g. Asia/Calcutta -> Asia, Calcutta)
  const cityLocation = timeZoneName.replace('/', ', ').replace('_', ' ');

  // Standard historic epoch offset check
  const historicDate = new Date(-2702870600800); // 1884 epoch check in CreepJS
  const historicOffset = historicDate.getTime();

  // Long timezone name
  let timezoneString = '';
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' }).formatToParts(now);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    timezoneString = tzPart ? tzPart.value : timeZoneName;
  } catch {
    timezoneString = timeZoneName;
  }

  // Intl capabilities
  let monthTimeZone = '';
  try {
    // e.g. July at India Standard Time
    const sampleDate = new Date(2024, 6, 1);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(sampleDate);
    monthTimeZone = `${month} at ${timezoneString}`;
  } catch {
    monthTimeZone = 'July';
  }

  let languageName = 'English';
  try {
    if ((Intl as any).DisplayNames) {
      const dn = new (Intl as any).DisplayNames(['en-US'], { type: 'language' });
      languageName = dn.of('en-US') || 'American English';
    }
  } catch {
    languageName = 'American English';
  }

  let compactNumber = '21 million';
  try {
    const nf = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'long' } as any);
    compactNumber = nf.format(21000000);
  } catch {
    compactNumber = '21M';
  }

  let relativeTime = 'next year';
  try {
    const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
    relativeTime = rtf.format(1, 'year');
  } catch {
    relativeTime = 'in 1 year';
  }

  let pluralRuleZero = '0 or 1';
  let pluralRuleOne = 'one';
  try {
    const pr = new Intl.PluralRules('en-US');
    pluralRuleOne = pr.select(1);
    pluralRuleZero = `${pr.select(0)} or ${pr.select(1)}`;
  } catch {
    // fallback
  }

  return {
    timezone: {
      name: timezoneString,
      cityLocation,
      offsetMinutes,
      historicOffset,
      timezoneString
    },
    intl: {
      locale: resolved.locale || 'en-US',
      monthTimeZone,
      languageName,
      compactNumber,
      relativeTime,
      pluralRuleZero,
      pluralRuleOne
    }
  };
}
