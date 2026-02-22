// ── UK Universities ──
// Comprehensive list of recognised UK universities that offer law degrees
// or law-related courses. Grouped by region.
// Sources: Office for Students Register, HESA, UCAS, uniRank, Law Society of Scotland,
// Complete University Guide, Russell Group.

export interface UKUniversity {
  name: string;
  short: string;
  city: string;
  russellGroup?: boolean;
}

export type UKRegion =
  | "London"
  | "South East"
  | "South West"
  | "East of England"
  | "West Midlands"
  | "East Midlands"
  | "Yorkshire & Humber"
  | "North West"
  | "North East"
  | "Scotland"
  | "Wales"
  | "Northern Ireland";

export const UK_UNIVERSITIES_BY_REGION: Record<UKRegion, UKUniversity[]> = {
  // ═══════════════════════════════════════════════════════
  // LONDON
  // ═══════════════════════════════════════════════════════
  London: [
    { name: "University College London", short: "UCL", city: "London", russellGroup: true },
    { name: "King's College London", short: "KCL", city: "London", russellGroup: true },
    { name: "London School of Economics and Political Science", short: "LSE", city: "London", russellGroup: true },
    { name: "Queen Mary University of London", short: "QMUL", city: "London", russellGroup: true },
    { name: "Imperial College London", short: "Imperial", city: "London", russellGroup: true },
    { name: "SOAS, University of London", short: "SOAS", city: "London" },
    { name: "Birkbeck, University of London", short: "Birkbeck", city: "London" },
    { name: "City St George's, University of London", short: "City", city: "London" },
    { name: "Goldsmiths, University of London", short: "Goldsmiths", city: "London" },
    { name: "Royal Holloway, University of London", short: "RHUL", city: "Egham" },
    { name: "Brunel University London", short: "Brunel", city: "Uxbridge" },
    { name: "Kingston University", short: "Kingston", city: "Kingston upon Thames" },
    { name: "Middlesex University", short: "Middlesex", city: "London" },
    { name: "University of Greenwich", short: "Greenwich", city: "London" },
    { name: "University of East London", short: "UEL", city: "London" },
    { name: "London South Bank University", short: "LSBU", city: "London" },
    { name: "University of Westminster", short: "Westminster", city: "London" },
    { name: "London Metropolitan University", short: "London Met", city: "London" },
    { name: "University of West London", short: "UWL", city: "London" },
    { name: "University of Roehampton", short: "Roehampton", city: "London" },
    { name: "St Mary's University, Twickenham", short: "St Mary's", city: "Twickenham" },
    { name: "BPP University", short: "BPP", city: "London" },
    { name: "The University of Law", short: "ULaw", city: "London" },
    { name: "Regent's University London", short: "Regent's", city: "London" },
    { name: "Ravensbourne University London", short: "Ravensbourne", city: "London" },
    { name: "University of the Arts London", short: "UAL", city: "London" },
    { name: "London Business School", short: "LBS", city: "London" },
    { name: "Arden University", short: "Arden", city: "London" },
  ],

  // ═══════════════════════════════════════════════════════
  // SOUTH EAST
  // ═══════════════════════════════════════════════════════
  "South East": [
    { name: "University of Oxford", short: "Oxford", city: "Oxford", russellGroup: true },
    { name: "University of Southampton", short: "Southampton", city: "Southampton", russellGroup: true },
    { name: "University of Surrey", short: "Surrey", city: "Guildford" },
    { name: "University of Sussex", short: "Sussex", city: "Brighton" },
    { name: "University of Kent", short: "Kent", city: "Canterbury" },
    { name: "University of Reading", short: "Reading", city: "Reading" },
    { name: "University of Brighton", short: "Brighton", city: "Brighton" },
    { name: "University of Portsmouth", short: "Portsmouth", city: "Portsmouth" },
    { name: "Oxford Brookes University", short: "Oxford Brookes", city: "Oxford" },
    { name: "University of Buckingham", short: "Buckingham", city: "Buckingham" },
    { name: "Canterbury Christ Church University", short: "CCCU", city: "Canterbury" },
    { name: "University of Chichester", short: "Chichester", city: "Chichester" },
    { name: "University of Winchester", short: "Winchester", city: "Winchester" },
    { name: "Solent University", short: "Solent", city: "Southampton" },
    { name: "Buckinghamshire New University", short: "Bucks New", city: "High Wycombe" },
    { name: "University for the Creative Arts", short: "UCA", city: "Farnham" },
  ],

  // ═══════════════════════════════════════════════════════
  // SOUTH WEST
  // ═══════════════════════════════════════════════════════
  "South West": [
    { name: "University of Bristol", short: "Bristol", city: "Bristol", russellGroup: true },
    { name: "University of Exeter", short: "Exeter", city: "Exeter", russellGroup: true },
    { name: "University of Bath", short: "Bath", city: "Bath" },
    { name: "University of the West of England", short: "UWE", city: "Bristol" },
    { name: "University of Plymouth", short: "Plymouth", city: "Plymouth" },
    { name: "Bath Spa University", short: "Bath Spa", city: "Bath" },
    { name: "Bournemouth University", short: "Bournemouth", city: "Poole" },
    { name: "Arts University Bournemouth", short: "AUB", city: "Poole" },
    { name: "Falmouth University", short: "Falmouth", city: "Falmouth" },
    { name: "University of Gloucestershire", short: "Gloucestershire", city: "Cheltenham" },
    { name: "Plymouth Marjon University", short: "Marjon", city: "Plymouth" },
    { name: "Royal Agricultural University", short: "RAU", city: "Cirencester" },
    { name: "Arts University Plymouth", short: "AUP", city: "Plymouth" },
    { name: "Hartpury University", short: "Hartpury", city: "Gloucester" },
  ],

  // ═══════════════════════════════════════════════════════
  // EAST OF ENGLAND
  // ═══════════════════════════════════════════════════════
  "East of England": [
    { name: "University of Cambridge", short: "Cambridge", city: "Cambridge", russellGroup: true },
    { name: "University of East Anglia", short: "UEA", city: "Norwich" },
    { name: "University of Essex", short: "Essex", city: "Colchester" },
    { name: "University of Hertfordshire", short: "Herts", city: "Hatfield" },
    { name: "Anglia Ruskin University", short: "ARU", city: "Cambridge" },
    { name: "University of Bedfordshire", short: "Bedfordshire", city: "Luton" },
    { name: "University of Suffolk", short: "Suffolk", city: "Ipswich" },
    { name: "Norwich University of the Arts", short: "NUA", city: "Norwich" },
    { name: "Cranfield University", short: "Cranfield", city: "Cranfield" },
  ],

  // ═══════════════════════════════════════════════════════
  // WEST MIDLANDS
  // ═══════════════════════════════════════════════════════
  "West Midlands": [
    { name: "University of Birmingham", short: "Birmingham", city: "Birmingham", russellGroup: true },
    { name: "University of Warwick", short: "Warwick", city: "Coventry", russellGroup: true },
    { name: "Aston University", short: "Aston", city: "Birmingham" },
    { name: "Coventry University", short: "Coventry", city: "Coventry" },
    { name: "Birmingham City University", short: "BCU", city: "Birmingham" },
    { name: "University of Wolverhampton", short: "Wolverhampton", city: "Wolverhampton" },
    { name: "Staffordshire University", short: "Staffs", city: "Stoke-on-Trent" },
    { name: "University College Birmingham", short: "UCB", city: "Birmingham" },
    { name: "Birmingham Newman University", short: "Newman", city: "Birmingham" },
    { name: "University of Worcester", short: "Worcester", city: "Worcester" },
    { name: "Harper Adams University", short: "Harper Adams", city: "Newport" },
    { name: "Keele University", short: "Keele", city: "Keele" },
  ],

  // ═══════════════════════════════════════════════════════
  // EAST MIDLANDS
  // ═══════════════════════════════════════════════════════
  "East Midlands": [
    { name: "University of Nottingham", short: "Nottingham", city: "Nottingham", russellGroup: true },
    { name: "University of Leicester", short: "Leicester", city: "Leicester" },
    { name: "Loughborough University", short: "Loughborough", city: "Loughborough" },
    { name: "Nottingham Trent University", short: "NTU", city: "Nottingham" },
    { name: "De Montfort University", short: "DMU", city: "Leicester" },
    { name: "University of Derby", short: "Derby", city: "Derby" },
    { name: "University of Lincoln", short: "Lincoln", city: "Lincoln" },
    { name: "University of Northampton", short: "Northampton", city: "Northampton" },
  ],

  // ═══════════════════════════════════════════════════════
  // YORKSHIRE & HUMBER
  // ═══════════════════════════════════════════════════════
  "Yorkshire & Humber": [
    { name: "University of Leeds", short: "Leeds", city: "Leeds", russellGroup: true },
    { name: "University of Sheffield", short: "Sheffield", city: "Sheffield", russellGroup: true },
    { name: "University of York", short: "York", city: "York", russellGroup: true },
    { name: "University of Hull", short: "Hull", city: "Hull" },
    { name: "University of Bradford", short: "Bradford", city: "Bradford" },
    { name: "University of Huddersfield", short: "Huddersfield", city: "Huddersfield" },
    { name: "Sheffield Hallam University", short: "Sheffield Hallam", city: "Sheffield" },
    { name: "Leeds Beckett University", short: "Leeds Beckett", city: "Leeds" },
    { name: "Leeds Trinity University", short: "Leeds Trinity", city: "Leeds" },
    { name: "York St John University", short: "York St John", city: "York" },
    { name: "Teesside University", short: "Teesside", city: "Middlesbrough" },
  ],

  // ═══════════════════════════════════════════════════════
  // NORTH WEST
  // ═══════════════════════════════════════════════════════
  "North West": [
    { name: "University of Manchester", short: "Manchester", city: "Manchester", russellGroup: true },
    { name: "University of Liverpool", short: "Liverpool", city: "Liverpool", russellGroup: true },
    { name: "Lancaster University", short: "Lancaster", city: "Lancaster" },
    { name: "University of Chester", short: "Chester", city: "Chester" },
    { name: "University of Salford", short: "Salford", city: "Salford" },
    { name: "Manchester Metropolitan University", short: "MMU", city: "Manchester" },
    { name: "Liverpool John Moores University", short: "LJMU", city: "Liverpool" },
    { name: "Liverpool Hope University", short: "Liverpool Hope", city: "Liverpool" },
    { name: "University of Central Lancashire", short: "UCLan", city: "Preston" },
    { name: "Edge Hill University", short: "Edge Hill", city: "Ormskirk" },
    { name: "University of Bolton", short: "Bolton", city: "Bolton" },
    { name: "University of Cumbria", short: "Cumbria", city: "Carlisle" },
  ],

  // ═══════════════════════════════════════════════════════
  // NORTH EAST
  // ═══════════════════════════════════════════════════════
  "North East": [
    { name: "Durham University", short: "Durham", city: "Durham", russellGroup: true },
    { name: "Newcastle University", short: "Newcastle", city: "Newcastle upon Tyne", russellGroup: true },
    { name: "Northumbria University", short: "Northumbria", city: "Newcastle upon Tyne" },
    { name: "University of Sunderland", short: "Sunderland", city: "Sunderland" },
  ],

  // ═══════════════════════════════════════════════════════
  // SCOTLAND
  // ═══════════════════════════════════════════════════════
  Scotland: [
    { name: "University of Edinburgh", short: "Edinburgh", city: "Edinburgh", russellGroup: true },
    { name: "University of Glasgow", short: "Glasgow", city: "Glasgow", russellGroup: true },
    { name: "University of St Andrews", short: "St Andrews", city: "St Andrews" },
    { name: "University of Aberdeen", short: "Aberdeen", city: "Aberdeen" },
    { name: "University of Dundee", short: "Dundee", city: "Dundee" },
    { name: "University of Strathclyde", short: "Strathclyde", city: "Glasgow" },
    { name: "University of Stirling", short: "Stirling", city: "Stirling" },
    { name: "Heriot-Watt University", short: "Heriot-Watt", city: "Edinburgh" },
    { name: "Edinburgh Napier University", short: "Edinburgh Napier", city: "Edinburgh" },
    { name: "Glasgow Caledonian University", short: "GCU", city: "Glasgow" },
    { name: "Robert Gordon University", short: "RGU", city: "Aberdeen" },
    { name: "Abertay University", short: "Abertay", city: "Dundee" },
    { name: "University of the West of Scotland", short: "UWS", city: "Paisley" },
    { name: "Queen Margaret University", short: "QMU", city: "Edinburgh" },
    { name: "University of the Highlands and Islands", short: "UHI", city: "Inverness" },
    { name: "Scotland's Rural College", short: "SRUC", city: "Edinburgh" },
    { name: "The Glasgow School of Art", short: "GSA", city: "Glasgow" },
    { name: "Royal Conservatoire of Scotland", short: "RCS", city: "Glasgow" },
  ],

  // ═══════════════════════════════════════════════════════
  // WALES
  // ═══════════════════════════════════════════════════════
  Wales: [
    { name: "Cardiff University", short: "Cardiff", city: "Cardiff", russellGroup: true },
    { name: "Swansea University", short: "Swansea", city: "Swansea" },
    { name: "Aberystwyth University", short: "Aberystwyth", city: "Aberystwyth" },
    { name: "Bangor University", short: "Bangor", city: "Bangor" },
    { name: "University of South Wales", short: "USW", city: "Pontypridd" },
    { name: "Cardiff Metropolitan University", short: "Cardiff Met", city: "Cardiff" },
    { name: "University of Wales Trinity Saint David", short: "UWTSD", city: "Carmarthen" },
    { name: "Wrexham University", short: "Wrexham", city: "Wrexham" },
  ],

  // ═══════════════════════════════════════════════════════
  // NORTHERN IRELAND
  // ═══════════════════════════════════════════════════════
  "Northern Ireland": [
    { name: "Queen's University Belfast", short: "QUB", city: "Belfast", russellGroup: true },
    { name: "Ulster University", short: "Ulster", city: "Belfast" },
  ],
};

// ── Flattened array of all universities ──
export const UK_UNIVERSITIES: UKUniversity[] = Object.values(
  UK_UNIVERSITIES_BY_REGION
).flat();

// ── Region list ──
export const UK_REGIONS: UKRegion[] = Object.keys(
  UK_UNIVERSITIES_BY_REGION
) as UKRegion[];

// ── Russell Group only ──
export const RUSSELL_GROUP_UNIVERSITIES: UKUniversity[] =
  UK_UNIVERSITIES.filter((u) => u.russellGroup);

// ── Search helper ──
export function searchUniversities(query: string): UKUniversity[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return UK_UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.short.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
  );
}

// ── Get region for a university ──
export function getUniversityRegion(
  universityName: string
): UKRegion | undefined {
  for (const [region, universities] of Object.entries(
    UK_UNIVERSITIES_BY_REGION
  )) {
    if (universities.some((u) => u.name === universityName)) {
      return region as UKRegion;
    }
  }
  return undefined;
}
