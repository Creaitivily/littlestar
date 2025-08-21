export interface CountryData {
  code: string
  name: string
  emergencyNumbers: {
    emergency: string
    poison_control?: string
    child_abuse?: string
    suicide_prevention?: string
    [key: string]: string | undefined
  }
}

export const countries: CountryData[] = [
  {
    code: 'US',
    name: 'United States',
    emergencyNumbers: {
      emergency: '911',
      poison_control: '1-800-222-1222',
      child_abuse: '1-800-4-A-CHILD (1-800-422-4453)',
      suicide_prevention: '988'
    }
  },
  {
    code: 'CA',
    name: 'Canada',
    emergencyNumbers: {
      emergency: '911',
      poison_control: '1-844-POISON-X (1-844-764-7669)',
      child_abuse: '1-800-387-KIDS (1-800-387-5437)',
      suicide_prevention: '1-833-456-4566'
    }
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    emergencyNumbers: {
      emergency: '999 or 112',
      poison_control: '111',
      child_abuse: '0808 800 5000',
      suicide_prevention: '116 123'
    }
  },
  {
    code: 'AU',
    name: 'Australia',
    emergencyNumbers: {
      emergency: '000',
      poison_control: '13 11 26',
      child_abuse: '1800 99 10 99',
      suicide_prevention: '13 11 14'
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    emergencyNumbers: {
      emergency: '112',
      poison_control: '030 19240',
      child_abuse: '116 111',
      suicide_prevention: '0800 111 0 111'
    }
  },
  {
    code: 'FR',
    name: 'France',
    emergencyNumbers: {
      emergency: '112 or 15',
      poison_control: '01 40 05 48 48',
      child_abuse: '119',
      suicide_prevention: '01 45 39 40 00'
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    emergencyNumbers: {
      emergency: '119 (Fire/Medical) or 110 (Police)',
      poison_control: '072 727 2499',
      child_abuse: '189',
      suicide_prevention: '0570 783 556'
    }
  },
  {
    code: 'BR',
    name: 'Brazil',
    emergencyNumbers: {
      emergency: '192 (Medical) or 190 (Police)',
      poison_control: '0800 722 6001',
      child_abuse: '100',
      suicide_prevention: '188'
    }
  },
  {
    code: 'IN',
    name: 'India',
    emergencyNumbers: {
      emergency: '112',
      poison_control: '1066',
      child_abuse: '1098',
      suicide_prevention: '9152987821'
    }
  },
  {
    code: 'MX',
    name: 'Mexico',
    emergencyNumbers: {
      emergency: '911',
      poison_control: '800 472 2040',
      child_abuse: '800 121 2020',
      suicide_prevention: '800 290 0024'
    }
  }
]

export const getCountryByCode = (code: string): CountryData | undefined => {
  return countries.find(country => country.code === code)
}

export const getEmergencyNumbers = (countryCode: string) => {
  const country = getCountryByCode(countryCode)
  return country?.emergencyNumbers || countries[0].emergencyNumbers // Default to US
}