// 🔹 NEW: helper function to check if option is selected

const toArray = (v) => {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
};

const escapeRegExp = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// returns true if two values (each may be scalar or array) share any element
const valuesOverlap = (a, b) => {
  const aa = toArray(a).map((x) => (x === null || x === undefined ? x : String(x)));
  const bb = toArray(b).map((x) => (x === null || x === undefined ? x : String(x)));
  if (!aa.length || !bb.length) return false;
  // check any in aa exists in bb
  const setB = new Set(bb);
  return aa.some((x) => setB.has(x));
};

const isOptionChecked = (sectionKey, option, selectedFilters, kpi = "OSA",) => {
  if (sectionKey === "platform") {
    return selectedFilters?.selectedPlatform?.some((b) => b.value === option.value);
  }
  if (sectionKey === "brand") {

    return selectedFilters?.selectedBrand?.some((b) => b.value == option.value);
  }
  if (sectionKey === "category") {
    if (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") {
      return selectedFilters?.selectedKeywordCategory?.some((b) => b.value === option.value);
    } else if (kpi === "SOM") {
      return selectedFilters?.selectCategory_som?.some((b) => b.value === option.value);
    }
    else {
      // console.log('selectedFiltersselectedFilterserer', selectedFilters)
      return selectedFilters?.selectedCategory?.some((c) => c.value === option.value);
    }
  }
  if (sectionKey === "keyword") {
    //         return selectedFilters?.selectedKeyword?.some((b) =>
    //   b.value?.some((val) => option.value?.includes(val))
    // );

    return selectedFilters?.selectedKeyword?.some((b) => valuesOverlap(b.value, option.value));
  }
  if (sectionKey === "products") {
    return selectedFilters?.selectedProductId?.some((c) => c.value == option.value);
  }
  if (sectionKey === "mother_pack") {
    return selectedFilters?.selectedMotherPack?.some((c) => c.value === option.value);
  }
  if (sectionKey === "osa_remarks") {
    return selectedFilters?.selectedOSARemarks?.some((c) => c.value === option.value);
  }
  if (sectionKey === "tags") {
    return selectedFilters?.selectedTags?.some((c) => c.id === option.id);
  }
  if (sectionKey === "tags_kw") {
    return selectedFilters?.selectedTagsKW?.some((c) => c.id === option.id);
  }
  if (sectionKey === "seller_type") {
    return selectedFilters?.selectedSellerType?.some((c) => c.value === option.value);
  }
  if (sectionKey === "location") {
    return selectedFilters?.selectedLocation?.some((l) => l.value === option.value);
  }
  if (sectionKey === "darkstore") {
    return selectedFilters?.selectedDarkstore?.some((l) => l.value === option.value);
  }
  if (sectionKey === "category_node") {
    // console.log('selectedFiltersselectedFilters',selectedFilters?.selectedCategory_node)
    return selectedFilters?.selectCategory_node?.some((l) => l.value === option.value);
  }

  if (sectionKey === "active_darkstore_location_status") {
    // console.log('selectedFiltersselectedFilters',selectedFilters?.selectedCategory_node)
    return selectedFilters?.active_location_status?.some((l) => l.value === option.value);
  }
  return false;
};

// 🔹 NEW: sorting function
const sortOptionsWithSelectedOnTop = (sectionKey, options, selectedFilters) => {
  return [...options].sort((a, b) => {
    const aSelected = isOptionChecked(sectionKey, a, selectedFilters);
    const bSelected = isOptionChecked(sectionKey, b, selectedFilters);

    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1; // selected first
  });
};











/**
 * searchUtils.js
 * Reusable fuzzy tokenized search + ranking helper.
 *
 * Exports:
 * - normalize(str)
 * - levenshtein(a,b)
 * - fuzzyTokenMatch(label, token, opts)
 * - buildTokens(input, { separator }) -> array of tokens
 * - searchAndRank(list, { globalSearch, localSearch, opts })
 *
 * opts:
 *  - localSeparator: ',' or '\\s+' (default: whitespace split)
 *  - localMode: 'OR' | 'AND' (default: 'OR') -- how local tokens combine
 *  - globalMode: 'AND' | 'OR' (default: 'AND') -- how global tokens combine
 *  - fuzzyFactor: 0.33 (fraction of token length tolerated as edit distance)
 *  - minMatchCount: 1 (minimum tokens matched to include item)
 */

const normalize = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

// Classic Levenshtein distance (DP) — fine for small/medium lists
function levenshtein(a = "", b = "") {
  const n = a.length,
    m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[n][m];
}

/**
 * fuzzyTokenMatch(label, token, opts)
 * - Fast partial includes first, fallback to small edit-distance.
 */
function fuzzyTokenMatch(label = "", token = "", opts = {}) {
  if (!token) return false;
  const lbl = normalize(label);
  const tok = normalize(token);

  if (lbl.includes(tok)) return true;

  const factor = typeof opts.fuzzyFactor === "number" ? opts.fuzzyFactor : 0.33;
  const maxErr = tok.length <= 1 ? 0 : Math.max(1, Math.floor(tok.length * factor));
  const dist = levenshtein(lbl, tok);
  return dist <= maxErr;
}

/**
 * buildTokens(str, { separator })
 * separator: ',' to split by commas, otherwise whitespace
 */
function buildTokens(str = "", { separator = "\\s+" } = {}) {
  if (!str || !String(str).trim()) return [];
  if (separator === ",") {
    return String(str)
      .split(",")
      .map((t) => normalize(t))
      .filter(Boolean);
  }
  // default: whitespace tokens
  return String(str)
    .split(new RegExp(separator))
    .map((t) => normalize(t))
    .filter(Boolean);
}

/**
 * searchAndRank(list, config)
 * - list: array of objects with `label` (string) and optional other fields
 * - config:
 *    - globalSearch: string (space separated by default)
 *    - localSearch: string (comma separated by default if localSeparator=',')
 *    - selectedValues: array of selected item values (to prefer selected items)
 *    - localSeparator: ',' or '\\s+' (default: whitespace) -- how to split localSearch
 *    - localMode: 'OR'|'AND' (default 'OR')
 *    - globalMode: 'AND'|'OR' (default 'AND')
 *    - fuzzyFactor: fraction used in fuzzy threshold (default 0.33)
 *    - minMatchCount: minimum tokens required to include (default 1)
 *
 * Returns: filtered & sorted array (best matches first).
 */
function searchAndRank(list = [], config = {}) {
  const {
    globalSearch = "",
    localSearch = "",
    selectedValues = [], // array of values to prefer
    localSeparator = "\\s+",
    localMode = "OR",
    globalMode = "AND",
    fuzzyFactor = 0.33,
    minMatchCount = 1,
    labelKey = "label", // property name to read label from objects
  } = config;

  const globalTokens = buildTokens(globalSearch, { separator: "\\s+" });
  const localTokens = localSeparator === "," ? buildTokens(localSearch, { separator: "," }) : buildTokens(localSearch, { separator: localSeparator });

  // if no tokens at all -> return list sorted by selected state, then label
  if (globalTokens.length === 0 && localTokens.length === 0) {
    return [...list].sort((a, b) => {
      const aSel = selectedValues?.includes(a.value);
      const bSel = selectedValues?.includes(b.value);
      if (aSel === bSel) return (a[labelKey] || "").localeCompare(b[labelKey] || "");
      return aSel ? -1 : 1;
    });
  }

  // helper: check tokens against label words and full label
  const tokenMatchesLabel = (label, tok) => {
    const lbl = normalize(label);
    const words = lbl.split(" ");
    // match if any word includes or fuzzy matches token OR entire label fuzzy matches token
    if (words.some((w) => w.includes(tok))) return true;
    if (words.some((w) => fuzzyTokenMatch(w, tok, { fuzzyFactor }))) return true;
    if (fuzzyTokenMatch(lbl, tok, { fuzzyFactor })) return true;
    return false;
  };

  const scored = list.map((item) => {
    const label = normalize(item[labelKey] || "");
    let globalMatchCount = 0;
    let localMatchCount = 0;

    if (globalTokens.length > 0) {
      for (const tok of globalTokens) {
        if (tokenMatchesLabel(label, tok)) globalMatchCount++;
      }
    }

    if (localTokens.length > 0) {
      for (const tok of localTokens) {
        if (tokenMatchesLabel(label, tok)) localMatchCount++;
      }
    }

    // Determine inclusion based on modes:
    // - globalMode = AND => require all global tokens match (globalMatchCount === globalTokens.length)
    // - globalMode = OR  => require at least one global token match (globalMatchCount > 0)
    // If no global tokens, global condition is considered satisfied.
    let globalOk = true;
    if (globalTokens.length > 0) {
      globalOk = globalMode === "AND" ? globalMatchCount === globalTokens.length : globalMatchCount > 0;
    }

    // For local tokens:
    // - localMode = AND => require all local tokens
    // - localMode = OR => require at least one local token
    // If no local tokens, local condition is considered satisfied.
    let localOk = true;
    if (localTokens.length > 0) {
      localOk = localMode === "AND" ? localMatchCount === localTokens.length : localMatchCount > 0;
    }

    // Final include decision: both globalOk && localOk must be true
    const included = globalOk && localOk;

    // score: how many tokens matched overall (global + local)
    const matchCount = globalMatchCount + localMatchCount;

    return { item, included, matchCount };
  });

  // keep only included and with at least minMatchCount
  const kept = scored.filter((s) => s.included && s.matchCount >= minMatchCount);

  // sort: higher matchCount first, then selected items first, then alphabetical
  kept.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    const aSel = selectedValues?.includes(a.item.value);
    const bSel = selectedValues?.includes(b.item.value);
    if (aSel !== bSel) return aSel ? -1 : 1;
    return (a.item[labelKey] || "").localeCompare(b.item[labelKey] || "");
  });

  return kept.map((s) => s.item);
}


export {
  escapeRegExp, isOptionChecked, sortOptionsWithSelectedOnTop,

  normalize,
  levenshtein,
  fuzzyTokenMatch,
  buildTokens,
  searchAndRank,
}