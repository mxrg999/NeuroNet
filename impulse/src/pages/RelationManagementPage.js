import React, { useState, useEffect } from 'react';
import { getAllThings, getAllUsers, createRelation, deleteRelation, getAllRelations, updateRelation } from '../services/relationService';

const RelationManagementPage = () => {
  const [things, setThings] = useState([]);
  const [users, setUsers] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [relationType, setRelationType] = useState('');
  const [relations, setRelations] = useState([]);
  const [allRelations, setAllRelations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editProperties, setEditProperties] = useState([]);
  const [editingRelation, setEditingRelation] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchAllThings();
    fetchAllUsers();
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

  const fetchAllUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching users');
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

  const handleEditPropertiesChange = (index, key, value) => {
    const newProperties = [...editProperties];
    newProperties[index][key] = value;
    setEditProperties(newProperties);
  };

  const handleAddEditProperty = () => {
    setEditProperties([...editProperties, { key: '', value: '' }]);
  };

  const handleRemoveEditProperty = (index) => {
    const newProperties = [...editProperties];
    newProperties.splice(index, 1);
    setEditProperties(newProperties);
  };

  const handleEditRelation = (relation) => {
    setEditingRelation(relation);
    const relationProperties = Object.entries(relation.properties).map(([key, value]) => ({ key, value }));
    setEditProperties(relationProperties);
  };

  const handleSaveEdit = async () => {
    if (!editingRelation) return;
    const propertiesObj = editProperties.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});

    // Set removed properties to null
    Object.keys(editingRelation.properties).forEach((key) => {
      if (!(key in propertiesObj)) {
        propertiesObj[key] = null;
      }
    });

    const relationData = {
      properties: propertiesObj,
    };
    try {
      await updateRelation(editingRelation.relation_id, relationData);
      setMessage('Relation updated successfully');
      setMessageColor('green');
      setEditingRelation(null);
      fetchAllRelations();
    } catch (error) {
      setMessage(error.message || 'An error occurred while updating relation');
      setMessageColor('red');
    }
  };

  const getElementNameById = (id) => {
    const thing = things.find(t => t.id === id);
    if (thing) return thing.name;
    const user = users.find(u => u.id === id);
    if (user) return user.username;
    return id;
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
                Thing: {thing.name}
              </option>
            ))}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                User: {user.username}
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
                Thing: {thing.name}
              </option>
            ))}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                User: {user.username}
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
              <td>{getElementNameById(relation.source_id)}</td>
              <td>{relation.relation_type}</td>
              <td>{getElementNameById(relation.target_id)}</td>
              <td>{JSON.stringify(relation.properties)}</td>
              <td>
                <button onClick={() => handleEditRelation(relation)}>Edit</button>
                <button onClick={() => handleDeleteRelation(relation.relation_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRelation && (
        <div>
          <h3>Edit Relation</h3>
          <div>
            <label>Properties:</label>
            {editProperties.map((property, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Key"
                  value={property.key}
                  onChange={(e) => handleEditPropertiesChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={property.value}
                  onChange={(e) => handleEditPropertiesChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveEditProperty(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddEditProperty}>Add Property</button>
          </div>
          <button type="button" onClick={handleSaveEdit}>Save</button>
          <button type="button" onClick={() => setEditingRelation(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default RelationManagementPage;
