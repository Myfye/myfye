// Country code conversion from SumSub (ISO 3166-1 alpha-3) to BlindPay (2-digit)
// SumSub uses 3-letter codes like "USA", "GBR", "CAN"
// BlindPay uses 2-letter codes like "US", "GB", "CA"

const countryCodeMap = {
  // A
  'AFG': 'AF', // Afghanistan
  'ALB': 'AL', // Albania
  'DZA': 'DZ', // Algeria
  'ASM': 'AS', // American Samoa
  'AND': 'AD', // Andorra
  'AGO': 'AO', // Angola
  'AIA': 'AI', // Anguilla
  'ATA': 'AQ', // Antarctica
  'ATG': 'AG', // Antigua and Barbuda
  'ARG': 'AR', // Argentina
  'ARM': 'AM', // Armenia
  'ABW': 'AW', // Aruba
  'AUS': 'AU', // Australia
  'AUT': 'AT', // Austria
  'AZE': 'AZ', // Azerbaijan
  
  // B
  'BHS': 'BS', // Bahamas
  'BHR': 'BH', // Bahrain
  'BGD': 'BD', // Bangladesh
  'BRB': 'BB', // Barbados
  'BLR': 'BY', // Belarus
  'BEL': 'BE', // Belgium
  'BLZ': 'BZ', // Belize
  'BEN': 'BJ', // Benin
  'BMU': 'BM', // Bermuda
  'BTN': 'BT', // Bhutan
  'BOL': 'BO', // Bolivia
  'BES': 'BQ', // Bonaire, Sint Eustatius and Saba
  'BIH': 'BA', // Bosnia and Herzegovina
  'BWA': 'BW', // Botswana
  'BVT': 'BV', // Bouvet Island
  'BRA': 'BR', // Brazil
  'IOT': 'IO', // British Indian Ocean Territory
  'BRN': 'BN', // Brunei Darussalam
  'BGR': 'BG', // Bulgaria
  'BFA': 'BF', // Burkina Faso
  'BDI': 'BI', // Burundi
  
  // C
  'CPV': 'CV', // Cabo Verde
  'KHM': 'KH', // Cambodia
  'CMR': 'CM', // Cameroon
  'CAN': 'CA', // Canada
  'CYM': 'KY', // Cayman Islands
  'CAF': 'CF', // Central African Republic
  'TCD': 'TD', // Chad
  'CHL': 'CL', // Chile
  'CHN': 'CN', // China
  'CXR': 'CX', // Christmas Island
  'CCK': 'CC', // Cocos (Keeling) Islands
  'COL': 'CO', // Colombia
  'COM': 'KM', // Comoros
  'COD': 'CD', // Congo, Democratic Republic of the
  'COG': 'CG', // Congo
  'COK': 'CK', // Cook Islands
  'CRI': 'CR', // Costa Rica
  'HRV': 'HR', // Croatia
  'CUB': 'CU', // Cuba
  'CUW': 'CW', // Curaçao
  'CYP': 'CY', // Cyprus
  'CZE': 'CZ', // Czech Republic
  'CIV': 'CI', // Côte d'Ivoire
  
  // D
  'DNK': 'DK', // Denmark
  'DJI': 'DJ', // Djibouti
  'DMA': 'DM', // Dominica
  'DOM': 'DO', // Dominican Republic
  
  // E
  'ECU': 'EC', // Ecuador
  'EGY': 'EG', // Egypt
  'SLV': 'SV', // El Salvador
  'GNQ': 'GQ', // Equatorial Guinea
  'ERI': 'ER', // Eritrea
  'EST': 'EE', // Estonia
  'SWZ': 'SZ', // Eswatini
  'ETH': 'ET', // Ethiopia
  
  // F
  'FLK': 'FK', // Falkland Islands (Malvinas)
  'FRO': 'FO', // Faroe Islands
  'FJI': 'FJ', // Fiji
  'FIN': 'FI', // Finland
  'FRA': 'FR', // France
  'GUF': 'GF', // French Guiana
  'PYF': 'PF', // French Polynesia
  'ATF': 'TF', // French Southern Territories
  
  // G
  'GAB': 'GA', // Gabon
  'GMB': 'GM', // Gambia
  'GEO': 'GE', // Georgia
  'DEU': 'DE', // Germany
  'GHA': 'GH', // Ghana
  'GIB': 'GI', // Gibraltar
  'GRC': 'GR', // Greece
  'GRL': 'GL', // Greenland
  'GRD': 'GD', // Grenada
  'GLP': 'GP', // Guadeloupe
  'GUM': 'GU', // Guam
  'GTM': 'GT', // Guatemala
  'GGY': 'GG', // Guernsey
  'GIN': 'GN', // Guinea
  'GNB': 'GW', // Guinea-Bissau
  'GUY': 'GY', // Guyana
  
  // H
  'HTI': 'HT', // Haiti
  'HMD': 'HM', // Heard Island and McDonald Islands
  'VAT': 'VA', // Holy See (Vatican City State)
  'HND': 'HN', // Honduras
  'HKG': 'HK', // Hong Kong
  'HUN': 'HU', // Hungary
  
  // I
  'ISL': 'IS', // Iceland
  'IND': 'IN', // India
  'IDN': 'ID', // Indonesia
  'IRN': 'IR', // Iran, Islamic Republic of
  'IRQ': 'IQ', // Iraq
  'IRL': 'IE', // Ireland
  'IMN': 'IM', // Isle of Man
  'ISR': 'IL', // Israel
  'ITA': 'IT', // Italy
  
  // J
  'JAM': 'JM', // Jamaica
  'JPN': 'JP', // Japan
  'JEY': 'JE', // Jersey
  'JOR': 'JO', // Jordan
  
  // K
  'KAZ': 'KZ', // Kazakhstan
  'KEN': 'KE', // Kenya
  'KIR': 'KI', // Kiribati
  'PRK': 'KP', // Korea, Democratic People's Republic of
  'KOR': 'KR', // Korea, Republic of
  'KWT': 'KW', // Kuwait
  'KGZ': 'KG', // Kyrgyzstan
  
  // L
  'LAO': 'LA', // Lao People's Democratic Republic
  'LVA': 'LV', // Latvia
  'LBN': 'LB', // Lebanon
  'LSO': 'LS', // Lesotho
  'LBR': 'LR', // Liberia
  'LBY': 'LY', // Libya
  'LIE': 'LI', // Liechtenstein
  'LTU': 'LT', // Lithuania
  'LUX': 'LU', // Luxembourg
  
  // M
  'MAC': 'MO', // Macao
  'MDG': 'MG', // Madagascar
  'MWI': 'MW', // Malawi
  'MYS': 'MY', // Malaysia
  'MDV': 'MV', // Maldives
  'MLI': 'ML', // Mali
  'MLT': 'MT', // Malta
  'MHL': 'MH', // Marshall Islands
  'MTQ': 'MQ', // Martinique
  'MRT': 'MR', // Mauritania
  'MUS': 'MU', // Mauritius
  'MYT': 'YT', // Mayotte
  'MEX': 'MX', // Mexico
  'FSM': 'FM', // Micronesia, Federated States of
  'MDA': 'MD', // Moldova, Republic of
  'MCO': 'MC', // Monaco
  'MNG': 'MN', // Mongolia
  'MNE': 'ME', // Montenegro
  'MSR': 'MS', // Montserrat
  'MAR': 'MA', // Morocco
  'MOZ': 'MZ', // Mozambique
  'MMR': 'MM', // Myanmar
  
  // N
  'NAM': 'NA', // Namibia
  'NRU': 'NR', // Nauru
  'NPL': 'NP', // Nepal
  'NLD': 'NL', // Netherlands
  'NCL': 'NC', // New Caledonia
  'NZL': 'NZ', // New Zealand
  'NIC': 'NI', // Nicaragua
  'NER': 'NE', // Niger
  'NGA': 'NG', // Nigeria
  'NIU': 'NU', // Niue
  'NFK': 'NF', // Norfolk Island
  'MNP': 'MP', // Northern Mariana Islands
  'NOR': 'NO', // Norway
  
  // O
  'OMN': 'OM', // Oman
  
  // P
  'PAK': 'PK', // Pakistan
  'PLW': 'PW', // Palau
  'PSE': 'PS', // Palestine, State of
  'PAN': 'PA', // Panama
  'PNG': 'PG', // Papua New Guinea
  'PRY': 'PY', // Paraguay
  'PER': 'PE', // Peru
  'PHL': 'PH', // Philippines
  'PCN': 'PN', // Pitcairn
  'POL': 'PL', // Poland
  'PRT': 'PT', // Portugal
  'PRI': 'PR', // Puerto Rico
  
  // Q
  'QAT': 'QA', // Qatar
  
  // R
  'MKD': 'MK', // Republic of North Macedonia
  'ROU': 'RO', // Romania
  'RUS': 'RU', // Russian Federation
  'RWA': 'RW', // Rwanda
  'REU': 'RE', // Réunion
  
  // S
  'BLM': 'BL', // Saint Barthélemy
  'SHN': 'SH', // Saint Helena, Ascension and Tristan da Cunha
  'KNA': 'KN', // Saint Kitts and Nevis
  'LCA': 'LC', // Saint Lucia
  'MAF': 'MF', // Saint Martin (French part)
  'SPM': 'PM', // Saint Pierre and Miquelon
  'VCT': 'VC', // Saint Vincent and the Grenadines
  'WSM': 'WS', // Samoa
  'SMR': 'SM', // San Marino
  'STP': 'ST', // Sao Tome and Principe
  'SAU': 'SA', // Saudi Arabia
  'SEN': 'SN', // Senegal
  'SRB': 'RS', // Serbia
  'SYC': 'SC', // Seychelles
  'SLE': 'SL', // Sierra Leone
  'SGP': 'SG', // Singapore
  'SXM': 'SX', // Sint Maarten (Dutch part)
  'SVK': 'SK', // Slovakia
  'SVN': 'SI', // Slovenia
  'SLB': 'SB', // Solomon Islands
  'SOM': 'SO', // Somalia
  'ZAF': 'ZA', // South Africa
  'SGS': 'GS', // South Georgia and the South Sandwich Islands
  'SSD': 'SS', // South Sudan
  'ESP': 'ES', // Spain
  'LKA': 'LK', // Sri Lanka
  'SDN': 'SD', // Sudan
  'SUR': 'SR', // Suriname
  'SJM': 'SJ', // Svalbard and Jan Mayen
  'SWE': 'SE', // Sweden
  'CHE': 'CH', // Switzerland
  'SYR': 'SY', // Syrian Arab Republic
  
  // T
  'TWN': 'TW', // Taiwan, Province of China
  'TJK': 'TJ', // Tajikistan
  'TZA': 'TZ', // Tanzania, United Republic of
  'THA': 'TH', // Thailand
  'TLS': 'TL', // Timor-Leste
  'TGO': 'TG', // Togo
  'TKL': 'TK', // Tokelau
  'TON': 'TO', // Tonga
  'TTO': 'TT', // Trinidad and Tobago
  'TUN': 'TN', // Tunisia
  'TUR': 'TR', // Turkey
  'TKM': 'TM', // Turkmenistan
  'TCA': 'TC', // Turks and Caicos Islands
  'TUV': 'TV', // Tuvalu
  
  // U
  'UGA': 'UG', // Uganda
  'UKR': 'UA', // Ukraine
  'ARE': 'AE', // United Arab Emirates
  'GBR': 'GB', // United Kingdom of Great Britain and Northern Ireland
  'UMI': 'UM', // United States Minor Outlying Islands
  'USA': 'US', // United States of America
  'URY': 'UY', // Uruguay
  'UZB': 'UZ', // Uzbekistan
  
  // V
  'VUT': 'VU', // Vanuatu
  'VEN': 'VE', // Venezuela, Bolivarian Republic of
  'VNM': 'VN', // Viet Nam
  'VGB': 'VG', // Virgin Islands, British
  'VIR': 'VI', // Virgin Islands, U.S.
  
  // W
  'WLF': 'WF', // Wallis and Futuna
  'ESH': 'EH', // Western Sahara
  
  // Y
  'YEM': 'YE', // Yemen
  
  // Z
  'ZMB': 'ZM', // Zambia
  'ZWE': 'ZW', // Zimbabwe
  
  // Special territories
  'ALA': 'AX', // Åland Islands
};

/**
 * Convert SumSub country code (ISO 3166-1 alpha-3) to BlindPay country code (2-digit)
 * @param {string} sumsubCountryCode - The 3-letter country code from SumSub
 * @returns {string|null} - The 2-letter country code for BlindPay, or null if not found
 */
function convertSumsubToBlindpayCountryCode(sumsubCountryCode) {
  if (!sumsubCountryCode) {
    return null;
  }
  
  // Convert to uppercase to handle case variations
  const normalizedCode = sumsubCountryCode.toUpperCase();
  
  // Check if the code exists in our mapping
  const blindpayCode = countryCodeMap[normalizedCode];
  
  if (!blindpayCode) {
    console.warn(`Unknown country code from SumSub: ${sumsubCountryCode}`);
    return null;
  }
  
  return blindpayCode;
}

module.exports = {
  convertSumsubToBlindpayCountryCode,
  countryCodeMap
};
