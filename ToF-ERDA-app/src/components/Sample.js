import React, { useState } from 'react';
import './Sample.css'; // Asegúrate de importar el archivo CSS

const Sample = ({ sample, setSample }) => {

  const [error, setError] = useState(''); // Mensaje de error
  const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
  const [success, setSuccess] = useState(''); // Mensaje de éxito

  // Inicializa el estado
  const [sampleData, setSampleData] = useState(sample);

  const handleSave = () => {
    const missingFields = [];
    const missingMessage = [];

    // Campos y mensajes de error
    if (!sampleData.type) missingFields.push('type') && missingMessage.push('Type');
    if (!sampleData.ID) missingFields.push('ID') && missingMessage.push('ID');


    // Si faltan campos, mostrar un mensaje de alerta
    if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingMessage.join(', ')}`);
        setSuccess(''); // Borra cualquier mensaje de éxito
        setInvalidFields(missingFields);

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
          window.electron.minimizeAndRestore();
      }
        return;
    }

    // Si no hay errores, guarda el sample
    setError('');
    setInvalidFields([]);
    setSuccess('Sample saved successfully!'); // Mostrar mensaje de éxito
    setSample({ ...sampleData });

    // Llamar a la API de Electron para minimizar y maximizar la ventana
    if (window.electron) {
      window.electron.minimizeAndRestore();
    }

  };

  const handleChange = (field, value) => {
    const updatedData = { ...sampleData, [field]: value };
    setSampleData(updatedData);
    setSample(updatedData); // Actualiza el estado global al mismo tiempo
  };

  return (
    <div className="sample-container">
      <h2>4. Sample</h2>

        {/* Mostrar mensaje de error */}
        {error && <div className="error-message">{error}</div>}

              {/* Mensaje de éxito */}
        {success && <div className="success-message">{success}</div>}

        <div className='sample-subsection'>

          <div className='row'>

          <div className="sample-form-group">
            <label>Type:</label>
            <select
              value={sampleData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              className={invalidFields.includes('type') ? 'invalid' : ''}
            >
              <option value="">Select Type</option>
              <option value="Callibration">Callibration</option>
              <option value="Test">Test</option>
            </select>
          </div>

          <div className="sample-form-group" name='last'>
            <label>ID:</label>
            <input
              name="ID"
              type="text"
              placeholder="Introduce the sample ID"
              value={sampleData.ID || ''}
              onChange={(e) => handleChange('ID', e.target.value)}
              className={invalidFields.includes('ID') ? 'invalid' : ''}
            />
          </div>
        
        </div>

        </div>

      <button className="btn-save-target" onClick={handleSave}>Save Sample</button>

    </div>
  );
};

export default Sample;

