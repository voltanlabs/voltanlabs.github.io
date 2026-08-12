(function () {
  const chains = [
    ['leovolt', 'leothor', 'leozues'],
    ['crabician', 'crabizard', 'crabzaster'],
    ['scorpyone', 'scorpytwo', 'scorpyus'],
    ['kindlekid', 'gaseousgoat', 'reactorram'],
    ['swimpig', 'diveswine', 'porkfloat'],
    ['coincalf', 'cash-cow', 'bankerbull'],
    ['crowupt', 'crowuption', 'crowtastrophe'],
    ['doughdawg', 'moneymutt', 'hundredhound'],
    ['primateicore', 'primateican', 'primateicon'],
    ['clockadile', 'aligatorithm', 'technogatorus'],
    ['fiscalfish', 'loanshark', 'afkwhale'],
    ['landline', 'octocable', 'fiberoptopus'],
    ['technoblin', 'technomoly', 'technareality'],
    ['pixelpup', 'wireframewolf', 'lupinfinity'],
    ['centaurcher', 'quiverandcolt', 'kernel-coltquiver'],
    ['aquobit', 'aquomid', 'aquomead'],
    ['leorust', 'leowreck', 'leoruin'],
    ['leonot', 'leonill', 'leonone'],
    ['cranurse', 'cradocter', 'crasurgen'],
    ['cralyric', 'crachorus', 'crasymphony'],
    ['scorpbegin', 'scorprocess', 'scorpyend']
  ];
  const stageBySpecies = {};
  chains.forEach(chain => chain.forEach((id, index) => { stageBySpecies[id] = index + 1; }));
  const timingByFamily = {
    early: new Set(['kindlekid', 'coincalf', 'pixelpup', 'aquobit', 'clockadile', 'fiscalfish']),
    standard: new Set(['leovolt', 'crabician', 'scorpyone', 'crowupt', 'doughdawg', 'landline', 'technoblin', 'leorust', 'leonot', 'cranurse', 'cralyric', 'scorpbegin']),
    late: new Set(['swimpig', 'primateicore', 'centaurcher']),
    endgame: new Set(['gem-n-eye'])
  };
  const evolutionLevels = { early: [22, 50], standard: [30, 65], late: [40, 78], endgame: [50, 88] };
  function familyTiming(id) {
    const match = Object.entries(timingByFamily).find(([, ids]) => ids.has(id));
    return match?.[0] || 'standard';
  }
  function evolutionLevelFor(id, from) { return evolutionLevels[familyTiming(id)]?.[from] || evolutionLevels.standard[from]; }
  function evolutionXpFor(id, from) { const level = evolutionLevelFor(id, from); return 50 * (level - 1) * level; }
  function stageFor(item) {
    if (Number(item?.version) >= 1) return Math.min(3, Number(item.version));
    return stageBySpecies[item?.id] || 1;
  }
  function adminLevel(xp) {
    const value = Math.max(0, Number(xp) || 0);
    let level = 1;
    while (level < 100 && value >= 50 * level * (level + 1)) level += 1;
    return level;
  }
  window.DataByteProgressionData = { chains, stageBySpecies, stageFor, adminLevel, timingByFamily, evolutionLevels, familyTiming, evolutionLevelFor, evolutionXpFor };
})();
