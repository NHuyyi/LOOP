function calculateCounts(reactions) {
  const counts = {};
  let total = 0;
  for (const r of reactions) {
    counts[r.type] = (counts[r.type] || 0) + 1;
    total++;
  }
  return { counts, total };
}

module.exports = calculateCounts;
