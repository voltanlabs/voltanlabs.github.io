// assets/js/dd-canon-roster.js
// Shared DataByteSprites canon roster for Data Discovery, DataByteDex, and Studio indexing.
// Canon model: one required alignment plus one or two configurations as they Version Upgrade.
(function(){
  const ALIGNMENTS=['Pristine','Stained','Null'];
  const CONFIGURATIONS=['Mystic','Voltricity','Acoustic','Torrent','Thermal','Organic','Malware','Analog','Quantum','Financial','Temporal','Spam','Cryo','Alloy','Spectral','Cipher','Neural','Celestial','Aether','Seismic'];

  const colors={
    Pristine:'#BAE6FD',Stained:'#FB7185',Null:'#64748B',Mystic:'#A78BFA',Voltricity:'#FFD700',
    Acoustic:'#F9A8D4',Torrent:'#38BDF8',Thermal:'#F97316',Organic:'#22C55E',Malware:'#EF4444',
    Analog:'#FB923C',Quantum:'#818CF8',Financial:'#34D399',Temporal:'#FACC15',Spam:'#F472B6',
    Cryo:'#67E8F9',Alloy:'#CBD5E1',Spectral:'#C084FC',Cipher:'#2DD4BF',Neural:'#A78BFA',
    Celestial:'#60A5FA',Aether:'#93C5FD',Seismic:'#A3E635',Unassigned:'#38BDF8'
  };

  function rarity(version,alignment,name){
    if(name==='Leovolt')return 'Legendary';
    if(version==='Terabyte')return 'Mythic';
    if(version==='Gigabyte')return 'Epic';
    if(version==='Megabyte')return 'Rare';
    if(alignment==='Stained')return 'Uncommon';
    if(alignment==='Null')return 'Rare';
    return 'Common';
  }
  function chance(value){return value==='Mythic'?42:value==='Legendary'?55:value==='Epic'?62:value==='Rare'?72:value==='Uncommon'?80:88}
  function stability(value){return value==='Mythic'?7:value==='Legendary'?6:value==='Epic'?5:value==='Rare'?4:3}
  function icon(name,configs){
    if(name.startsWith('Leo'))return '🦁';
    if(name.includes('Crab'))return '🦀';
    if(name.includes('Scorp'))return '🦂';
    if(name.includes('Goat')||name.includes('Ram'))return '🐐';
    if(name.includes('Pig')||name.includes('Swine')||name.includes('Pork'))return '🐷';
    if(name.includes('Calf')||name.includes('Cow')||name.includes('Bull'))return '🐂';
    if(name.includes('Crow'))return '🐦‍⬛';
    if(name.includes('Dawg')||name.includes('Mutt')||name.includes('Hound')||name.includes('Pup')||name.includes('Wolf')||name.includes('Lupin'))return '🐶';
    if(name.toLowerCase().includes('fish')||name.includes('Shark')||name.includes('WHALE')||name.startsWith('Aquo'))return '🐟';
    if(name.includes('Troll')||name.includes('Technoblin'))return '👹';
    if(name.includes('Clock')||name.includes('gator')||name.includes('Gator'))return '🐊';
    if(name.toLowerCase().includes('wyrm'))return '🐉';
    if(name.includes('Screen')||name.includes('Monitor'))return '🖥️';
    if(name.includes('Mirror'))return '🪞';
    if(name.includes('Bear'))return '🐻';
    if(name.includes('Pigeon'))return '🐦';
    if(name.includes('Cable')||name.includes('optopus'))return '🐙';
    if(name.includes('Cassette'))return '📼';
    if(name.includes('Disk'))return '💾';
    if(name.includes('Gem'))return '💎';
    if(name.includes('Centa')||name.includes('Colt')||name.includes('Quiver'))return '🏹';
    if(configs.includes('Voltricity'))return '⚡';
    if(configs.includes('Financial'))return '💰';
    if(configs.includes('Thermal'))return '🔥';
    if(configs.includes('Mystic'))return '✨';
    return '◇';
  }

  // [dex, name, alignment, configurations, version, familyId, zodiac, description]
  const raw=[
    ['001','Leovolt','Pristine',['Voltricity'],'Kilobyte','leo-family','Leo','Lion cub with blue electric fur, circuit lines, and a lightning bolt tail.'],
    ['002','Leothor','Pristine',['Voltricity'],'Megabyte','leo-family','Leo','Adolescent lion with blue electric fur, circuit lines, and a lightning bolt tail.'],
    ['003','Leozues','Pristine',['Voltricity'],'Gigabyte','leo-family','Leo','Full-grown lion with blue electric fur, an energy-charged mane, and a larger lightning-bolt tail.'],
    ['004','Crabician','Null',['Mystic'],'Kilobyte','crabician-family','Cancer','Apprentice mage crab.'],
    ['005','Crabizard','Null',['Mystic'],'Megabyte','crabician-family','Cancer','Full-fledged wizard crab.'],
    ['006','Crabzaster','Null',['Mystic'],'Gigabyte','crabician-family','Cancer','Sorcerer Supreme master crab.'],
    ['007','Scorpyone','Stained',['Alloy'],'Kilobyte','scorpy-family','Scorpio','One-eyed orange robotic Stained scorpion.'],
    ['008','Scorpytwo','Stained',['Alloy'],'Megabyte','scorpy-family','Scorpio','Robotic scorpion-and-spider duo representing Stained and Pristine data.'],
    ['009','Scorpyus','Stained',['Alloy'],'Gigabyte','scorpy-family','Scorpio','Combined robotic form of the Stained and Pristine scorpion-and-spider duo.'],
    ['010','KindleKid','Unassigned',['Thermal'],'Kilobyte','aries-family','Aries','Thermal zodiac-family base form.'],
    ['011','GaseousGoat','Unassigned',['Thermal','Seismic'],'Megabyte','aries-family','Aries','Thermal and Seismic goat Version Upgrade.'],
    ['012','ReactorRam','Unassigned',['Thermal','Seismic'],'Gigabyte','aries-family','Aries','Reactor-powered ram and final known Aries-family upgrade.'],
    ['013','SwimPig','Unassigned',['Torrent'],'Kilobyte','swimpig-family',null,'Torrent pig line base form.'],
    ['014','DiveSwine','Unassigned',['Torrent'],'Megabyte','swimpig-family',null,'Torrent swine Version Upgrade.'],
    ['015','PorkFloat','Unassigned',['Torrent'],'Gigabyte','swimpig-family',null,'Floating Torrent pig final form.'],
    ['016','CoinCalf','Unassigned',['Financial'],'Kilobyte','taurus-family','Taurus','Financial calf and Taurus-family base form.'],
    ['017','Cash Cow','Unassigned',['Financial','Seismic'],'Megabyte','taurus-family','Taurus','Financial and Seismic cow Version Upgrade.'],
    ['018','BankerBull','Unassigned',['Financial','Seismic'],'Gigabyte','taurus-family','Taurus','Financial and Seismic bull final form.'],
    ['019','Crowupt','Unassigned',[],'Kilobyte','crowupt-family',null,'Crow corruption line base form; alignment and configurations pending.'],
    ['020','Crowuption','Unassigned',[],'Megabyte','crowupt-family',null,'Crow corruption line Version Upgrade; alignment and configurations pending.'],
    ['021','Crowtastrophe','Unassigned',[],'Gigabyte','crowupt-family',null,'Crow corruption catastrophe form; alignment and configurations pending.'],
    ['022','DoughDawg','Unassigned',['Financial'],'Kilobyte','money-hound-family',null,'Financial hound line base form.'],
    ['023','MoneyMutt','Unassigned',['Financial'],'Megabyte','money-hound-family',null,'Financial hound Version Upgrade.'],
    ['024','HundredHound','Unassigned',['Financial'],'Gigabyte','money-hound-family',null,'High-value Financial hound final form.'],
    ['025','Primateicore','Unassigned',[],'Kilobyte','primate-family',null,'Primate line base form; configurations pending.'],
    ['026','Primateican','Unassigned',[],'Megabyte','primate-family',null,'Primate line Version Upgrade; configurations pending.'],
    ['027','Primateicon','Unassigned',[],'Gigabyte','primate-family',null,'Primate line final form; configurations pending.'],
    ['028','Clockadile','Unassigned',[],'Kilobyte','capricorn-family','Capricorn','Clock crocodile and Capricorn-family base form.'],
    ['029','Aligatorithm','Unassigned',[],'Megabyte','capricorn-family','Capricorn','Algorithm alligator Version Upgrade.'],
    ['030','Technogatorus','Unassigned',[],'Gigabyte','capricorn-family','Capricorn','Advanced gator final form.'],
    ['031','FiscalFish','Unassigned',['Torrent'],'Kilobyte','pisces-family','Pisces','Torrent and financial fish-family base form.'],
    ['032','LoanShark','Unassigned',['Torrent','Financial'],'Megabyte','pisces-family','Pisces','Torrent and Financial shark Version Upgrade.'],
    ['033','AFKWHALE','Unassigned',['Torrent','Financial'],'Gigabyte','pisces-family','Pisces','Massive Torrent and Financial whale final form.'],
    ['034','PrankCaller','Unassigned',[],'Kilobyte','prankcaller-family',null,'Prank communication sprite; configurations pending.'],
    ['035','KeyboardWarrior','Unassigned',[],'Kilobyte','keyboardwarrior-family',null,'Internet argument sprite; configurations pending.'],
    ['036','Troll','Unassigned',[],'Kilobyte','troll-family',null,'Hostile internet sprite; configurations pending.'],
    ['037','Landline','Unassigned',[],'Kilobyte','cable-family',null,'Cable communication line base form.'],
    ['038','Octocable','Unassigned',[],'Megabyte','cable-family',null,'Cable cephalopod Version Upgrade.'],
    ['039','Fiberoptopus','Unassigned',[],'Gigabyte','cable-family',null,'Fiber-optic octopus final form.'],
    ['040','CassetteKid','Unassigned',[],'Kilobyte','retro-family',null,'Analog cassette sprite; exact configurations pending.'],
    ['041','DiskDaddy','Unassigned',[],'Megabyte','retro-family',null,'Disk-based Version Upgrade; exact configurations pending.'],
    ['042','Technoblin','Unassigned',[],'Kilobyte','technoblin-family',null,'Technology goblin line base form; configurations pending.'],
    ['043','Technomoly','Unassigned',[],'Megabyte','technoblin-family',null,'Technology goblin Version Upgrade; configurations pending.'],
    ['044','Technareality','Unassigned',[],'Gigabyte','technoblin-family',null,'Reality-bending technology final form; configurations pending.'],
    ['045','Glitchwyrm','Unassigned',[],'Kilobyte','glitchwyrm-family',null,'Glitch wyrm sprite; canonical configuration pending.'],
    ['046','Screensavior','Unassigned',[],'Kilobyte','display-family',null,'Screen guardian sprite; canonical configurations pending.'],
    ['047','Monitorman','Unassigned',[],'Megabyte','display-family',null,'Monitor humanoid Version Upgrade; canonical configurations pending.'],
    ['048','Displaydevil','Unassigned',[],'Gigabyte','display-family',null,'Display demon sprite; family relationship and configurations pending.'],
    ['049','Mirrormaster','Unassigned',[],'Terabyte','display-family',null,'Mirror master sprite; Terabyte role and configurations pending.'],
    ['050','Compressaur','Unassigned',[],'Kilobyte','compressaur-family',null,'Compression dinosaur sprite; configurations pending.'],
    ['051','Pixelpigeon','Unassigned',[],'Kilobyte','pixelpigeon-family',null,'Pixel bird sprite; configurations pending.'],
    ['052','Binarybear','Unassigned',[],'Kilobyte','binarybear-family',null,'Binary bear sprite; configurations pending.'],
    ['053','Proxentity','Unassigned',[],'Megabyte','proxy-family',null,'Proxy entity; canonical configurations pending.'],
    ['054','Proxsentience','Unassigned',[],'Gigabyte','proxy-family',null,'Sentient proxy Version Upgrade; canonical configurations pending.'],
    ['055','Gem-N-Eye','Unassigned',[],'Kilobyte','gemini-family','Gemini','Gemini zodiac sprite; version path and configurations pending.'],
    ['056','6.ela','Unassigned',[],'Kilobyte','virgo-family','Virgo','Earth Logic Algorithm and Virgo zodiac sprite; configurations pending.'],
    ['057','PixelPup','Unassigned',[],'Kilobyte','libra-family','Libra','Libra-family base form.'],
    ['058','WireframeWolf','Unassigned',[],'Megabyte','libra-family','Libra','Wireframe wolf Version Upgrade.'],
    ['059','Lupinfinity','Unassigned',[],'Gigabyte','libra-family','Libra','Infinite wolf final form.'],
    ['060','Centaurcher','Unassigned',[],'Kilobyte','sagittarius-family','Sagittarius','Centaur archer and Sagittarius-family base form.'],
    ['061','Quiver&Colt','Unassigned',[],'Megabyte','sagittarius-family','Sagittarius','Quiver-and-colt Version Upgrade.'],
    ['062','Kernel:ColtQuiver','Unassigned',[],'Gigabyte','sagittarius-family','Sagittarius','Kernel-level Sagittarius final form.'],
    ['063','AquoBit','Unassigned',['Aether'],'Kilobyte','aquarius-family','Aquarius','Aether-based Aquarius-family base form.'],
    ['064','AquoMid','Unassigned',['Aether','Torrent'],'Megabyte','aquarius-family','Aquarius','Aether and Torrent Aquarius Version Upgrade.'],
    ['065','AquoMead','Unassigned',['Aether','Torrent'],'Gigabyte','aquarius-family','Aquarius','Aether and Torrent Aquarius final form.'],

    // Independent alignment species belonging to the Leo family.
    ['066','LeoRust','Stained',['Alloy'],'Kilobyte','leo-family','Leo','Stained Alloy lion-family base species.'],
    ['067','LeoWreck','Stained',['Alloy'],'Megabyte','leo-family','Leo','Stained Alloy lion-family Version Upgrade.'],
    ['068','LeoRuin','Stained',['Alloy'],'Gigabyte','leo-family','Leo','Stained Alloy lion-family final species.'],
    ['069','LeoNot','Null',['Spectral'],'Kilobyte','leo-family','Leo','Null Spectral lion-family base species.'],
    ['070','LeoNill','Null',['Spectral'],'Megabyte','leo-family','Leo','Null Spectral lion-family Version Upgrade.'],
    ['071','LeoNone','Null',['Spectral'],'Gigabyte','leo-family','Leo','Null Spectral lion-family final species.']
  ];

  window.DD_ALIGNMENT_TYPES=ALIGNMENTS.slice();
  window.DD_CONFIGURATION_TYPES=CONFIGURATIONS.slice();
  window.DD_CANON_ROSTER=raw.map(function(row){
    const dex=row[0],name=row[1],alignment=row[2],configs=row[3],version=row[4],familyId=row[5],zodiac=row[6],lore=row[7];
    const rare=rarity(version,alignment,name);
    const primary=configs[0]||'Unassigned';
    return {
      dex,name,alignment,configurations:configs.slice(),primaryConfiguration:configs[0]||null,
      secondaryConfiguration:configs[1]||null,configurationStatus:configs.length?'assigned':'pending',
      type:configs.length?configs.join(' / '):'Unassigned',stage:version,version,familyId,zodiac,
      rarity:rare,icon:icon(name,configs),color:colors[primary]||colors[alignment]||colors.Unassigned,
      chance:chance(rare),stability:stability(rare),lore
    };
  });
})();