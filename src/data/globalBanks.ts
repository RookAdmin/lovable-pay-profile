export interface GlobalBank {
  name: string;
  country: string;
  swiftCode?: string;
}

export const globalBanks: GlobalBank[] = [
  // A
  { name: "ABN AMRO", country: "Netherlands", swiftCode: "ABNANL2A" },
  { name: "Access Bank", country: "Nigeria", swiftCode: "ABNGNGLA" },
  { name: "Agricultural Bank of China", country: "China", swiftCode: "ABOCCNBJ" },
  { name: "Allied Irish Banks", country: "Ireland", swiftCode: "AIBKIE2D" },
  { name: "Alpha Bank", country: "Greece", swiftCode: "CRBAGRAA" },
  { name: "ANZ (Australia and New Zealand Banking Group)", country: "Australia", swiftCode: "ANZBAU3M" },
  { name: "Axis Bank", country: "India", swiftCode: "AXISINBB" },
  
  // B
  { name: "Banco Bradesco", country: "Brazil", swiftCode: "BBDEBRSP" },
  { name: "Banco de Bogotá", country: "Colombia", swiftCode: "BANBCOBB" },
  { name: "Banco de Chile", country: "Chile", swiftCode: "BCHICLRM" },
  { name: "Banco do Brasil", country: "Brazil", swiftCode: "BRASBRRJ" },
  { name: "Banco Santander", country: "Spain", swiftCode: "BSCHESMM" },
  { name: "Bangkok Bank", country: "Thailand", swiftCode: "BKKBTHBK" },
  { name: "Bank al Habib", country: "Pakistan", swiftCode: "BAHLPKKA" },
  { name: "Bank Mandiri", country: "Indonesia", swiftCode: "BMRIIDJA" },
  { name: "Bank of America", country: "United States", swiftCode: "BOFAUS3N" },
  { name: "Bank of Baroda", country: "India", swiftCode: "BARBINBB" },
  { name: "Bank of Ceylon", country: "Sri Lanka", swiftCode: "BCEYLKLX" },
  { name: "Bank of China", country: "China", swiftCode: "BKCHCNBJ" },
  { name: "Bank of Ireland", country: "Ireland", swiftCode: "BOFIIE2D" },
  { name: "Bank of Montreal", country: "Canada", swiftCode: "BOFMCAM2" },
  { name: "Bank of New Zealand", country: "New Zealand", swiftCode: "BKNZNZ22" },
  { name: "Bank of Scotland", country: "United Kingdom", swiftCode: "BOFSGBS1" },
  { name: "Bank of Tokyo-Mitsubishi UFJ", country: "Japan", swiftCode: "BOTKJPJT" },
  { name: "Barclays", country: "United Kingdom", swiftCode: "BARCGB22" },
  { name: "BBVA", country: "Spain", swiftCode: "BBVAESMM" },
  { name: "BDO Unibank", country: "Philippines", swiftCode: "BNORPHMM" },
  { name: "BNP Paribas", country: "France", swiftCode: "BNPAFRPP" },
  { name: "BMO (Bank of Montreal)", country: "Canada", swiftCode: "BOFMCAM2" },
  { name: "BRI (Bank Rakyat Indonesia)", country: "Indonesia", swiftCode: "BRINIDJA" },
  
  // C
  { name: "CaixaBank", country: "Spain", swiftCode: "CAIXESBB" },
  { name: "Canara Bank", country: "India", swiftCode: "CNRBINBB" },
  { name: "Capital One", country: "United States", swiftCode: "HIBKUS44" },
  { name: "CIBC (Canadian Imperial Bank of Commerce)", country: "Canada", swiftCode: "CIBCCATT" },
  { name: "Citibank", country: "United States", swiftCode: "CITIUS33" },
  { name: "Commerzbank", country: "Germany", swiftCode: "COBADEFF" },
  { name: "Commonwealth Bank", country: "Australia", swiftCode: "CTBAAU2S" },
  { name: "Crédit Agricole", country: "France", swiftCode: "AGRIFRPP" },
  { name: "Credit Suisse", country: "Switzerland", swiftCode: "CRESCHZZ" },
  
  // D
  { name: "Danske Bank", country: "Denmark", swiftCode: "DABADKKK" },
  { name: "DBS Bank", country: "Singapore", swiftCode: "DBSSSGSG" },
  { name: "Deutsche Bank", country: "Germany", swiftCode: "DEUTDEFF" },
  { name: "Dubai Islamic Bank", country: "UAE", swiftCode: "DUIBAEAD" },
  { name: "DZ Bank", country: "Germany", swiftCode: "GENODEFF" },
  
  // E
  { name: "Emirates NBD", country: "UAE", swiftCode: "EBILAEAD" },
  { name: "Erste Bank", country: "Austria", swiftCode: "GIBAATWW" },
  
  // F
  { name: "Federal Bank", country: "India", swiftCode: "FDRLINBB" },
  { name: "First Abu Dhabi Bank", country: "UAE", swiftCode: "NBADAEAD" },
  { name: "First Bank of Nigeria", country: "Nigeria", swiftCode: "FBNINGLA" },
  
  // G
  { name: "Goldman Sachs", country: "United States", swiftCode: "GSBLUS33" },
  { name: "Guaranty Trust Bank", country: "Nigeria", swiftCode: "GTBINGLA" },
  
  // H
  { name: "Habib Bank Limited", country: "Pakistan", swiftCode: "HABBPKKA" },
  { name: "HDFC Bank", country: "India", swiftCode: "HDFCINBB" },
  { name: "HSBC", country: "United Kingdom", swiftCode: "HSBCGB2L" },
  
  // I
  { name: "ICICI Bank", country: "India", swiftCode: "ICICINBB" },
  { name: "IDBI Bank", country: "India", swiftCode: "IBKLINBB" },
  { name: "ING Bank", country: "Netherlands", swiftCode: "INGBNL2A" },
  { name: "Intesa Sanpaolo", country: "Italy", swiftCode: "BCITITMMXXX" },
  
  // J
  { name: "JPMorgan Chase", country: "United States", swiftCode: "CHASUS33" },
  
  // K
  { name: "KBC Bank", country: "Belgium", swiftCode: "KREDBEBB" },
  { name: "KB Kookmin Bank", country: "South Korea", swiftCode: "CZNBKRSE" },
  { name: "Kotak Mahindra Bank", country: "India", swiftCode: "KKBKINBB" },
  
  // L
  { name: "Lloyds Bank", country: "United Kingdom", swiftCode: "LOYDGB2L" },
  
  // M
  { name: "Mashreq Bank", country: "UAE", swiftCode: "BOMLAEAD" },
  { name: "Maybank", country: "Malaysia", swiftCode: "MBBEMYKL" },
  { name: "MCB Bank", country: "Pakistan", swiftCode: "MUCBPKKA" },
  { name: "Mitsubishi UFJ Financial Group", country: "Japan", swiftCode: "BOTKJPJT" },
  { name: "Mizuho Bank", country: "Japan", swiftCode: "MHCBJPJT" },
  { name: "Morgan Stanley", country: "United States", swiftCode: "MSNYUS33" },
  
  // N
  { name: "National Australia Bank", country: "Australia", swiftCode: "NATAAU3303M" },
  { name: "National Bank of Egypt", country: "Egypt", swiftCode: "NBEGEGCX" },
  { name: "NatWest", country: "United Kingdom", swiftCode: "NWBKGB2L" },
  { name: "Nordea Bank", country: "Sweden", swiftCode: "NDEASESS" },
  
  // O
  { name: "OCBC Bank", country: "Singapore", swiftCode: "OCBCSGSG" },
  
  // P
  { name: "PNB (Punjab National Bank)", country: "India", swiftCode: "PUNBINBB" },
  { name: "Public Bank", country: "Malaysia", swiftCode: "PBBEMYKL" },
  
  // Q
  { name: "Qatar National Bank", country: "Qatar", swiftCode: "QNBAQAQA" },
  
  // R
  { name: "Rabobank", country: "Netherlands", swiftCode: "RABONL2U" },
  { name: "Raiffeisen Bank", country: "Austria", swiftCode: "RZBAATWW" },
  { name: "Royal Bank of Canada", country: "Canada", swiftCode: "ROYCCAT2" },
  { name: "Royal Bank of Scotland", country: "United Kingdom", swiftCode: "RBOSGB2L" },
  
  // S
  { name: "Santander Bank", country: "Spain", swiftCode: "BSCHESMM" },
  { name: "SBI (State Bank of India)", country: "India", swiftCode: "SBININBB" },
  { name: "Scotiabank", country: "Canada", swiftCode: "NOSCCATT" },
  { name: "Shinhan Bank", country: "South Korea", swiftCode: "SHBKKRSE" },
  { name: "Société Générale", country: "France", swiftCode: "SOGEFRPP" },
  { name: "Standard Bank", country: "South Africa", swiftCode: "SBZAZAJJ" },
  { name: "Standard Chartered", country: "United Kingdom", swiftCode: "SCBLGB2L" },
  { name: "Sumitomo Mitsui Banking Corporation", country: "Japan", swiftCode: "SMBCJPJT" },
  { name: "SunTrust Bank", country: "United States", swiftCode: "SNTRUS3A" },
  { name: "Swedbank", country: "Sweden", swiftCode: "SWEDSESS" },
  
  // T
  { name: "TD Bank", country: "Canada", swiftCode: "TDOMCATTTOR" },
  
  // U
  { name: "UBS", country: "Switzerland", swiftCode: "UBSWCHZH" },
  { name: "Union Bank of India", country: "India", swiftCode: "UBININBB" },
  { name: "United Bank Limited", country: "Pakistan", swiftCode: "UNILPKKA" },
  { name: "UOB (United Overseas Bank)", country: "Singapore", swiftCode: "UOVBSGSG" },
  { name: "US Bank", country: "United States", swiftCode: "USBKUS44" },
  
  // W
  { name: "Wells Fargo", country: "United States", swiftCode: "WFBIUS6S" },
  { name: "Westpac", country: "Australia", swiftCode: "WPACAU2S" },
  
  // Y
  { name: "Yes Bank", country: "India", swiftCode: "YESBINBB" },
  
  // Z
  { name: "Zenith Bank", country: "Nigeria", swiftCode: "ZEIBNGLA" },
  { name: "Ziraat Bank", country: "Turkey", swiftCode: "TCZBTR2A" },
  
  // Additional Major Banks
  { name: "Al Rajhi Bank", country: "Saudi Arabia", swiftCode: "RJHISARI" },
  { name: "Banque Misr", country: "Egypt", swiftCode: "BMISEGCX" },
  { name: "Bank Alfalah", country: "Pakistan", swiftCode: "ALFHPKKA" },
  { name: "Bank Islam Malaysia", country: "Malaysia", swiftCode: "BIMBMYKL" },
  { name: "Citi India", country: "India", swiftCode: "CITIINBX" },
  { name: "First National Bank", country: "South Africa", swiftCode: "FIRNZAJJ" },
  { name: "IndusInd Bank", country: "India", swiftCode: "INDBINBB" },
  { name: "KDB Bank", country: "South Korea", swiftCode: "KODBKRSE" },
  { name: "National Commercial Bank", country: "Saudi Arabia", swiftCode: "NCBKSAJE" },
  { name: "Nedbank", country: "South Africa", swiftCode: "NEDSZAJJ" },
  { name: "RHB Bank", country: "Malaysia", swiftCode: "RHBBMYKL" },
  { name: "Samba Financial Group", country: "Saudi Arabia", swiftCode: "SAMBSARI" },
  { name: "United Bank for Africa", country: "Nigeria", swiftCode: "UNAFNGLA" },
  { name: "Woori Bank", country: "South Korea", swiftCode: "HVBKKRSEXXX" },
  { name: "Banco de la Nación", country: "Peru", swiftCode: "BNAPPEPL" },
  { name: "Bancolombia", country: "Colombia", swiftCode: "COLOCOBM" },
  { name: "Banco Galicia", country: "Argentina", swiftCode: "GABAARBA" },
  { name: "Banco Itaú", country: "Brazil", swiftCode: "ITAUBRSP" },
  { name: "Banco Macro", country: "Argentina", swiftCode: "MACRARBA" },
  { name: "Banorte", country: "Mexico", swiftCode: "MENOMXMT" },
  { name: "BBVA México", country: "Mexico", swiftCode: "BCMRMXMM" },
  { name: "Scotiabank México", country: "Mexico", swiftCode: "MBCOMXMM" },
  { name: "Absa Bank", country: "South Africa", swiftCode: "ABSAZAJJ" },
  { name: "African Bank", country: "South Africa", swiftCode: "AFIRZAJJ" },
  { name: "Capitec Bank", country: "South Africa", swiftCode: "CABLZAJJ" },
  { name: "Bank of Africa", country: "Morocco", swiftCode: "BMCEMAMC" },
  { name: "Attijariwafa Bank", country: "Morocco", swiftCode: "BCMAMAMC" },
  { name: "Commercial Bank of Ethiopia", country: "Ethiopia", swiftCode: "CBETETAA" },
  { name: "KCB Bank", country: "Kenya", swiftCode: "KCBLKENX" },
  { name: "Equity Bank", country: "Kenya", swiftCode: "EQBLKENA" },
  { name: "Stanbic Bank", country: "Kenya", swiftCode: "SBICKENX" },
  { name: "Ecobank", country: "Togo", swiftCode: "ECOCMLBA" },
  { name: "Bank of Kigali", country: "Rwanda", swiftCode: "BKIGRWRW" },
  { name: "Crédit du Maroc", country: "Morocco", swiftCode: "CDMAMAMC" },
  { name: "Commercial International Bank", country: "Egypt", swiftCode: "CIBEEGCX" },
  { name: "Arab African International Bank", country: "Egypt", swiftCode: "ARAIEGCX" },
  { name: "Banque Centrale Populaire", country: "Morocco", swiftCode: "BCPOMAMC" },
  { name: "Habib Bank AG Zurich", country: "Switzerland", swiftCode: "HBZUCHZZ" },
  { name: "PostFinance", country: "Switzerland", swiftCode: "POFICHBE" },
  { name: "Raiffeisen Switzerland", country: "Switzerland", swiftCode: "RAIFCH22" },
  { name: "Zürcher Kantonalbank", country: "Switzerland", swiftCode: "ZKBKCHZZ" },
  { name: "UniCredit Bank", country: "Italy", swiftCode: "UNCRITMM" },
  { name: "Banca Monte dei Paschi di Siena", country: "Italy", swiftCode: "PASCITM1" },
  { name: "Banco BPM", country: "Italy", swiftCode: "BAPPIT21" },
  { name: "Mediobanca", country: "Italy", swiftCode: "MEBIITM1" },
  { name: "Banca Popolare di Sondrio", country: "Italy", swiftCode: "POSOIT22" },
  { name: "BNL (Banca Nazionale del Lavoro)", country: "Italy", swiftCode: "BNLIITRR" },
  { name: "La Banque Postale", country: "France", swiftCode: "PSSTFRPP" },
  { name: "Banque Populaire", country: "France", swiftCode: "CCBPFRPP" },
  { name: "Caisse d'Épargne", country: "France", swiftCode: "CEPAFRPP" },
  { name: "CIC (Crédit Industriel et Commercial)", country: "France", swiftCode: "CMCIFRPP" },
  { name: "LCL (Le Crédit Lyonnais)", country: "France", swiftCode: "LYCLFRPP" },
  { name: "Natixis", country: "France", swiftCode: "NATXFRPP" },
  { name: "Banque Tarneaud", country: "France", swiftCode: "TARNFRPP" },
  { name: "HypoVereinsbank", country: "Germany", swiftCode: "HYVEDEMM" },
  { name: "Landesbank Baden-Württemberg", country: "Germany", swiftCode: "SOLADEST" },
  { name: "Bayerische Landesbank", country: "Germany", swiftCode: "BYLADEMM" },
  { name: "Norddeutsche Landesbank", country: "Germany", swiftCode: "NOLADE2H" },
  { name: "KfW", country: "Germany", swiftCode: "KFWIDEFF" },
  { name: "Postbank", country: "Germany", swiftCode: "PBNKDEFF" },
  { name: "Targobank", country: "Germany", swiftCode: "CMCIDEDD" },
  { name: "Santander Consumer Bank", country: "Germany", swiftCode: "SCFBDE33" },
  { name: "ING-DiBa", country: "Germany", swiftCode: "INGDDEFF" },
  { name: "Comdirect Bank", country: "Germany", swiftCode: "COBADEHD" },
  { name: "Halifax", country: "United Kingdom", swiftCode: "HLFXGB21" },
  { name: "Nationwide Building Society", country: "United Kingdom", swiftCode: "NAIAGB21" },
  { name: "Santander UK", country: "United Kingdom", swiftCode: "ABBYGB2L" },
  { name: "TSB Bank", country: "United Kingdom", swiftCode: "TSBSGB2A" },
  { name: "Metro Bank", country: "United Kingdom", swiftCode: "MYMGGB2L" },
  { name: "Monzo Bank", country: "United Kingdom", swiftCode: "MONZGB2L" },
  { name: "Starling Bank", country: "United Kingdom", swiftCode: "SRLGGB2L" },
  { name: "Revolut", country: "United Kingdom", swiftCode: "REVOGB21" },
  { name: "Bank of Ireland UK", country: "United Kingdom", swiftCode: "BOFIIE2D" },
  { name: "Clydesdale Bank", country: "United Kingdom", swiftCode: "CLYDGB2B" },
  { name: "AIB (Allied Irish Banks)", country: "Ireland", swiftCode: "AIBKIE2D" },
  { name: "Permanent TSB", country: "Ireland", swiftCode: "IPBSIE2D" },
  { name: "Ulster Bank Ireland", country: "Ireland", swiftCode: "ULSBIE2D" },
  { name: "KBC Bank Ireland", country: "Ireland", swiftCode: "KREDIE22" },
  { name: "ABN AMRO Private Banking", country: "Netherlands", swiftCode: "ABNPNL2A" },
  { name: "Triodos Bank", country: "Netherlands", swiftCode: "TRIONL2U" },
  { name: "SNS Bank", country: "Netherlands", swiftCode: "SNSBNL2A" },
  { name: "ASN Bank", country: "Netherlands", swiftCode: "ASNBNL21" },
  { name: "RegioBank", country: "Netherlands", swiftCode: "RBRBNL21" },
  { name: "Argenta", country: "Belgium", swiftCode: "ARSPBE22" },
  { name: "Belfius Bank", country: "Belgium", swiftCode: "GKCCBEBB" },
  { name: "BNP Paribas Fortis", country: "Belgium", swiftCode: "GEBABEBB" },
  { name: "Bank Pekao", country: "Poland", swiftCode: "PKOPPLPW" },
  { name: "PKO Bank Polski", country: "Poland", swiftCode: "BPKOPLPW" },
  { name: "mBank", country: "Poland", swiftCode: "BREXPLPW" },
  { name: "ING Bank Śląski", country: "Poland", swiftCode: "INGBPLPW" },
  { name: "Santander Bank Polska", country: "Poland", swiftCode: "WBKPPLPP" },
  { name: "Česká spořitelna", country: "Czech Republic", swiftCode: "GIBACZPX" },
  { name: "Komerční banka", country: "Czech Republic", swiftCode: "KOMBCZPP" },
  { name: "ČSOB", country: "Czech Republic", swiftCode: "CEKOCZPP" },
  { name: "Raiffeisenbank Czech Republic", country: "Czech Republic", swiftCode: "RZBCCZPP" },
  { name: "Tatra banka", country: "Slovakia", swiftCode: "TATRSKBX" },
  { name: "Slovenská sporiteľňa", country: "Slovakia", swiftCode: "GIBASKBX" },
  { name: "VÚB banka", country: "Slovakia", swiftCode: "SUBASKBX" },
  { name: "OTP Bank", country: "Hungary", swiftCode: "OTPVHUHB" },
  { name: "K&H Bank", country: "Hungary", swiftCode: "KHBHUHBB" },
  { name: "Raiffeisen Bank Hungary", country: "Hungary", swiftCode: "UBRTHUHB" },
  { name: "Banca Transilvania", country: "Romania", swiftCode: "BTRLRO22" },
  { name: "BCR (Banca Comercială Română)", country: "Romania", swiftCode: "RNCBROBU" },
  { name: "BRD - Groupe Société Générale", country: "Romania", swiftCode: "BRDEROBU" },
  { name: "Raiffeisen Bank Romania", country: "Romania", swiftCode: "RZBROBU1" },
  { name: "Piraeus Bank", country: "Greece", swiftCode: "PIRBGRAA" },
  { name: "National Bank of Greece", country: "Greece", swiftCode: "ETHNGRAA" },
  { name: "Eurobank", country: "Greece", swiftCode: "ERBKGRAA" },
  { name: "Garanti BBVA", country: "Turkey", swiftCode: "TGBATRIS" },
  { name: "İş Bankası", country: "Turkey", swiftCode: "ISBKTRIS" },
  { name: "Yapı Kredi", country: "Turkey", swiftCode: "YAPITRIS" },
  { name: "Akbank", country: "Turkey", swiftCode: "AKBKTRIS" },
  { name: "Halkbank", country: "Turkey", swiftCode: "TRHBTR2A" },
  { name: "VakıfBank", country: "Turkey", swiftCode: "TVBATR2A" },
  { name: "DenizBank", country: "Turkey", swiftCode: "DENITRIS" },
  { name: "Sberbank", country: "Russia", swiftCode: "SABRRUMM" },
  { name: "VTB Bank", country: "Russia", swiftCode: "VTBRRUM2" },
  { name: "Gazprombank", country: "Russia", swiftCode: "GAZPRUM3" },
  { name: "Alfa-Bank", country: "Russia", swiftCode: "ALFARUMM" },
  { name: "Bank of Communications", country: "China", swiftCode: "COMMCNSH" },
  { name: "China Construction Bank", country: "China", swiftCode: "PCBCCNBJ" },
  { name: "ICBC (Industrial and Commercial Bank of China)", country: "China", swiftCode: "ICBKCNBJ" },
  { name: "China Merchants Bank", country: "China", swiftCode: "CMBCCNBS" },
  { name: "Postal Savings Bank of China", country: "China", swiftCode: "PSBC" },
  { name: "China Minsheng Bank", country: "China", swiftCode: "MSBCCNBJ" },
  { name: "China CITIC Bank", country: "China", swiftCode: "CITCCNBJ" },
  { name: "Ping An Bank", country: "China", swiftCode: "SZDBCNBS" },
  { name: "China Everbright Bank", country: "China", swiftCode: "EVERCNBJ" },
  { name: "Hua Xia Bank", country: "China", swiftCode: "HXBKCNBJ" },
  { name: "Bank of Beijing", country: "China", swiftCode: "BJCNCNBJ" },
  { name: "Bank of Nanjing", country: "China", swiftCode: "NJCBCN2N" },
  { name: "Bank of Shanghai", country: "China", swiftCode: "BOSHCNSH" },
  { name: "Industrial Bank", country: "China", swiftCode: "FJIBCNBA" },
  { name: "Resona Bank", country: "Japan", swiftCode: "DIWAJPJT" },
  { name: "Sumitomo Mitsui Trust Bank", country: "Japan", swiftCode: "SMTCJPJT" },
  { name: "Japan Post Bank", country: "Japan", swiftCode: "JPPSJPJ1" },
  { name: "Norinchukin Bank", country: "Japan", swiftCode: "NOCUJPJT" },
  { name: "Hana Bank", country: "South Korea", swiftCode: "KOEXKRSE" },
  { name: "IBK (Industrial Bank of Korea)", country: "South Korea", swiftCode: "IBKOKRSE" },
  { name: "Kookmin Bank", country: "South Korea", swiftCode: "CZNBKRSE" },
  { name: "Bank Negara Indonesia", country: "Indonesia", swiftCode: "BNINIDJA" },
  { name: "Bank Central Asia", country: "Indonesia", swiftCode: "CENAIDJA" },
  { name: "Bank Danamon", country: "Indonesia", swiftCode: "BDINIDJA" },
  { name: "CIMB Niaga", country: "Indonesia", swiftCode: "BNIAIDJA" },
  { name: "Permata Bank", country: "Indonesia", swiftCode: "BBBAIDJA" },
  { name: "Kasikornbank", country: "Thailand", swiftCode: "KASITHBK" },
  { name: "Krung Thai Bank", country: "Thailand", swiftCode: "KRTHTHBK" },
  { name: "Siam Commercial Bank", country: "Thailand", swiftCode: "SICOTHBK" },
  { name: "Bank of Ayudhya", country: "Thailand", swiftCode: "AYUDTHBK" },
  { name: "TMB Bank", country: "Thailand", swiftCode: "TMBKTHBK" },
  { name: "CIMB Bank", country: "Malaysia", swiftCode: "CIBBMYKL" },
  { name: "AmBank", country: "Malaysia", swiftCode: "ARBKMYKL" },
  { name: "Hong Leong Bank", country: "Malaysia", swiftCode: "HLBBMYKL" },
  { name: "Affin Bank", country: "Malaysia", swiftCode: "PHBMMYKL" },
  { name: "Alliance Bank", country: "Malaysia", swiftCode: "MFBBMYKL" },
  { name: "HSBC Bank Malaysia", country: "Malaysia", swiftCode: "HBMBMYKL" },
  { name: "Standard Chartered Malaysia", country: "Malaysia", swiftCode: "SCBLMYKX" },
  { name: "Citibank Malaysia", country: "Malaysia", swiftCode: "CITIMYKL" },
  { name: "Bank of China (Hong Kong)", country: "Hong Kong", swiftCode: "BKCHHKHH" },
  { name: "Hang Seng Bank", country: "Hong Kong", swiftCode: "HASEHKHH" },
  { name: "Bank of East Asia", country: "Hong Kong", swiftCode: "BEASHKHH" },
  { name: "Standard Chartered Hong Kong", country: "Hong Kong", swiftCode: "SCBLHKHH" },
  { name: "HSBC Hong Kong", country: "Hong Kong", swiftCode: "HSBCHKHH" },
  { name: "Citibank Hong Kong", country: "Hong Kong", swiftCode: "CITIHKHX" },
  { name: "DBS Bank Hong Kong", country: "Hong Kong", swiftCode: "DBSSHKHH" },
  { name: "ICBC (Asia)", country: "Hong Kong", swiftCode: "UBHKHKHH" },
  { name: "Bank of China (Macau)", country: "Macau", swiftCode: "BKCHMOMX" },
  { name: "HSBC Macau", country: "Macau", swiftCode: "HSBCMOMX" },
  { name: "BPI (Bank of the Philippine Islands)", country: "Philippines", swiftCode: "BOPIPHMM" },
  { name: "Metrobank", country: "Philippines", swiftCode: "MBTCPHMM" },
  { name: "Land Bank of the Philippines", country: "Philippines", swiftCode: "TLBPPHMM" },
  { name: "Philippine National Bank", country: "Philippines", swiftCode: "PNBMPHMM" },
  { name: "Security Bank", country: "Philippines", swiftCode: "SETCPHMM" },
  { name: "UnionBank", country: "Philippines", swiftCode: "UBPHPHMM" },
  { name: "Chinabank", country: "Philippines", swiftCode: "CHBKPHMM" },
  { name: "Banco de Oro (BDO)", country: "Philippines", swiftCode: "BNORPHMM" },
  { name: "Vietcombank", country: "Vietnam", swiftCode: "BFTVVNVX" },
  { name: "BIDV", country: "Vietnam", swiftCode: "BIDVVNVX" },
  { name: "VietinBank", country: "Vietnam", swiftCode: "ICBVVNVX" },
  { name: "Techcombank", country: "Vietnam", swiftCode: "VTCBVNVX" },
  { name: "ACB (Asia Commercial Bank)", country: "Vietnam", swiftCode: "ASCBVNVX" },
  { name: "Sacombank", country: "Vietnam", swiftCode: "SGTTVNVX" },
  { name: "MB Bank", country: "Vietnam", swiftCode: "MSCBVNVX" },
  { name: "VPBank", country: "Vietnam", swiftCode: "VPBKVNVX" },
  { name: "ANZ Bank (Taiwan)", country: "Taiwan", swiftCode: "ANZBTWTX" },
  { name: "Bank of Taiwan", country: "Taiwan", swiftCode: "BKTWTWTP" },
  { name: "First Commercial Bank", country: "Taiwan", swiftCode: "FCBKTWTP" },
  { name: "Mega International Commercial Bank", country: "Taiwan", swiftCode: "ICBCTWTP" },
  { name: "Cathay United Bank", country: "Taiwan", swiftCode: "UWCBTWTP" },
  { name: "CTBC Bank", country: "Taiwan", swiftCode: "CTCBTWTP" },
  { name: "E.SUN Commercial Bank", country: "Taiwan", swiftCode: "ESUNTWTP" },
  { name: "Taishin International Bank", country: "Taiwan", swiftCode: "TSIBTWTP" },
];

// Helper function to format bank for display
export const formatBankDisplay = (bank: GlobalBank): string => {
  return `${bank.name} (${bank.country})`;
};

// Helper function to search banks
export const searchBanks = (query: string, banks: GlobalBank[] = globalBanks): GlobalBank[] => {
  if (!query) return banks;
  
  const lowerQuery = query.toLowerCase();
  return banks.filter(
    bank =>
      bank.name.toLowerCase().includes(lowerQuery) ||
      bank.country.toLowerCase().includes(lowerQuery) ||
      (bank.swiftCode && bank.swiftCode.toLowerCase().includes(lowerQuery))
  );
};
