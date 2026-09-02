/**
 * KidsGameHub — países, capitais e estados
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente. Este arquivo é para
 * ser lido por quem quer conferir o conteúdo, não por quem mexe na tela.
 */

/* ---------- Dados: países por continente + tier de dificuldade ----------
   tier 1 = muito conhecido ... 4 = raro.
   Nomes vêm de Intl.DisplayNames → i18n automático em ~100 idiomas.        */
export const DATA = {
  sa: { AR:1, BR:1, CL:1, UY:2, PY:2, BO:2, PE:2, EC:2, CO:1, VE:2, GY:4, SR:4 },
  na: { US:1, CA:1, MX:1, CU:2, JM:2, HT:3, DO:3, GT:3, CR:2, PA:3, HN:3, NI:3, SV:3, BZ:4, BS:4, TT:4,
        // ilhas do Caribe
        AG:4, BB:4, DM:4, GD:4, KN:4, LC:4, VC:4, PR:3 },
  eu: { PT:1, ES:1, FR:1, IT:1, DE:1, GB:1, IE:2, NL:2, BE:2, CH:2, AT:2, GR:2, SE:2, NO:2, FI:2, DK:2, PL:3, RU:1, UA:2, HU:3, CZ:3, RO:3, HR:3, IS:3, RS:4, BG:4, SK:4, SI:4, LT:4, LV:4, EE:4, AL:4, MT:4, LU:4,
        CY:4, ME:4, MC:4, AD:4, SM:4 },
  af: { ZA:1, EG:1, NG:2, KE:2, MA:2, AO:2, MZ:2, GH:2, ET:3, SN:3, CM:3, TZ:3, DZ:3, TN:3, CD:3, CI:3, ZW:4, NA:4, UG:4, ZM:4, ML:4, MG:3, BW:4, RW:4,
        // ilhas africanas
        CV:4, MU:4, SC:4, KM:4, ST:4 },
  as: { CN:1, JP:1, IN:1, KR:1, TH:2, VN:2, ID:2, PH:2, MY:2, SG:2, SA:2, AE:2, IL:2, TR:2, PK:3, BD:3, NP:3, LK:3, IR:3, IQ:3, MN:4, KZ:4, UZ:4, KH:4, LA:4, MM:4, QA:4, JO:4, LB:4, SY:4, AF:4, BT:4,
        // ilhas asiáticas
        MV:4, BN:4, TL:4, BH:4 },
  oc: { AU:1, NZ:1, FJ:3, PG:4, WS:4, TO:4, VU:4, SB:4,
        KI:4, TV:4, NR:4, MH:4, FM:4, PW:4 },
};

/* Nível Gênio: bandeiras subnacionais (estados / regiões).
   ATENÇÃO: o pacote flag-icons, de onde scripts/prepare-flags.mjs copia os SVGs,
   só traz 7 subnacionais: gb-eng, gb-sct, gb-wls, gb-nir, es-ct, es-pv e es-ga.
   Todos os us-* daqui, mais es-an, es-cn e es-ib, ficam sem arquivo e caem no
   desenho de reserva do jogo. Para acender qualquer uma delas — inclusive
   estados do Brasil, províncias do Canadá ou bandeiras de cidade — basta salvar
   o SVG em public/flags/ com o mesmo código; nada é buscado na internet. */
export const SUBFLAGS = {
  eu: [
    { code: "gb-eng", pt: "Inglaterra", en: "England", es: "Inglaterra" },
    { code: "gb-sct", pt: "Escócia", en: "Scotland", es: "Escocia" },
    { code: "gb-wls", pt: "País de Gales", en: "Wales", es: "Gales" },
    { code: "gb-nir", pt: "Irlanda do Norte", en: "Northern Ireland", es: "Irlanda del Norte" },
    { code: "es-ct", pt: "Catalunha", en: "Catalonia", es: "Cataluña" },
    { code: "es-pv", pt: "País Basco", en: "Basque Country", es: "País Vasco" },
    { code: "es-ga", pt: "Galícia", en: "Galicia", es: "Galicia" },
    { code: "es-an", pt: "Andaluzia", en: "Andalusia", es: "Andalucía" },
    { code: "es-cn", pt: "Ilhas Canárias", en: "Canary Islands", es: "Islas Canarias" },
    { code: "es-ib", pt: "Ilhas Baleares", en: "Balearic Islands", es: "Islas Baleares" },
  ],
  na: [
    { code: "us-ca", pt: "Califórnia", en: "California", es: "California" },
    { code: "us-tx", pt: "Texas", en: "Texas", es: "Texas" },
    { code: "us-ny", pt: "Nova York", en: "New York", es: "Nueva York" },
    { code: "us-fl", pt: "Flórida", en: "Florida", es: "Florida" },
    { code: "us-ak", pt: "Alasca", en: "Alaska", es: "Alaska" },
    { code: "us-hi", pt: "Havaí", en: "Hawaii", es: "Hawái" },
    { code: "us-az", pt: "Arizona", en: "Arizona", es: "Arizona" },
    { code: "us-nm", pt: "Novo México", en: "New Mexico", es: "Nuevo México" },
    { code: "us-co", pt: "Colorado", en: "Colorado", es: "Colorado" },
    { code: "us-md", pt: "Maryland", en: "Maryland", es: "Maryland" },
    { code: "us-oh", pt: "Ohio", en: "Ohio", es: "Ohio" },
    { code: "us-la", pt: "Luisiana", en: "Louisiana", es: "Luisiana" },
  ],
};

/* ---------- Capitais ----------
   Começa pelos estados do Brasil, passa pelas capitais dos países continente
   a continente, e termina nos estados dos Estados Unidos. Os nomes dos países
   vêm do sistema; só as capitais precisam de grafia própria por idioma. */
export const BR_ESTADOS = [
  ["Acre", "Rio Branco"],
  ["Alagoas", "Maceió"],
  ["Amapá", "Macapá"],
  ["Amazonas", "Manaus"],
  ["Bahia", "Salvador"],
  ["Ceará", "Fortaleza"],
  ["Distrito Federal", "Brasília"],
  ["Espírito Santo", "Vitória"],
  ["Goiás", "Goiânia"],
  ["Maranhão", "São Luís"],
  ["Mato Grosso", "Cuiabá"],
  ["Mato Grosso do Sul", "Campo Grande"],
  ["Minas Gerais", "Belo Horizonte"],
  ["Pará", "Belém"],
  ["Paraíba", "João Pessoa"],
  ["Paraná", "Curitiba"],
  ["Pernambuco", "Recife"],
  ["Piauí", "Teresina"],
  ["Rio de Janeiro", "Rio de Janeiro"],
  ["Rio Grande do Norte", "Natal"],
  ["Rio Grande do Sul", "Porto Alegre"],
  ["Rondônia", "Porto Velho"],
  ["Roraima", "Boa Vista"],
  ["Santa Catarina", "Florianópolis"],
  ["São Paulo", "São Paulo"],
  ["Sergipe", "Aracaju"],
  ["Tocantins", "Palmas"],
];

export const US_ESTADOS = [
  ["California", "Sacramento"],
  ["Texas", "Austin"],
  ["New York", "Albany"],
  ["Florida", "Tallahassee"],
  ["Illinois", "Springfield"],
  ["Ohio", "Columbus"],
  ["Georgia", "Atlanta"],
  ["Michigan", "Lansing"],
  ["Washington", "Olympia"],
  ["Arizona", "Phoenix"],
  ["Colorado", "Denver"],
  ["Oregon", "Salem"],
  ["Nevada", "Carson City"],
  ["Utah", "Salt Lake City"],
  ["Alaska", "Juneau"],
  ["Hawaii", "Honolulu"],
  ["Louisiana", "Baton Rouge"],
  ["Tennessee", "Nashville"],
  ["Kentucky", "Frankfort"],
  ["Missouri", "Jefferson City"],
  ["Kansas", "Topeka"],
  ["Nebraska", "Lincoln"],
  ["Minnesota", "Saint Paul"],
  ["Wisconsin", "Madison"],
  ["Indiana", "Indianapolis"],
  ["Virginia", "Richmond"],
  ["Maryland", "Annapolis"],
  ["Massachusetts", "Boston"],
  ["Pennsylvania", "Harrisburg"],
  ["New Jersey", "Trenton"],
];

export const CAPITAIS = { AR: "Buenos Aires", BR: "Brasília", CL: "Santiago", UY: "Montevideo", PY: "Asunción", BO: "Sucre", PE: "Lima", EC: "Quito", CO: "Bogotá", VE: "Caracas", GY: "Georgetown", SR: "Paramaribo", US: "Washington, D.C.", CA: "Ottawa", MX: "Mexico City", CU: "Havana", JM: "Kingston", HT: "Port-au-Prince", DO: "Santo Domingo", GT: "Guatemala City", CR: "San José", PA: "Panama City", HN: "Tegucigalpa", NI: "Managua", SV: "San Salvador", BZ: "Belmopan", BS: "Nassau", TT: "Port of Spain", AG: "Saint John's", BB: "Bridgetown", DM: "Roseau", GD: "Saint George's", KN: "Basseterre", LC: "Castries", VC: "Kingstown", PR: "San Juan", PT: "Lisbon", ES: "Madrid", FR: "Paris", IT: "Rome", DE: "Berlin", GB: "London", IE: "Dublin", NL: "Amsterdam", BE: "Brussels", CH: "Bern", AT: "Vienna", GR: "Athens", SE: "Stockholm", NO: "Oslo", FI: "Helsinki", DK: "Copenhagen", PL: "Warsaw", RU: "Moscow", UA: "Kyiv", HU: "Budapest", CZ: "Prague", RO: "Bucharest", HR: "Zagreb", IS: "Reykjavík", RS: "Belgrade", BG: "Sofia", SK: "Bratislava", SI: "Ljubljana", LT: "Vilnius", LV: "Riga", EE: "Tallinn", AL: "Tirana", MT: "Valletta", LU: "Luxembourg", CY: "Nicosia", ME: "Podgorica", MC: "Monaco", AD: "Andorra la Vella", SM: "San Marino", ZA: "Pretoria", EG: "Cairo", NG: "Abuja", KE: "Nairobi", MA: "Rabat", AO: "Luanda", MZ: "Maputo", GH: "Accra", ET: "Addis Ababa", SN: "Dakar", CM: "Yaoundé", TZ: "Dodoma", DZ: "Algiers", TN: "Tunis", CD: "Kinshasa", CI: "Yamoussoukro", ZW: "Harare", NA: "Windhoek", UG: "Kampala", ZM: "Lusaka", ML: "Bamako", MG: "Antananarivo", BW: "Gaborone", RW: "Kigali", CV: "Praia", MU: "Port Louis", SC: "Victoria", KM: "Moroni", ST: "São Tomé", CN: "Beijing", JP: "Tokyo", IN: "New Delhi", KR: "Seoul", TH: "Bangkok", VN: "Hanoi", ID: "Jakarta", PH: "Manila", MY: "Kuala Lumpur", SG: "Singapore", SA: "Riyadh", AE: "Abu Dhabi", IL: "Jerusalem", TR: "Ankara", PK: "Islamabad", BD: "Dhaka", NP: "Kathmandu", LK: "Sri Jayawardenepura Kotte", IR: "Tehran", IQ: "Baghdad", MN: "Ulaanbaatar", KZ: "Astana", UZ: "Tashkent", KH: "Phnom Penh", LA: "Vientiane", MM: "Naypyidaw", QA: "Doha", JO: "Amman", LB: "Beirut", SY: "Damascus", AF: "Kabul", BT: "Thimphu", MV: "Malé", BN: "Bandar Seri Begawan", TL: "Dili", BH: "Manama", AU: "Canberra", NZ: "Wellington", FJ: "Suva", PG: "Port Moresby", WS: "Apia", TO: "Nuku'alofa", VU: "Port Vila", SB: "Honiara", KI: "Tarawa", TV: "Funafuti", NR: "Yaren", MH: "Majuro", FM: "Palikir", PW: "Ngerulmud" };

/* Só as capitais que mudam de grafia. O resto usa a forma canônica. */
export const CAP_PT = { MX: "Cidade do México", US: "Washington", HT: "Porto Príncipe", TT: "Porto de Espanha", PT: "Lisboa", IT: "Roma", GB: "Londres", BE: "Bruxelas", CH: "Berna", AT: "Viena", GR: "Atenas", SE: "Estocolmo", DK: "Copenhague", PL: "Varsóvia", RU: "Moscou", UA: "Kiev", CZ: "Praga", RO: "Bucareste", HR: "Zagreb", RS: "Belgrado", LU: "Luxemburgo", CY: "Nicósia", AD: "Andorra-a-Velha", MC: "Mônaco", EG: "Cairo", ET: "Adis Abeba", DZ: "Argel", CI: "Yamoussoukro", MU: "Port Louis", CN: "Pequim", JP: "Tóquio", IN: "Nova Délhi", KR: "Seul", VN: "Hanói", ID: "Jacarta", SA: "Riade", IL: "Jerusalém", NP: "Catmandu", IR: "Teerã", IQ: "Bagdá", MN: "Ulan Bator", KH: "Pnom Pene", LB: "Beirute", SY: "Damasco", MV: "Malé", SG: "Singapura", IS: "Reiquiavique", BO: "Sucre", UY: "Montevidéu", PY: "Assunção", CR: "San José", PA: "Cidade do Panamá", GT: "Cidade da Guatemala" };

export const CAP_ES = { US: "Washington", MX: "Ciudad de México", HT: "Puerto Príncipe", TT: "Puerto España", PT: "Lisboa", IT: "Roma", GB: "Londres", BE: "Bruselas", CH: "Berna", AT: "Viena", GR: "Atenas", SE: "Estocolmo", DK: "Copenhague", PL: "Varsovia", RU: "Moscú", UA: "Kiev", CZ: "Praga", RO: "Bucarest", RS: "Belgrado", LU: "Luxemburgo", CY: "Nicosia", AD: "Andorra la Vieja", MC: "Mónaco", EG: "El Cairo", ET: "Adís Abeba", DZ: "Argel", CN: "Pekín", JP: "Tokio", IN: "Nueva Delhi", KR: "Seúl", VN: "Hanói", ID: "Yakarta", SA: "Riad", IL: "Jerusalén", NP: "Katmandú", IR: "Teherán", IQ: "Bagdad", MN: "Ulán Bator", KH: "Nom Pen", LB: "Beirut", SY: "Damasco", SG: "Singapur", IS: "Reikiavik", PY: "Asunción", PA: "Ciudad de Panamá", GT: "Ciudad de Guatemala" };
