var Lookup = {
	freqBandMode: {
		'2190m': [
			{
				mode: 'SSB',
				lower: '136,000',
				upper: '137,000',
			},
		],
		'630m': [
			{	
				mode: 'SSB',
				lower: '472,000',
				upper: '479,000',
			},
		],
		'560m': [
			{
				mode: 'SSB',
				lower: '501,000',
				upper: '504,000',
			},
		],
		'160m': [
			{
				mode: 'CW',
				lower: '1,800,000',
				upper: '1,843,000',
			},
			{
				mode: 'SSB',
				lower: '1,843,000',
				upper: '2,000,000',
			},
		],
		'80m': [
			{
				mode: 'CW',
				lower: '3,500,000',
				upper: '3,750,000',
			},
			{
				mode: 'SSB',
				upper: '3,750,000',
				lower: '4,000,000',
			},
		],
		'60m': [
			{
				mode: 'USB',
				lower: '5,330,500',
				upper: '5,403,500',
			},
		],
		'40m': [
			{
				mode: 'CW',
				lower: '7,000,000',
				upper: '7,150,000',
			},
			{
				mode: 'SSB',
				lower: '7,150,000',
				upper: '7,300,000',
			},
		],
		'30m': [
			{
				mode: 'CW',
				lower: '10,100,000',
				upper: '10,150,000',
			},
		],
		'20m': [
			{
				mode: 'CW',
				lower: '14,000,000',
				upper: '14,150,000',
			},
			{
				mode: 'SSB',
				lower: '14,150,000',
				upper: '14,350,000',
			}
		],
		'17m': [
			{
				mode: 'CW',
				lower: '18,068,000',
				upper: '18,110,000',
			},
			{
				mode: 'SSB',
				lower: '18,110,000',
				upper: '18,168,000',
			},
		],
		'15m': [
			{
				mode: 'CW',
				lower: '21,000,000',
				upper: '21,200,000',
			},
			{
				mode: 'SSB',
				lower: '21,200,000',
				upper: '21,450,000',
			},
		],
		'12m': [
			{
				mode: 'CW',
				lower: '24,890,000',
				upper: '24,930,000',
			},
			{
				mode: 'SSB',
				lower: '24,930,000',
				upper: '24,990,000',
			},
		],
		'10m': [
			{
				mode: 'CW',
				lower: '28,000,000',
				upper: '28,300,000',
			},
			{
				mode: 'SSB',
				lower: '28,300,000',
				upper: '29,700,000',
			},
		],
		'6m': [
			{
				mode: 'CW',
				lower: '50,000,000',
				upper: '50,100,000',
			},
			{
				mode: 'USB',
				lower: '50,100,000',
				upper: '51,100,000',
			},
			{
				mode: 'FM',
				lower: '51,100,000',
				upper: '54,000,000',
			},
		],
		'2m': [
			{
				mode: 'CW',
				lower: '144,000,000',
				upper: '144,100,000',
			},
			{
				mode: 'USB',
				lower: '144,100,000',
				upper: '144,600,000',
			},
			{
				mode: 'FM',
				lower: '144,600,000',
				upper: '148,000,000',
			},
		],
		'1.25m': [
			{
				mode: 'CW',
				lower: '222,000,000',
				upper: '222,100,000',
			},
			{
				mode: 'USB',
				lower: '222,100,000',
				upper: '222,250,000',
			},
			{
				mode: 'FM',
				lower: '222,250,000',
				upper: '225,000,000',
			},
		],
		'70cm': [
			{
				mode: 'CW',
				lower: '420,000,000',
				upper: '432,075,000',
			},
			{
				mode: 'USB',
				lower: '432,075,000',
				upper: '433,000,000',
			},
			{
				mode: 'FM',
				lower: '433,000,000',
				upper: '435,000,000',
			},
			{
				mode: 'USB',
				lower: '435,000,000',
				upper: '442,000,000',
			},
			{
				mode: 'FM',
				lower: '442,000,000',
				upper: '450,000,000',
			},
		],
		'33cm': [
			{
				mode: 'CW',
				lower: '902,000,000',
				upper: '904,000,000',
			},
			{
				mode: 'FM',
				lower: '904,000,000',
				upper: '928,000,000',
			},
		],
		'23cm': [
			{
				mode: 'FM',
				lower: '1,240,000,000',
				upper: '1,295,000,000',
			},
			{
				mode: 'CW',
				lower: '1,295,000,000',
				upper: '1,300,000,000',
			},
		],
		'13cm': [
			{
				mode: 'SSB',
				lower: '2,300,000,000',
				upper: '2,310,000,000',
			},
			{
				mode: 'SSB',
				lower: '2,390,000,000',
				upper: '2,450,000,000',
			},
		],
		'9cm': [
			{
				mode: 'SSB',
				lower: '3,300,000,000',
				upper: '3,500,000,000',
			},
		],
		'6cm': [
			{
				mode: 'SSB',
				lower: '5,650,000,000',
				upper: '5,925,000,000',
			},
		],
		'3cm': [
			{
				mode: 'SSB',
				lower: '10,000,000,000',
				upper: '10,500,000,000',
			},
		],
		'1.25cm': [
			{
				mode: 'SSB',
				lower: '24,000,000,000',
				upper: '24,250,000,000',
			},
		],
		'6mm': [
			{
				mode: 'SSB',
				lower: '47,000,000,000',
				upper: '47,200,000,000',
			},
		],
		'4mm': [
			{
				mode: 'SSB',
				lower: '75,500,000,000',
				upper: '81,000,000,000',
			},
		],
		'2.5mm': [
			{
				mode: 'SSB',
				lower: '119,980,000,000',
				upper: '120,020,000,000',
			},
		],
		'2mm': [
			{
				mode: 'SSB',
				lower: '142,000,000,000',
				upper: '149,000,000,000',
			},
		],
		'1mm': [
			{
				mode: 'SSB',
				lower: '241,000,000,000',
				upper: '250,000,000,000',
			},
		],
	},

	modes: [
		'AM',
		'AMTORFEC',
		'ASCI',
		'ATV',
		'CHIP128',
		'CHIP64',
		'CLO',
		'CONTESTI',
		'CW',
		'DOMINO',
		'DOMINOF',
		'DSTAR',
		'FAX',
		'FM',
		'FMHELL',
		'FSK',
		'FSK31',
		'FSK441',
		'GTOR',
		'HELL',
		'HELL80',
		'HFSK',
		'JT44',
		'JT65',
		'JT65A',
		'JT65B',
		'JT65C',
		'JT6M',
		'JT9',
		'JT9-1',
		'JT9-2',
		'LSB',
		'MFSK16',
		'MFSK8',
		'MT63',
		'MTTY',
		'OLIVIA',
		'PAC',
		'PAC2',
		'PAC3',
		'PAX',
		'PAX2',
		'PCW',
		'PKT',
		'PSK10',
		'PSK125',
		'PSK31',
		'PSK63',
		'PSK63F',
		'PSKAM10',
		'PSKAM31',
		'PSKAM50',
		'PSKFEC31',
		'PSKHELL',
		'Q15',
		'QPSK125',
		'QPSK31',
		'QPSK63',
		'ROS',
		'RTTY',
		'RTTYM',
		'SSB',
		'SSTV',
		'THOR',
		'THRB',
		'THRBX',
		'TOR',
		'USB',
		'VOI',
	],
}