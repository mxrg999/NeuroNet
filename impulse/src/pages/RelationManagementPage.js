import React, { useState, useEffect } from 'react';
import { getAllThings, createRelation, getRelations, deleteRelation, getAllRelations } from '../services/relationService';

const RelationManagementPage = () => {
  const [things, setThings] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [relationType, setRelationType] = useState('');
  const [relations, setRelations] = useState([]);
  const [allRelations, setAllRelations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchAllThings();
    fetchAllRelations();
  }, []);

  const fetchAllThings = async () => {
    try {
      const thingsData = await getAllThings();
      setThings(thingsData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching things');
      setMessageColor('red');
    }
  };

  const fetchAllRelations = async () => {
    try {
      const relationsData = await getAllRelations();
      setAllRelations(relationsData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching relations');
      setMessageColor('red');
    }
  };

  const handleAddProperty = () => {
    setProperties([...properties, { key: '', value: '' }]);
  };

  const handleRemoveProperty = (index) => {
    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);
  };

  const handlePropertyChange = (index, key, value) => {
    const newProperties = [...properties];
    newProperties[index][key] = value;
    setProperties(newProperties);
  };

  const handleCreateRelation = async (e) => {
    e.preventDefault();
    const propertiesObj = properties.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    const relationData = {
      source_id: sourceId,
      target_id: targetId,
      relation_type: relationType,
      properties: propertiesObj,
    };
    try {
      const response = await createRelation(relationData);
      setMessage('Relation created successfully');
      setMessageColor('green');
      fetchAllRelations();
    } catch (error) {
      setMessage(error.message || 'An error occurred while creating relation');
      setMessageColor('red');
    }
  };

  const handleDeleteRelation = async (relationId) => {
    try {
      const response = await deleteRelation(relationId);
      setMessage(response.message);
      setMessageColor('green');
      fetchAllRelations();
    } catch (error) {
      setMessage(error.message || 'An error occurred while deleting relation');
      setMessageColor('red');
    }
  };

  return (
    <div>
      <h2>Relation Management</h2>
      {message && <p style={{ color: messageColor }}>{message}</p>}

      <form onSubmit={handleCreateRelation}>
        <div>
          <label>Source Element:</label>
          <select value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
            <option value="">Select Source</option>
            {things.map((thing) => (
              <option key={thing.id} value={thing.id}>
                {thing.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Relation Type:</label>
          <input
            type="text"
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Destination Element:</label>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            <option value="">Select Destination</option>
            {things.map((thing) => (
              <option key={thing.id} value={thing.id}>
                {thing.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Properties:</label>
          {properties.map((property, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Key"
                value={property.key}
                onChange={(e) => handlePropertyChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={property.value}
                onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveProperty(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddProperty}>Add Property</button>
        </div>
        <button type="submit">Create Relation</button>
      </form>

      <h3>All Relations</h3>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Type</th>
            <th>Destination</th>
            <th>Properties</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allRelations.map((relation) => (
            <tr key={relation.relation_id}>
              <td>{relation.source_name} ({relation.source_id})</td>
              <td>{relation.relation_type}</td>
              <td>{relation.target_name} ({relation.target_id})</td>
              <td>{JSON.stringify(relation.properties)}</td>
              <td>
                <button onClick={() => handleDeleteRelation(relation.relation_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelationManagementPage;
