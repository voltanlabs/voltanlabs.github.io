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
    ['leonot', 'leonill', 'leonone']
  ];
  const stageBySpecies = {};
  chains.forEach(chain => chain.forEach((id, index) => { stageBySpecies[id] = index + 1; }));
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
  window.DataByteProgressionData = { chains, stageBySpecies, stageFor, adminLevel };
})();
