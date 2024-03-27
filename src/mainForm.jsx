import React, { useState, useEffect } from 'react';
import './css/TreeView.css';
import api from "./api";

const TreeView = ({ data, company }) => {
  const [companyPersistence, setCompanyPersistence] = useState({});
  const [cacheCleared, setCacheCleared] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  let stateCount = 0;
  const useStatePersistent = (defaultVal) => {
    const currentState = `state-${stateCount++}`;

    if (!companyPersistence[company]) {
      companyPersistence[company] = {};
    }

    if (!companyPersistence[company][currentState]) {
      companyPersistence[company][currentState] = defaultVal;
      setCompanyPersistence({ ...companyPersistence });
    }

    return [
      companyPersistence[company][currentState],
      (val) => {
        companyPersistence[company][currentState] = val;
        setCompanyPersistence({ ...companyPersistence });
      },
    ];
  };

  const [checkedNodes, setCheckedNodes] = useStatePersistent([]);
  const [expandedNodes, setExpandedNodes] = useStatePersistent([]);
  const [tree, setTree] = useStatePersistent({});

  useEffect(() => {
  }, [company]);


  const handleCheckboxChange = (nodeName, checked, node) => {
    var recurNodes = [];

    var recurCheck = (node) => {
      if(node.children)
        {
          for(var child of node.children) {
            recurCheck(child)
          }
        }

        recurNodes.push(node.key)
    }


    recurCheck(node)

    if (checked) {
      setCheckedNodes([...checkedNodes, ...recurNodes, nodeName]);
    } else {
      setCheckedNodes(checkedNodes.filter((node) => !recurNodes.includes(node)).filter((node) => node !== nodeName));
    }
  };

  const toggleNodeExpansion = (nodeName) => {
    if (expandedNodes.includes(nodeName)) {
      setExpandedNodes(expandedNodes.filter((node) => node !== nodeName));
    } else {
      setExpandedNodes([...expandedNodes, nodeName]);
    }
  };

  const handleSelectAll = () => {
    const allNodes = getAllNodes(data);
    setCheckedNodes(allNodes);
  };

  const handleUnselectAll = () => {
    setCheckedNodes([]);
  };
  const getAllNodes = (nodes) => {
    let allNodes = [];
    nodes.forEach((node) => {
      allNodes.push(node.key);
      if (node.children) {
        allNodes = [...allNodes, ...getAllNodes(node.children)];
      }
    });
    return allNodes;
  };

  const renderNode = (node) => {
    var key = node.key;

    const isChecked = checkedNodes.includes(key);
    const isExpanded = expandedNodes.includes(key);
    const isLeaf = !node.children || node.children.length === 0;

    function getColor(meow) { 
      if(!meow) {
        return []
      }
      if(meow.skipped) {
        return [{color: "yellow", text: "BD.txt"}]
      }
      let color = "gray";
      if(meow.points == meow.max) {
        color = "lime";
      } else if(meow.points == 0) {
        color = "red";
      }
      return [{color, text: `${meow.points}/${meow.max}`}]
    }

    return (
      <li key={key}>
        <div className="tree-node">
          <span
            className={`tree-node__toggle ${isExpanded ? 'tree-node__toggle--expanded' : ''} ${
              isLeaf ? 'tree-node__toggle--leaf' : ''
            }`}
            onClick={() => toggleNodeExpansion(key)}
          />
          <label>
            <input
              type="checkbox"
              className="tree-node__checkbox"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(key, e.target.checked, node)}
            />
            <span
              className="tree-node__label"
              style={{ cursor: 'pointer' }}
            >
              {node.name}
               
            </span>
            {getColor(tree[key]).map(meow => <span key={key + "info"} style={{ color: meow.color }}> {meow.text}</span>)}
          </label>
        </div>
        {node.children && node.children.length > 0 && (
          <ul
            className={`tree-node__children ${isExpanded ? 'tree-node__children--expanded' : ''}`}
          >
            {node.children.map(renderNode)}
          </ul>
        )}
      
      </li>
    );
  };

  const renderTree = (data) => {
    return data.map((node) => renderNode(node));
  };

  function handleSubmit() {
    (async () => {
      try {
        const { tree } = await api.countPoints(checkedNodes, company);
        setTree(tree);
      } catch (error) {
        console.error('Error counting points:', error);
      }
    })();
  }

  const clearCache = async () => {
    setShowConfirmation(true);
  };

  const confirmClearCache = async (confirmed) => {
    setShowConfirmation(false);
    if (confirmed) {
      try {
        await api.clearCache();
        setCacheCleared(true);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };
  }
  
    useEffect(() => {
      if (cacheCleared) {
        window.location.reload();
      }
    }, [cacheCleared]);
  
    return (
      <div>
        <div className='button-container'>
          <button onClick={handleSelectAll} className='select-all'>Zaznacz wszystkie</button>
          <button onClick={handleUnselectAll} className='select-all'>Odznacz wszystkie</button>
        </div>
        <ul>{renderTree(data)}</ul>
        <button onClick={handleSubmit}>Policz punkty</button>
        <button style={{ color: 'red', fontWeight: 'bold' }} onClick={clearCache}>Wyczyść pamięć podręczną</button>
        {showConfirmation && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <p>Czy na pewno chcesz wyczyścić pamięć podręczną?</p>
              <button onClick={() => confirmClearCache(true)} className='yes-button-confirmation'>Tak</button>
              <button onClick={() => confirmClearCache(false)} className='no-button-confirmation'>Nie</button>
            </div>
          </div>
        )}
        <br />
      </div>
    );
  };
  
  export default TreeView;
  
