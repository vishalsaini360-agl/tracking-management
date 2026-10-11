import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";

const TreeCheckbox = ({
  data,
  expanded,
  onToggle,
  onSelectionChange,
  defaultChecked = {},
  expandedItems,
  setExpandedItems,
  searchTerm,
}) => {
  // console.log('defaultChecked', defaultChecked)
  const { updateSelectedFilters } = useEbuxContext();
  const [checkedItems, setCheckedItems] = useState(defaultChecked);

  function normalizeCheckedWithParents(nodes, checkedItems) {
    let allChecked = true;

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const childAllChecked = normalizeCheckedWithParents(node.children, checkedItems);

        const someChildChecked = node.children.some(
          (child) => checkedItems[child.value]
        );

        // ✅ if all children checked → mark parent checked
        if (childAllChecked) {
          checkedItems[node.value] = true;
        }
        // ✅ if some checked → parent unchecked (indeterminate handled by ref)
        else if (someChildChecked) {
          checkedItems[node.value] = false;
          allChecked = false;
        }
        // ✅ if none checked → parent unchecked
        else {
          checkedItems[node.value] = false;
          allChecked = false;
        }
      } else {
        if (!checkedItems[node.value]) {
          allChecked = false;
        }
      }
    }

    return allChecked;
  }


  // 🔄 Sync when modal opens again
  useEffect(() => {
    let updated = { ...defaultChecked };
    normalizeCheckedWithParents(data, updated);
    setCheckedItems(updated);
  }, [defaultChecked, data]);


  const getAllValues = (nodes) => {
    let values = [];
    for (const node of nodes) {
      values.push(node.value); // ✅ use value
      if (node.children) {
        values = values.concat(getAllValues(node.children));
      }
    }
    return values;
  };

  // const isFullyChecked = (nodes) => {
  //     const all = getAllValues(nodes);
  //     return all.every((v) => checkedItems[v]);
  // };

  // const toggleAll = (checked) => {
  //     const all = getAllValues(data);
  //     const updated = {};
  //     for (const val of all) updated[val] = checked;
  //     setCheckedItems(updated);
  // };

  const handleChange = (node, checked, children = []) => {
    const updated = { ...checkedItems, [node.value]: checked };

    if (children.length > 0) {
      const childValues = getAllValues(children);
      for (const val of childValues) updated[val] = checked;
    }
    normalizeCheckedWithParents(data, updated);
    setTimeout(() => {
      const rechecked = { ...updated };
      normalizeCheckedWithParents(data, rechecked);
      setCheckedItems(rechecked);
    }, 0);

  };

  const toggleExpand = (value) => {
    setExpandedItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  // ✅ Collect full selected pincodes
  useEffect(() => {
    const collectLeafNodes = (nodes, region, state, city) => {
      let leaves = [];
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          leaves = leaves.concat(
            collectLeafNodes(
              n.children,
              region || n.label,
              state || n.label,
              city || n.label
            )
          );
        } else if (checkedItems[n.value]) {
          leaves.push({
            city: city || "",
            state: state || "",
            region: region || "",
            label: n.label,
            value: n.value,
            pf_id: n.value,
            latitude: n.latitude || null,
            longitude: n.longitude || null,
          });
        }
      });
      return leaves;
    };

    const selectedNodes = collectLeafNodes(data);
    updateSelectedFilters("selectedLocation", selectedNodes);
    onSelectionChange?.(selectedNodes);
  }, [checkedItems, data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }

    const filterTree = (nodes) => {
      return nodes
        .map(node => {
          const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
          const filteredChildren = node.children ? filterTree(node.children) : [];
          const childrenMatch = filteredChildren.length > 0;

          if (nodeMatches || childrenMatch) {
            return {
              ...node,
              children: filteredChildren.length > 0 ? filteredChildren : (node.children || [])
            };
          }
          return null;
        })
        .filter(Boolean);
    };

    // Automatically expand the parents of any matching nodes
    const newExpandedItems = {};
    const expandParents = (nodes) => {
      return nodes
        .map(node => {
          const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
          const childrenMatch = node.children && expandParents(node.children).length > 0;

          if (nodeMatches || childrenMatch) {
            newExpandedItems[node.value] = true;
            return node;
          }
          return null;
        })
        .filter(Boolean);
    };

    // Run expansion logic
    expandParents(data);
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));

    // Return the filtered data for rendering
    return filterTree(data);
  }, [data, searchTerm, setExpandedItems]);


  const getVisibleLeafValues = useMemo(() => {
    const gatherLeaves = (nodes) => {
      let vals = [];
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          vals = vals.concat(gatherLeaves(n.children));
        } else {
          vals.push(n.value);
        }
      });
      return vals;
    };
    return gatherLeaves(filteredData);
  }, [filteredData]);

  const allVisibleSelected = useMemo(
    () => getVisibleLeafValues.length > 0 && getVisibleLeafValues.every((v) => checkedItems[v]),
    [getVisibleLeafValues, checkedItems]
  );

  const someVisibleSelected = useMemo(
    () => getVisibleLeafValues.some((v) => checkedItems[v]) && !allVisibleSelected,
    [getVisibleLeafValues, checkedItems, allVisibleSelected]
  );

  const toggleVisible = (checked) => {

    const updated = { ...checkedItems };
    getVisibleLeafValues.forEach((val) => {
      updated[val] = checked;
    });
    normalizeCheckedWithParents(data, updated);
    setCheckedItems(updated);
  };

  return (
    <>{
      (filteredData.length > 0) ? <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-base">Location</h3>
          {(filteredData?.length > 0 || searchTerm.length > 0) && (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onToggle("location")}
            >
              {expanded["location"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </button>
          )}
        </div>
        <div
          className={`space-y-2 transition-all duration-300 ${expanded["location"]
            ? "max-h-60 overflow-y-auto pr-2"
            : "max-h-[102px] overflow-hidden"
            }`}
        >

          <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
            {/* <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 rounded"
                                checked={isFullyChecked(data)}
                                onChange={(e) => toggleAll(e.target.checked)}
                            /> */}

            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded"
              checked={allVisibleSelected} // 🔹 HIGHLIGHTED
              ref={(el) => {
                if (el) el.indeterminate = someVisibleSelected; // 🔹 HIGHLIGHTED
              }}
              onChange={(e) => toggleVisible(e.target.checked)} // 🔹 HIGHLIGHTED
            />
            Select All
          </label>

          <div
            className={`space-y-2 mt-2 transition-all duration-300 ${expanded["location"]
              ? "max-h-60 overflow-y-auto pr-2 hide-scrollbar"
              : "max-h-[102px] overflow-hidden"
              }`}
          >
            {filteredData.map((item) => (
              <TreeNode
                key={item.value}
                node={item}
                level={1}
                checkedItems={checkedItems}
                handleChange={handleChange}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
                getAllValues={getAllValues}
              />
            ))}
          </div>
        </div>
        {data.length > 0 && filteredData.length > 0 && (
          <button
            type="button"
            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
            onClick={onToggle}
          >
            {expanded["location"] ? "View Less" : "View More"}
            <span className="ml-1">
              {expanded["location"] ? (
                <IoIosArrowUp size={16} />
              ) : (
                <IoIosArrowDown size={16} />
              )}
            </span>
          </button>
        )}
      </div> : null
    }
    </>
  );
};

const TreeNode = ({
  node,
  level,
  checkedItems,
  handleChange,
  expandedItems,
  toggleExpand,
  getAllValues,
}) => {

  const hasChildren = node.children && node.children.length > 0;
  const descendantValues = hasChildren ? getAllValues(node.children) : [];

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const allChecked =
        descendantValues.length > 0 &&
        descendantValues.every((v) => checkedItems[v]);
      const someChecked =
        descendantValues.length > 0 &&
        descendantValues.some((v) => checkedItems[v]);

      // ✅ indeterminate for partial
      ref.current.indeterminate = hasChildren && someChecked && !allChecked;

      // ✅ ensure parent checked when all children are checked
      if (hasChildren && allChecked && !checkedItems[node.value]) {
        checkedItems[node.value] = true;
      }

      // Debug
      // console.log("🔍 node:", node.label, {
      //     allChecked,
      //     someChecked,
      //     selfChecked: checkedItems[node.value],
      // });
    }
  }, [checkedItems]);


  return (
    <div style={{ paddingLeft: level * 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {hasChildren && (
          <span
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => toggleExpand(node.value)}
          >
            {expandedItems[node.value] ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </span>
        )}
        {!hasChildren && <span style={{ width: 12 }} />}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            checked={
              hasChildren
                ? descendantValues.length > 0 &&
                descendantValues.every((v) => checkedItems[v])
                : checkedItems[node.value] || false
            }
            className="w-4 h-4 text-blue-600 rounded"
            onChange={(e) =>
              handleChange(node, e.target.checked, node.children || [])
            }
          />
        </label>
        <span
          onClick={() => hasChildren && toggleExpand(node.value)}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          {node.label}
        </span>
      </div>

      {hasChildren && expandedItems[node.value] && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              level={level + 1}
              checkedItems={checkedItems}
              handleChange={handleChange}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              getAllValues={getAllValues}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeCheckbox;
