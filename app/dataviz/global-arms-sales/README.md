# globalArmsTransfers
An Interactive visualisation of global arms transfers from 1950 to 2017

* Heavily inspired by Will Geary's (@wgeary) Video - https://vimeo.com/286751571


* SVG Map by AMCharts - https://www.amcharts.com/svg-maps/?map=world


* Dataset retrieved from SIPRI - https://www.sipri.org/databases/armstransfers
* Thanks to Jsvine for this neat trick to download the set as CSV - https://gist.github.com/jsvine/9cb3300588ed402160fe
* Cleaned dataset by removing:

	- All deals where Supplier or Recipient is unknown.
	- All deals which had multiple sellers without specification which. 
	- Deals with the UN, NATO, Regional Security System (RSSS), OSCE & African Union as seller or buyer

* and consolidating the following groups:
	- Amal (Lebanon)* -> Lebanon
	- ANC (South Africa)* -> South Africa
	- Anti-Castro rebels (Cuba)* -> Cuba
	- Armas (Guatemala) -> Guatemala
	- Biafra -> Nigeria
	- contras (Nicaragua)* -> Nicaragua
	- El Salvador (FMLN) -> El Salvador
	- ELF (Ethiopia)* -> Ethiopia
	- FNLA (Angola)* -> Angola
	- GUNT (Chad)* -> Chad
	- Haiti Rebels -> Haiti
	- Hezbollah (Lebanon)* -> Lebanon
	- Huthi rebels (Yemen)* -> Yemen
	- Indonesia Rebels -> Indonesia
	- Khmer Rouge (Cambodia)* -> Cambodia
	- Lebanon Palestinian rebels* -> Lebanon
	- LF (Lebanon)* -> Lebanon
	- libya GNC -> Libya
	- Libya HoR -> Libya
	- LTTE (Sri Lanka)* -> Sri Lanka
	- Macedonia (FYROM) -> Macedonia
	- MTA (Myanmar)* -> Myanmar
	- Mujahedin (Afghanistan)* -> Afghanistan
	- Northern Alliance (Afghanistan)* -> Afghanistan
	- Northern Cyprus -> Cyprus
	- SLA (Lebanon)* -> Lebanon
	- SNA (Somalia)* -> Somalia
	- Southern rebels (Yemen)* -> Yemen
	- Soviet Union -> Russia
	- Syria Rebels -> Syria
	- UIC (Somalia)* -> Somalia
	- Ukraine Rebels* -> Ukraine
	- UNITA (Angola)* -> Angola
	- Viet Cong -> Vietnam
	- Viet Minh -> Vietnam
	- Viet Nam -> Vietnam
	- ZAPU -> Zimbabwe


* Other plugins used: 
	- Color Picker - https://bgrins.github.io/spectrum/ by bgrins
	- jQuery 
*/
