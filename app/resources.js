/*
 * resources.js
 *
 * Export constants to store in app locals
 * 15 Feb 2018
 * Josh Kerber
 */

var resources = {}

// mapping from ticker to CoinMarketCap id
resources['tickers'] = {"42":"42-coin","300":"300-token","611":"sixeleven","808":"808coin","888":"octocoin","1337":"1337coin","BTC":"bitcoin","ETH":"ethereum","XRP":"ripple","BCH":"bitcoin-cash","LTC":"litecoin","ADA":"cardano","XLM":"stellar","NEO":"neo","EOS":"eos","MIOTA":"iota","DASH":"dash","XEM":"nem","XMR":"monero","ETC":"ethereum-classic","LSK":"lisk","TRX":"tron","QTUM":"qtum","VEN":"vechain","USDT":"tether","BTG":"bitgem","ICX":"icon","OMG":"omisego","ZEC":"zcash","XRB":"raiblocks","STEEM":"steem","BNB":"binance-coin","BCN":"bytecoin-bcn","PPT":"populous","STRAT":"stratis","XVG":"verge","SC":"siacoin","RHOC":"rchain","SNT":"status","DOGE":"dogecoin","BTS":"bitshares","MKR":"maker","WAVES":"waves","VERI":"veritaseum","AE":"aeternity","WTC":"walton","HSR":"hshare","REP":"augur","ZCL":"zclassic","DCR":"decred","ZRX":"0x","UCASH":"ucash","KCS":"kucoin-shares","ARDR":"ardor","R":"revain","DGD":"digixdao","KMD":"komodo","DRGN":"dragonchain","GBYTE":"byteball","ETN":"electroneum","ARK":"ark","DGB":"digibyte","GAS":"gas","BAT":"basic-attention-token","BTM":"bitmark","LRC":"loopring","KNC":"kingn-coin","ZIL":"zilliqa","DCN":"dentacoin","GNT":"golem-network-tokens","PIVX":"pivx","SYS":"syscoin","ELF":"aelf","QASH":"qash","NAS":"nebulas-token","BTX":"bitcore","ETHOS":"ethos","PLR":"pillar","CNX":"cryptonex","GXS":"gxshares","POWR":"power-ledger","IOST":"iostoken","FCT":"factom","DENT":"dent","MONA":"monacoin","CND":"cindicator","AION":"aion","POLY":"polymath-network","FUN":"funfair","KIN":"kin","XZC":"zcoin","ENG":"enigma-project","SALT":"salt","MAID":"maidsafecoin","NXT":"nxt","RDD":"reddcoin","BNT":"bancor","PAY":"tenx","PART":"particl","SMART":"smartbillions","REQ":"request-network","LINK":"chainlink","NEBL":"neblio","XP":"experience-points","AGI":"singularitynet","IGNIS":"ignis","QSP":"quantstamp","EMC":"emercoin","ICN":"icoin","GNO":"gnosis-gno","BLOCK":"blocknet","SUB":"substratum","POE":"poet","GAME":"gamecredits","CVC":"civic","XPA":"xplay","XDN":"digitalnote","WAX":"wax","VTC":"vertcoin","UNITY":"supernet-unity","NXS":"nexus","RDN":"raiden-network-token","BTCD":"bitcoindark","STORJ":"storj","SAN":"santiment","HPB":"high-performance-blockchain","SKY":"skycoin","DEW":"dew","RPX":"red-pulse","DTR":"dynamic-trading-rights","ZEN":"zencash","PAC":"paccoin","MANA":"decentraland","PPP":"paypie","ANT":"aragon","ENJ":"enjin-coin","NAV":"nav-coin","SRN":"sirin-labs-token","TNB":"time-new-bank","MED":"medibloc","ACT":"achain","HTML":"html-coin","VEE":"blockv","RLC":"rlc","MCO":"monaco","DBC":"deepbrain-chain","UBQ":"ubiq","AGRS":"agoras-tokens","BLZ":"blazecoin","STORM":"storm","LEND":"ethlend","SPHTX":"sophiatx","XCP":"counterparty","C20":"c20","ITC":"iot-chain","XBY":"xtrabytes","BCO":"bridgecoin","BIX":"bibox-token","RCN":"rcoin","AST":"airswap","MDS":"medishares","EMC2":"einsteinium","PPC":"peercoin","JNT":"jibrel-network","VIBE":"vibe","TEL":"telcoin","CMT":"comet","XAS":"asch","SNM":"sonm","OST":"simple-token","ADX":"adx-net","MTL":"metal","SNGLS":"singulardtv","BAY":"bitbay","AMB":"amber","EDO":"eidoo","VIA":"viacoin","WABI":"wabi","MGO":"mobilego","MLN":"melon","WGR":"wagerr","THETA":"theta-token","RISE":"rise","SPANK":"spankchain","TNC":"trinity-network-credit","ETP":"metaverse","EDG":"edgeless","UTK":"utrust","MOD":"modum","INS":"ins-ecosystem","QRL":"quantum-resistant-ledger","DNT":"district0x","COB":"cobinhood","NULS":"nuls","DATA":"streamr-datacoin","QLC":"qlink","BRD":"bread","NLG":"gulden","TNT":"tierion","CTR":"centra","WINGS":"wings","APPC":"appcoins","PRL":"oyster","GVT":"genesis-vision","SOC":"all-sports","FUEL":"etherparty","UKG":"unikoin-gold","ION":"ion","MNX":"minexcoin","CDT":"coindash","TRIG":"triggers","PURA":"pura","HVN":"hive","TRAC":"origintrail","LBC":"library-credit","BURST":"burst","GTO":"gifto","INT":"internet-node-token","COSS":"coss","SLS":"salus","AEON":"aeon","MER":"mercury","ADT":"adtoken","ATM":"attention-token-of-media","NGC":"naga","ECC":"eccoin","IDH":"indahash","TAAS":"taas","SBD":"steem-dollars","GRS":"groestlcoin","CRW":"crown","ONION":"deeponion","ECA":"electra","DPY":"delphy","CLOAK":"cloakcoin","VIB":"viberate","1ST":"firstblood","SAFEX":"safe-exchange-coin","DIME":"dimecoin","PRE":"presearch","DCT":"decent","HST":"decision-token","THC":"hempcoin","TSL":"energo","CAPP":"cappasity","DAT":"datum","IOC":"iocoin","PEPECASH":"pepe-cash","LUN":"lunyr","GTC":"global-tour-coin","NET":"netcoin","OCN":"odyssey","NMC":"namecoin","LKK":"lykke","QBT":"cubits","TKN":"tokencard","INK":"ink","SHIFT":"shift","FTC":"feathercoin","BDG":"bitdegree","HMQ":"humaniq","CV":"carvertical","LOCI":"locicoin","KEY":"selfkey","MTH":"monetha","DMD":"diamond","DLT":"agrello-delta","RVT":"rivetz","CFI":"cofound-it","BCC":"bitconnect","SIB":"sibcoin","POT":"potcoin","BITCNY":"bitcny","SWFTC":"swftcoin","YOYOW":"yoyow","ZSC":"zeusshield","VOX":"voxels","TIX":"blocktix","FLASH":"flash","TAU":"lamden","WRC":"worldcore","TRST":"trust","TIO":"trade-token","MOON":"mooncoin","EVX":"everex","XWC":"whitecoin","LA":"latoken","COLX":"colossuscoinxt","SNC":"suncontract","IPL":"insurepal","BLT":"bitcoin-lightning","XSPEC":"spectrecoin","POSW":"posw-coin","UNO":"unobtanium","KRM":"karma","MOT":"olympus-labs","DRT":"domraider","CAT":"catcoin","IXT":"ixledger","ART":"maecenas","VRC":"vericoin","NMR":"numeraire","HOT":"hydro-protocol","ZPT":"zeepin","XEL":"elastic","NLC2":"nolimitcoin","AMP":"synereo","FAIR":"fairgame","PASC":"pascal-coin","PHR":"phore","BITB":"bean-cash","BLK":"blackcoin","NVST":"nvo","LEO":"leocoin","GUP":"guppy","GRC":"gridcoin","MDA":"moeda-loyalty-points","SOAR":"soarcoin","NEU":"neumark","XSH":"shield-xsh","ORME":"ormeus-coin","QUN":"qunqun","BOT":"bodhi","PRO":"propy","PPY":"peerplays-ppy","OTN":"open-trading-network","MSP":"mothership","AURA":"aurora-dao","CAN":"content-and-ad-network","EXP":"expanse","UNIT":"universal-currency","BCPT":"blockmason","SNOV":"snovio","MINT":"mintcoin","MYB":"mybit-token","OMNI":"omni","SWT":"swarm-city","UNY":"unity-ingot","HGT":"hellogold","ARN":"aeron","TGT":"target-coin","OAX":"oax","NYC":"newyorkcoin","UQC":"uquid-coin","JC":"jesus-coin","RADS":"radium","EDR":"e-dinar-coin","MUE":"monetaryunit","DNA":"encrypgen","ZOI":"zoin","GOLOS":"golos","SLR":"solarcoin","RBY":"rubycoin","ICOS":"icos","OK":"okcash","BBR":"boolberry","BNTY":"bounty0x","WCT":"waves-community-token","OXY":"oxycoin","KICK":"kickico","LIFE":"life","MEE":"coinmeet","XMY":"myriad","BMC":"blackmoon","PKT":"playkey","VOISE":"voisecom","PLBT":"polybius","STX":"stox","HAC":"hackspace-capital","ENRG":"energycoin","BSD":"bitsend","OCT":"oraclechain","COV":"covesting","PRA":"prochain","DBET":"decent-bet","CLAM":"clams","XPM":"primecoin","PND":"pandacoin-pnd","HKN":"hacken","ATB":"atbcoin","GBX":"gobyte","ECN":"e-coin","AIR":"airtoken","ALIS":"alis","PUT":"putincoin","COVAL":"circuits-of-value","XRL":"rialto","LMC":"lomocoin","POLL":"clearpoll","NXC":"nexium","LINDA":"linda","DICE":"etheroll","PST":"primas","HDG":"hedge","NTRN":"neutron","CSNO":"bitdice","AUR":"auroracoin","QAU":"quantum","RNT":"oneroot-network","NEOS":"neoscoin","DBIX":"dubaicoin-dbix","PRG":"paragon","BPT":"blockport","BITUSD":"bitusd","FLO":"florincoin","XAUR":"xaurum","GAM":"gambit","TIME":"chronobank","DAI":"dai","EBTC":"ebtcnew","BLUE":"ethereum-blue","DTB":"databits","FLDC":"foldingcoin","SYNX":"syndicate","SPF":"sportyco","VIU":"viuly","XUC":"exchange-union","PTOY":"patientory","ELIX":"elixir","MYST":"mysterium","LUX":"luxcoin","AVT":"aventus","USNBT":"nubits","LOC":"lockchain","PLU":"pluton","RMC":"remicoin","SXUT":"spectre-utility","ESP":"espers","PZM":"prizm","BCY":"bitcrystals","DOVU":"dovu","BQ":"bitqy","INCNT":"incent","HORSE":"ethorse","NSR":"nushares","ECOB":"ecobit","DYN":"dynamic","MUSIC":"musicoin","GCR":"global-currency-reserve","DIVX":"divi","BIS":"bismuth","IFT":"investfeed","AIT":"aichain","XLR":"solaris","PARETO":"pareto-network","GET":"guts-tickets","HEAT":"heat-ledger","OBITS":"obits","CURE":"curecoin","PINK":"pinkcoin","SPHR":"sphere","NIO":"autonio","EVR":"everus","CVCOIN":"cvcoin","ODN":"obsidian","FLIXX":"flixxo","CAG":"change","SPRTS":"sprouts","GAT":"gatcoin","ING":"iungo","DRP":"dcorp","SEQ":"sequence","PIRL":"pirl","ALQO":"alqo","AIX":"aigang","EVC":"eventchain","EAC":"earthcoin","PIX":"lampix","ARY":"block-array","XVC":"vcash","ABY":"artbyte","XST":"stealthcoin","AC":"asiacoin","TCC":"the-champcoin","LEV":"leverj","IOP":"internet-of-people","MEME":"memetic","BTCZ":"bitcoinz","DOPE":"dopecoin","TOA":"toacoin","RC":"russiacoin","XMCC":"monacocoin","ERO":"eroscoin","XTO":"tao","NVC":"novacoin","FLIK":"flik","DOT":"dotcoin","ATL":"atlant","PBL":"publica","BWK":"bulwark","SUMO":"sumokoin","TIE":"ties-network","POLIS":"polis","BRX":"breakout-stake","TIPS":"fedoracoin","HYP":"hyperstake","ERC":"europecoin","PLAY":"herocoin","UFO":"ufo-coin","HUSH":"hush","GRE":"greencoin","SSS":"sharechain","B2B":"b2bx","RIC":"riecoin","BUN":"bunnycoin","QWARK":"qwark","VRM":"veriumreserve","CRED":"verify","WISH":"mywish","EVE":"devery","XBC":"bitcoin-plus","TZC":"trezarcoin","BET":"betacoin","PTC":"pesetacoin","HAT":"hawala-today","SNRG":"synergy","GLD":"goldcoin","ONG":"ongsocial","SCL":"social","DGPT":"digipulse","CHIPS":"chips","BPL":"blockpool","KORE":"korecoin","CPAY":"cryptopay","TX":"transfercoin","ATMS":"atmos","BTDX":"bitcloud","PFR":"payfair","MONK":"monkey-project","VTR":"vtorrent","BRK":"breakout","BUZZ":"buzzcoin","CANN":"cannabiscoin","ZNY":"bitzeny","INN":"innova","APX":"apx","WILD":"wild-crypto","OPT":"opus","BBT":"bitboost","KRB":"karbowanec","VSX":"vsync-vsx","SEND":"social-send","ADC":"audiocoin","EXCL":"exclusivecoin","TFL":"trueflip","CRB":"creditbit","BDL":"bitdeal","PDC":"project-decorum","ADST":"adshares","SWIFT":"bitswift","ZRC":"zrcoin","GCN":"gcn-coin","STA":"starta","BELA":"belacoin","MAG":"maggie","2GIVE":"2give","TRCT":"tracto","BLITZ":"blitzcash","MTNC":"masternodecoin","MCAP":"mcap","ALT":"altcoin-alt","DNR":"denarius-dnr","HWC":"hollywoodcoin","XGOX":"xgox","ANC":"anoncoin","QVT":"qvolta","CREA":"creativecoin","HOLD":"interstellar-holdings","CHC":"chaincoin","YOC":"yocoin","AMM":"micromoney","CL":"coinlancer","FYP":"flypme","ZEIT":"zeitcoin","TKS":"tokes","FRD":"farad","INXT":"internxt","BON":"bonpay","CMPCO":"campuscoin","MBRS":"embers","START":"startcoin","SPR":"spreadcoin","TRC":"terracoin","SMLY":"smileycoin","KLC":"kilocoin","UFR":"upfiring","VSL":"vslice","SXC":"sexcoin","HUC":"huntercoin","DFT":"draftcoin","CRC":"crowdcoin","FOR":"force","TRUST":"trustplus","EGC":"evergreencoin","IXC":"ixcoin","EFL":"e-gulden","PROC":"procurrency","CARBON":"carboncoin","MAGE":"magiccoin","MXT":"martexcoin","IND":"indorse-token","ITNS":"intensecoin","LDOGE":"litedoge","ZER":"zero","PBT":"primalbase","PURE":"pure","RUP":"rupee","PHO":"photon","EBST":"eboostcoin","REC":"regalcoin","PYLNT":"pylon-network","PKB":"parkbyte","ZEPH":"zephyr","NOTE":"dnotes","GJC":"global-jobcoin","TES":"teslacoin","RAIN":"condensate","XMG":"magi","FRST":"firstcoin","BLU":"bluecoin","DAY":"chronologic","ELTCOIN":"eltcoin","VIVO":"vivo","QRK":"quark","STAK":"straks","OCL":"oceanlab","ABJ":"abjcoin","WAND":"wandx","ELLA":"ellaism","IFLT":"inflationcoin","ARC":"arcticcoin","EFYT":"ergo","GCC":"guccionecoin","EQT":"equitrader","XFT":"footy-cash","V":"version","DCY":"dinastycoin","STU":"student-coin","ITT":"intelligent-trading-tech","LCT":"lendconnect","CRM":"cream","LINX":"linx","NDC":"neverdie","AHT":"bowhead","ICOO":"ico-openledger","UNIFY":"unify","BTCS":"bitcoin-silver","PING":"cryptoping","ADZ":"adzcoin","XLC":"leviarcoin","INSN":"insanecoin-insn","ACC":"acchain","OPC":"op-coin","CDN":"canada-ecoin","UNB":"unbreakablecoin","DP":"digitalprice","NOBL":"noblecoin","UIS":"unitus","XCPO":"copico","HBC":"homeblockcoin","MZC":"mazacoin","SKC":"skeincoin","HTC":"hitcoin","FST":"fastcoin","CDX":"commodity-ad-network","LEAF":"leafcoin","JET":"jetcoin","POP":"popularcoin","AU":"aurumcoin","MOIN":"moin","WDC":"worldcoin","RNS":"renos","SKIN":"skincoin","GRWI":"growers-international","ECASH":"ethereumcash","CNT":"centurion","MAC":"machinecoin","INFX":"influxcoin","MRT":"miners-reward-token","KBR":"kubera-coin","ZET":"zetacoin","FLT":"fluttercoin","SUR":"suretly","FJC":"fujicoin","BTA":"bata","ADL":"adelphoi","ZENI":"zennies","BYC":"bytecent","CTX":"cartaxi-token","LGD":"legends-room","BRO":"bitradio","XCN":"cryptonite","XPD":"petrodollar","UNI":"universe","RKC":"royal-kingdom-coin","ELE":"elementrem","ATS":"authorship","ERC20":"erc20","EBET":"ethbet","SCORE":"scorecoin","FUCK":"fucktoken","BTB":"bitbar","TTC":"tittiecoin","LANA":"lanacoin","CCRB":"cryptocarbon","XCXT":"coinonatx","INPAY":"inpay","ARI":"aricoin","ACE":"ace","SCT":"soma","KLN":"kolion","MEC":"megacoin","BRIT":"britcoin","SMC":"smartcoin","BBP":"biblepay","GUN":"guncoin","DGC":"digitalcoin","HAL":"halcyon","ITI":"iticoin","PIGGY":"piggycoin","ETG":"ethereum-gold","QBIC":"qbic","HODL":"hodlcoin","CJ":"cryptojacks","CFT":"cryptoforecast","DFS":"dfscoin","EL":"elcoin-el","BLAS":"blakestar","KOBO":"kobocoin","DRXNE":"droxne","DSR":"desire","NYAN":"nyancoin","BUCKS":"swagbucks","BITS":"bitstar","CPC":"cpchain","RLT":"roulettetoken","FC2":"fuelcoin","BXT":"bittokens","TRI":"triangles","NETKO":"netko","BIGUP":"bigup","EBCH":"ebitcoin-cash","PCOIN":"pioneer-coin","BTCRED":"bitcoin-red","ENT":"entcash","AMS":"amsterdamcoin","BLC":"blakecoin","TRUMP":"trumpcoin","BPC":"bitpark-coin","VISIO":"visio","UNIC":"unicoin","BTWTY":"bit20","UTC":"ultracoin","Q2C":"qubitcoin","WGO":"wavesgo","MNE":"minereum","TIT":"titcoin","HERO":"sovereign-hero","XBL":"billionaire-token","CFD":"confido","HPC":"happycoin","XJO":"joulecoin","DEM":"deutsche-emark","XPTX":"platinumbar","KURT":"kurrent","VIDZ":"purevidz","RBT":"rimbit","SUPER":"supercoin","ARG":"argentum","TOKC":"tokyo","XHI":"hicoin","GLT":"globaltoken","B@":"bankcoin","MOJO":"mojocoin","PXC":"phoenixcoin","MOTO":"motocoin","IETH":"iethereum","CASH":"cash-poker-pro","PR":"prototanium","GB":"goldblocks","NEWB":"newbium","MANNA":"grantcoin","PAK":"pakcoin","SRC":"securecoin","OTX":"octanox","CUBE":"digicube","EVIL":"evil-coin","WHL":"whalecoin","XPY":"paycoin2","TEK":"tekcoin","DSH":"dashcoin","STN":"steneum-coin","SIGT":"signatum","RUPX":"rupaya-old","LTB":"litebar","SDRN":"senderon","CNO":"coin","DDF":"digital-developers-fund","CCT":"crystal-clear","GAP":"gapcoin","CRX":"chronos","ZZC":"zozocoin","XGR":"goldreserve","DAXX":"daxxcoin","TGC":"tigercoin","LEA":"leacoin","MNM":"mineum","SAGA":"sagacoin","KAYI":"kayicoin","NTO":"fujinto","BITBTC":"bitbtc","GRIM":"grimcoin","XRE":"revolvercoin","SHDW":"shadow-token","MDC":"madcoin","ONX":"onix","SWING":"swing","XRA":"ratecoin","MRJA":"ganjacoin","ETHD":"ethereum-dark","GRLC":"garlicoin","RED":"redcoin","VOT":"votecoin","SGR":"sugar-exchange","CHAN":"chancoin","HXX":"hexx","BOLI":"bolivarcoin","ARCO":"aquariuscoin","PXI":"prime-xi","ZCG":"zcash-gold","ASAFE2":"allsafe","CHESS":"chesscoin","POST":"postcoin","CCN":"cannacoin","PASL":"pascal-lite","BERN":"berncash","HNC":"huncoin","EOT":"eot-token","XIOS":"xios","XCT":"c-bit","NEVA":"nevacoin","BCF":"bitcoinfast","SOON":"sooncoin","LCP":"litecoin-plus","BSTY":"globalboost-y","EMD":"emerald","TRDT":"trident","UNITS":"gameunits","DUO":"parallelcoin","BLN":"bolenum","BRIA":"briacoin","AIB":"advanced-internet-blocks","POS":"postoken","REE":"reecoin","BITGOLD":"bitgold","TAG":"tagcoin","BTPL":"bitcoin-planet","TAJ":"tajcoin","DIX":"dix-asset","ZUR":"zurcoin","ATOM":"atomic-coin","ALTCOM":"altcommunity-coin","COAL":"bitcoal","XVP":"virtacoinplus","LBTC":"lightning-bitcoin","YTN":"yenten","KED":"darsek","DIBC":"dibcoin","MAO":"mao-zedong","MST":"mustangcoin","QTL":"quatloo","HONEY":"honey","DALC":"dalecoin","ICOB":"icobid","STARS":"starcash-network","VLT":"veltor","CON":"paycon","XBTS":"beatcoin","ICON":"iconic","CACH":"cachecoin","CNNC":"cannation","MAR":"marijuanacoin","ECO":"ecocoin","EVO":"evotion","ROOFS":"roofs","QBC":"quebecoin","CPN":"compucoin","FUZZ":"fuzzballs","GP":"goldpieces","ERY":"eryllium","XCO":"x-coin","SOIL":"soilcoin","BXC":"bitcedi","BIP":"bipcoin","GPL":"gold-pressed-latinum","SONG":"songcoin","UET":"useless-ethereum-token","$$$":"money","FLAX":"flaxscript","EAGLE":"eaglecoin","SPT":"spots","DBTC":"debitcoin","CXT":"coinonat","BITEUR":"biteur","DRS":"digital-rupees","OFF":"cthulhu-offerings","MSCN":"master-swiscoin","FIRE":"firecoin","BENJI":"benjirolls","SFC":"solarflarecoin","KRONE":"kronecoin","ZMC":"zetamicron","LTCU":"litecoin-ultra","VPRC":"vaperscoin","EXN":"exchangen","JOBS":"jobscoin","BOAT":"doubloon","ATX":"artex-coin","VOLT":"bitvolt","GEERT":"geertcoin","CRDNC":"credence-coin","WOMEN":"women","LTCR":"litecred","XOC":"xonecoin","VRS":"veros","DOLLAR":"dollar-online","COUPE":"coupecoin","ARGUS":"argus","CTIC3":"coimatic-3","NANOX":"project-x","CREVA":"crevacoin","PRC":"prcoin","FXE":"futurexe","VLTC":"vault-coin","AERM":"aerium","MGM":"magnum","LVPS":"levoplus","EXRN":"exrnchain","TSTR":"tristar-coin","HMC":"health-mutual-society","PIZZA":"pizzacoin","ABN":"abncoin","APW":"applecoin-apw","PAYX":"paypex","JINN":"jinn","GRID":"grid","SXDT":"spectre-dividend","BCAP":"bcap","PLC":"pluscoin","STAR":"starbase","HBT":"hubii-network","XNN":"xenon","REX":"real-estate-tokens","GMT":"mercury-protocol","PGL":"prospectors-gold","CREDO":"credo","ASTRO":"astro","VTA":"virtacoin","REAL":"real","ETT":"encryptotel-eth","GOOD":"goodomy","PRIX":"privatix","BASH":"luckchain","NKA":"incakoin","CBX":"cryptogenic-bullion","DAR":"darcrus","FYN":"fundyourselfnow","FIMK":"fimkrypto","ETBS":"ethbits","EMV":"ethereum-movie-venture","GIM":"gimli","RIYA":"etheriya","METAL":"metalcoin","SDC":"shadowcash","MBI":"monster-byte","PIPL":"piplcoin","KEK":"kekcoin","STRC":"starcredits","ORB":"orbitcoin","SIFT":"smart-investment-fund-token","RUSTBITS":"rustbits","I0C":"i0coin","ROC":"rasputin-online-coin","SHORTY":"shorty","EPY":"emphy","USC":"ultimate-secure-cash","LNK":"link-platform","WTT":"giga-watt-token","FCN":"fantomcoin","TKR":"trackr","TROLL":"trollcoin","LOG":"woodcoin","HBN":"hobonickels","NIMFA":"nimfamoney","OPAL":"opal","GAIA":"gaia","TALK":"btctalkcoin","MAX":"maxcoin","SLG":"sterlingcoin","TSE":"tattoocoin","8BIT":"8bit","BITZ":"bitz","JNS":"janus","AMBER":"ambercoin","FUNC":"funcoin","AMMO":"ammo-rewards","TRK":"truckcoin","MCRN":"macron","CV2":"colossuscoin-v2","FLY":"flycoin","KUSH":"kushcoin","BTCR":"bitcurrency","VAL":"valorbit","BLOCKPAY":"blockpay","J":"joincoin","CCO":"ccore","STV":"sativacoin","GLC":"globalcoin","MARS":"marscoin","C2":"coin2-1","BITSILVER":"bitsilver","PHS":"philosopher-stones","PX":"px","RBIES":"rubies","IMS":"independent-money-system","SPACE":"spacecoin","YEL":"yellow-token","MAD":"satoshimadness","BUMBA":"bumbacoin","BTSR":"btsr","EUC":"eurocoin","NUKO":"nekonium","CTO":"crypto","WAY":"wayguide","VC":"virtualcoin","EREAL":"ereal","RPC":"ronpaulcoin","DLC":"dollarcoin","BRAT":"brat","NTWK":"network-token","CYP":"cypher","FNC":"fincoin","FRC":"freicoin","SPEX":"sproutsextreme","QCN":"quazarcoin","BTQ":"bitquark","XCRE":"creatio","MNC":"mincoin","ISL":"islacoin","FRK":"franko","ACOIN":"acoin","RBX":"ripto-bux","IMX":"impact","SAC":"sacoin","YAC":"yacoin","VUC":"virta-unique-coin","NRO":"neuro","ICE":"idice","BOST":"boostcoin","BAS":"bitasean","JIN":"jin-coin","XBTC21":"bitcoin-21","XNG":"enigma","GPU":"gpu-coin","EGAS":"ethgas","ALL":"allion","SCRT":"secretcoin","MAY":"theresa-may-coin","JS":"javascript-token","BRAIN":"braincoin","BNX":"bnrtxcoin","LUNA":"luna-coin","DLISK":"dappster","WORM":"healthywormcoin","HMP":"hempcoin-hmp","SCS":"speedcash","ANTI":"antibitcoin","BSTAR":"blackstar","ADCN":"asiadigicoin","VEC2":"vector","CWXT":"cryptoworldx-token","PRX":"printerium","PIE":"piecoin","MTLMC3":"metal-music-coin","PULSE":"pulse","JWL":"jewels","BLRY":"billarycoin","MND":"mindcoin","CESC":"cryptoescudo","SOJ":"sojourn","PONZI":"ponzicoin","MILO":"milocoin","WARP":"warp","TYCHO":"tychocoin","SH":"shilling","CF":"californium","PLNC":"plncoin","RIDE":"ride-my-car","PLACO":"playercoin","ARB":"arbit","VIP":"vip-tokens","EGO":"ego","PEX":"posex","CRTM":"corethum","TOR":"torcoin-tor","DRM":"dreamcoin","SLEVIN":"slevin","COXST":"coexistcoin","LIR":"letitride","BIOS":"bios-crypto","ORLY":"orlycoin","URC":"unrealcoin","BSC":"bowscoin","WBB":"wild-beast-block","GBC":"gbcgoldcoin","URO":"uro","ACP":"anarchistsprime","TAGR":"tagrcoin","OS76":"osmiumcoin","ZYD":"zayedcoin","G3N":"genstake","STEPS":"steps","RSGP":"rsgpcoin","AGLC":"agrolifecoin","CAB":"cabbage","DES":"destiny","CRT":"crtcoin","HVCO":"high-voltage","ZNE":"zonecoin","IMPS":"impulsecoin","ELS":"elysium","SOCC":"socialcoin-socc","XCS":"cybcsec","IBANK":"ibank","SANDG":"save-and-gain","XRC":"rawcoin2","ALTC":"antilitecoin","SDP":"sydpak","BIOB":"biobar","P7C":"p7coin","NODC":"nodecoin","ULA":"ulatech","CTIC2":"coimatic-2","GSR":"geysercoin","CONX":"concoin","SLFI":"selfiecoin","CALC":"caliphcoin","DGCS":"digital-credits","DMB":"digital-money-bits","EBT":"ebittree-coin","CCM100":"ccminer","HT":"huobi-token","ATMC":"atmcoin","ELA":"elastos","WIC":"wi-coin","OF":"ofcoin","EKT":"educare","CHAT":"chatcoin","RUFF":"ruff","EPC":"electronic-pk-chain","NKC":"nework","AIDOC":"aidoc","LET":"linkeye","DTA":"data","TOPC":"topchain","BCD":"bitcoin-diamond","MTN":"medical-chain","TKY":"thekey","OC":"oceanchain","GNX":"genaro-network","STK":"stk","WPR":"wepower","SMT":"smartmesh","ZLA":"zilla","HPY":"hyper-pay","TRUE":"true-chain","MOBI":"mobius","MTX":"matryx","ADK":"aidos-kuneen","HLC":"halalchain","AVH":"animation-vision-cash","AAC":"acute-angle-cloud","YEE":"yee","XTZ":"tezos","CFUN":"cfun","FOTA":"fortuna","EKO":"echolink","QUBE":"qube","BCX":"bitcoinx","UBTC":"united-bitcoin","SHOW":"show","REBL":"rebellious","KCASH":"kcash","FRGC":"fargocoin","RCT":"realchain","STC":"starchain","MDT":"measurable-data-token","AWR":"aware","UGT":"ug-token","IDT":"investdigital","VLC":"valuechain","SBTC":"super-bitcoin","MOF":"molecular-future","BTO":"bottos","UIP":"unlimitedip","MAN":"matrix-ai-network","BAR":"titanium-blockchain","THS":"techshares","SEXC":"sharex","CHSB":"swissborg","DDD":"scryinfo","LIGHT":"lightchain","READ":"read","SSC":"selfsell","VZT":"vezt","UGC":"ugchain","SPC":"spacechain","BOS":"boscoin","AI":"poly-ai","CMS":"comsa-xem","INF":"infchain","NOX":"nitro","IQT":"iquant","CXO":"cargox","PRS":"pressone","MLM":"mktcoin","BIG":"bigone-token","CANDY":"candy","PXS":"pundi-x","ATN":"atn","COFI":"coinfi","XIN":"infinity-economics","TCT":"tokenclub","AID":"aidcoin","BTBc":"bitbase","AXP":"axpire","REF":"reftoken","ARCT":"arbitragect","BCDN":"blockcdn","MOAC":"moac","NMS":"numus","FUTC":"futcoin","IPC":"ipchain","DIM":"dimcoin","SHND":"stronghands","CLUB":"clubcoin","INDI":"indicoin","DXT":"datawallet","CRPT":"crypterium","CEFS":"cryptopiafeeshares","FIL":"filecoin","SMS":"speed-mining-service","IDXM":"idex-membership","ADB":"adbank","WETH":"weth","B2X":"segwit2x","ESC":"escoro","JIYO":"jiyo","SIC":"swisscoin","MNTP":"goldmint","ZAP":"zap","TMC":"timescoin","XID":"international-diamond","TBX":"tokenbox","MGC":"mergecoin","BKX":"bankex","JEW":"shekel","SBC":"strikebitclub","DAV":"davorcoin","KZC":"kzcash","BTW":"bitcoin-white","WC":"win-coin","CSC":"casinocoin","GCS":"gamechain","IC":"ignition","TOK":"tokugawa","SPK":"sparks","FDX":"fidentiax","MSD":"msd","SWTC":"jingtum-tech","TRF":"travelflex","GBG":"golos-gold","SLT":"smartlands","DMC":"dynamiccoin","TOKEN":"swaptoken","SJW":"sjwcoin","IFC":"infinitecoin","EAG":"ea-coin","ESZ":"ethersportz","HC":"harvest-masternode-coin","KB3":"b3coin","HTML5":"htmlcoin","PCS":"pabyosi-coin-special","GDC":"grandcoin","TCOIN":"t-coin","BT2":"bt2-cst","SENSE":"sense","BTCA":"bitair","EQL":"equal","DRPU":"drp-utility","BSR":"bitsoar","UTT":"uttoken","TER":"terranova","SFE":"safecoin","GOD":"bitcoin-god","PNX":"phantomx","BCA":"bitcoin-atom","BEST":"bestchain","PRES":"president-trump","WA":"wa-space","ZENGOLD":"zengold","CRAVE":"crave","ORE":"galactrum","SJCX":"storjcoin-x","ACES":"aces","BTE":"bitserial","XRY":"royalties","CYDER":"cyder","UNRC":"universalroyalcoin","GLS":"glasscoin","OX":"ox-fina","XOT":"internet-of-things","ABC":"alphabitcoinfund","MCR":"macro1","XMRG":"monero-gold","SWM":"swarm-fund","DEUS":"deuscoin","WSX":"wearesatoshi","ACN":"avoncoin","NAMO":"namocoin","SHA":"shacoin","DON":"donationcoin","PCN":"peepcoin","ZBC":"zilbercoin","ELITE":"ethereum-lite","VULC":"vulcano","XSTC":"safe-trade-coin","NEOG":"neo-gold","SND":"sand-coin","ELC":"elacoin","AKY":"akuya-coin","MCI":"musiconomi","GOLF":"golfcoin","COR":"corion","GRX":"gold-reward-token","BITCF":"first-bitcoin-capital","BLAZR":"blazercoin","ANI":"animecoin","BTCM":"btcmoon","KDC":"klondikecoin","RBBT":"rabbitcoin","CLD":"cloud","PRN":"protean","APC":"alpacoin","TESLA":"teslacoilcoin","FLAP":"flappycoin","FONZ":"fonziecoin","MVC":"maverick-chain","BIT":"first-bitcoin","NUMUS":"numuscash","GARY":"president-johnson","ANTX":"antimatter","MINEX":"minex","TELL":"tellurion","FAP":"fapcoin","ZSE":"zsecoin","SLOTH":"slothcoin","TOPAZ":"topaz","INDIA":"india-coin","SISA":"sisa","SKR":"sakuracoin","CFC":"coffeecoin","NBIT":"netbit","WOW":"wowcoin","FRN":"francs","GAY":"gaycoin","UNC":"uncoin","EDRC":"edrcoin","MARX":"marxcoin","HCC":"happy-creator-coin","UR":"ur","PLX":"plexcoin","SIGMA":"sigmacoin","IRL":"irishcoin","CHEAP":"cheapcoin","XQN":"quotient","HIGH":"high-gain","FAZZ":"fazzcoin","VASH":"vpncoin","BITOK":"bitok","LDCN":"landcoin","SAK":"sharkcoin","GRN":"granitecoin","PAYP":"paypeer","CC":"cybercoin","HDLB":"hodl-bucks","PDG":"pinkdog","XDE2":"xde-ii","TOP":"topcoin","PRIMU":"primulon","TRICK":"trickycoin","RUBIT":"rublebit","WINK":"wink","CMP":"compcoin","TURBO":"turbocoin","XTD":"xtd-coin","DUTCH":"dutch-coin","MAGN":"magnetcoin","GAIN":"ugain","DISK":"darklisk","RYZ":"anryze","SKULL":"pirate-blocks","NTC":"natcoin","BSN":"bastonet","BUB":"bubble","FFC":"fireflycoin","KASHH":"kashhcoin","RUNNERS":"runners","UTA":"utacoin","REGA":"regacoin","HALLO":"halloween-coin","KARMA":"karmacoin","TODAY":"todaycoin","IVZ":"invisiblecoin","SNAKE":"snakeeyes","MONETA":"moneta2","EGOLD":"egold","STEX":"stex","LEPEN":"lepen","POKE":"pokecoin","X2":"x2","BIRDS":"birds","DBG":"digital-bullion-gold","MBL":"mobilecash","LAZ":"lazaruscoin","GMX":"goldmaxcoin","DCRE":"deltacredits","XVE":"the-vegan-initiative","FRWC":"frankywillcoin","EGG":"eggcoin","LTH":"lathaan","TCR":"thecreed","TLE":"tattoocoin-limited","CYC":"cycling-coin","LKC":"linkedcoin","DUB":"dubstep","QORA":"qora","RICHX":"richcoin","DASHS":"dashs","OMC":"omicron","TERA":"teracoin","HYPER":"hyper","GML":"gameleaguecoin","VOYA":"voyacoin","XAU":"xaucoin","SHELL":"shellcoin","AXIOM":"axiom","CME":"cashme","AV":"avatarcoin","OPES":"opescoin","BAC":"bitalphacoin","MMXVI":"mmxvi","PSY":"psilocybin","OP":"operand","PRM":"prismchain","SPORT":"sportscoin","TEAM":"teamup","MONEY":"moneycoin","YES":"yescoin","RHFC":"rhfcoin","MEN":"peoplecoin","ASN":"aseancoin","FID":"bitfid","LLT":"lltoken","PEC":"peacecoin","BLX":"blockchain-index","FC":"facecoin","ELTC2":"eltc","SWP":"swapcoin","EUSD":"eusd","10MT":"10mtoken","LTG":"litecoin-gold","IBTC":"ibtc","EBIT":"ebit","FBL":"faceblock","IPY":"infinity-pay","BTC2X":"bitcoin2x","TRIA":"triaconta","HYTV":"hyper-tv","UAHPAY":"uahpay","FRCT":"farstcoin","EDT":"etherdelta-token","DUBI":"decentralized-universal-basic-income","DMT":"dmarket"}

// magnify coin returns by a constant
resources['returnMagnifier'] = 10;

// number of random coins per game
resources['randomChoices'] = 3;

// number of coins per game by market cap
resources['mcChoices'] = 7;

// minified HTML email template with breaks for variable insertion
resources['mailgun_email1'] = `<!DOCTYPE html><html><head> <meta name="viewport" content="width=device-width"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>CoinDuel – Verify Your Email</title> <style>.button{-moz-box-shadow:inset 0px 1px 0px 0px #bbdaf7; -webkit-box-shadow:inset 0px 1px 0px 0px #bbdaf7; box-shadow:inset 0px 1px 0px 0px #bbdaf7; background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #79bbff), color-stop(1, #378de5)); background:-moz-linear-gradient(top, #79bbff 5%, #378de5 100%); background:-webkit-linear-gradient(top, #79bbff 5%, #378de5 100%); background:-o-linear-gradient(top, #79bbff 5%, #378de5 100%); background:-ms-linear-gradient(top, #79bbff 5%, #378de5 100%); background:linear-gradient(to bottom, #79bbff 5%, #378de5 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#79bbff', endColorstr='#378de5',GradientType=0); background-color:#79bbff; -moz-border-radius:6px; -webkit-border-radius:6px; border-radius:6px; border:1px solid #84bbf3; display:inline-block; cursor:pointer; color:#ffffff; font-size:15px; font-weight:bold; padding:10px 15px; text-decoration:none; text-shadow:0px 1px 0px #528ecc;}.button:hover{background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #378de5), color-stop(1, #79bbff)); background:-moz-linear-gradient(top, #378de5 5%, #79bbff 100%); background:-webkit-linear-gradient(top, #378de5 5%, #79bbff 100%); background:-o-linear-gradient(top, #378de5 5%, #79bbff 100%); background:-ms-linear-gradient(top, #378de5 5%, #79bbff 100%); background:linear-gradient(to bottom, #378de5 5%, #79bbff 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#378de5', endColorstr='#79bbff',GradientType=0); background-color:#378de5;}.button:active{position:relative; top:1px;}</style></head><body> <p>Hello `
resources['mailgun_email2'] = `,</p><p>Thank you for signing up for CoinDuel! To get started, please verify your email using the link below:<br></p><p><a class='button' href='https://coinduel-cs98.herokuapp.com/api/verify/`
resources['mailgun_email3'] = `'>Verify email address</a></p><p>See you on the app!<br>CoinDuel Team</p></body></html>`

// export all resources
export default resources;
