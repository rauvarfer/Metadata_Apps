import React, { useState, useEffect } from 'react';
import './Sample.css'; // Asegúrate de importar el archivo CSS
import { type } from '@testing-library/user-event/dist/type';

const Sample = ({ sample, setSample }) => {

  const [error, setError] = useState(''); // Mensaje de error
  const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
  const [success, setSuccess] = useState(''); // Mensaje de éxito

  // Inicializa el estado
  const [sampleData, setSampleData] = useState(sample);

  const handleDecimalInput = (e, key, stateSetter) => {
    // Replace comma with dot
    const value = e.target.value.replace(',', '.');
    stateSetter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const missingFields = [];
    const missingMessage = [];

    // Campos y mensajes de error
    if (!sampleData.type) missingFields.push('type') && missingMessage.push('Type');
    if (!sampleData.ID) missingFields.push('ID') && missingMessage.push('ID');
    if (!sampleData.accummulatedCharge) missingFields.push('accummulatedCharge') && missingMessage.push('Charge')


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

    const toFloat = (value) => Number(value).toFixed(2);

    const sampleDataWithUnits = {
      sampleData: {
        type: sampleData.type,
        ID: sampleData.ID,
        accummulatedCharge: { value: toFloat(sampleData.accummulatedCharge), units: 'µC' },
        layerElements: sampleData.layerElements,
        layerThickness: { value: toFloat(sampleData.layerThickness), units: 'mm' },
        layerDensity: { value: toFloat(sampleData.layerDensity), units: 'g/cm³' },
        substrateElement: sampleData.substrateElement,
        substrateThickness: { value: toFloat(sampleData.substrateThickness), units: 'mm' },
        substrateDensity: { value: toFloat(sampleData.substrateDensity), units: 'g/cm³' }
    }
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

  // Cambios de entrada en tiempo real:
  // const handleChange = (field, value) => {
  //   const updatedData = { ...sampleData, [field]: value };
  //   setSampleData(updatedData);
  //   setSample(updatedData); // Actualiza el estado global al mismo tiempo
  // };

  return (
    <div className="sample-container">
      <h2>4. Sample</h2>

        {/* Mostrar mensaje de error */}
        {error && <div className="error-message">{error}</div>}

              {/* Mensaje de éxito */}
        {success && <div className="success-message">{success}</div>}

        <div className='sample-section'>

          <div className='row'>

            <div className="sample-form-group">
              <label>Type:</label>
              <select
                value={sampleData.type || ''}
                // Cambios de entrada en tiempo real: onChange={(e) => handleChange('type', e.target.value)}
                onChange={(e) => setSampleData({ ...sampleData, type: e.target.value })}
                className={invalidFields.includes('type') ? 'invalid' : ''}
              >
                <option value="">Select Type</option>
                <option value="Callibration">Callibration</option>
                <option value="Test">Test</option>
              </select>
            </div>

            <div className="sample-form-group">
              <label>ID:</label>
              <input
                name="ID"
                type="text"
                placeholder="Introduce the sample ID"
                value={sampleData.ID || ''}
                // Cambios de entrada en tiempo real: onChange={(e) => handleChange('ID', e.target.value)}
                onChange={(e) => setSampleData({ ...sampleData, ID: e.target.value })}
                className={invalidFields.includes('ID') ? 'invalid' : ''}
             />
            </div>

            <div className="sample-form-group">
              <label>Charge [µC]:</label>
              <input
                type="number"
			          placeholder = "0.00"
                step="0.01"
                ppattern="^\d+(\.\d+)?$"
                onWheel={(e) => e.target.blur()}
                value={sampleData.accummulatedCharge || ''}
                onChange={(e) => handleDecimalInput(e, 'accummulatedCharge', setSampleData)}
                className={invalidFields.includes('accummulatedCharge') ? 'invalid' : ''}
              />
            </div>
        
          </div>
          

        </div>

        <div className='sample-section'>

          <h3>4.1 Sample Layer</h3>

          <div className='sample-subsection'>

            <div className='row'>

              <div className="layerelements-form-group">
                <label>Elements:</label>
                <input
                  name="layerElements"
                  type="text"
                  value={sampleData.layerElements || ''}
                  // Cambios de entrada en tiempo real: onChange={(e) => handleChange('ID', e.target.value)}
                  onChange={(e) => setSampleData({ ...sampleData, layerElements: e.target.value })}
                  className={invalidFields.includes('layerElements') ? 'invalid' : ''}
               />
              </div>

              <div className="sample-form-group">
                <label>Thickness [mm]:</label>
                <input
                  type="number"
			            placeholder = "0.00"
                  step="0.01"
                  pattern="^\d+(\.\d+)?$"
                  onWheel={(e) => e.target.blur()}
                  value={sampleData.layerThickness || ''}
                  onChange={(e) => handleDecimalInput(e, 'layerThickness', setSampleData)}
                  className={invalidFields.includes('layerThickness') ? 'invalid' : ''}
                />
             </div>

             <div className="sample-form-group">
                <label>Density [g/cm³]:</label>
                <input
                  type="number"
			            placeholder = "0.00"
                  step="0.01"
                  pattern="^\d+(\.\d+)?$"
                  onWheel={(e) => e.target.blur()}
                  value={sampleData.layerDensity || ''}
                  onChange={(e) => handleDecimalInput(e, 'layerDensity', setSampleData)}
                  className={invalidFields.includes('layerDensity') ? 'invalid' : ''}
                />
             </div>

            </div>

            </div>
            </div>
   

        <div className='sample-section'>

          <h3>4.1 Substrate Layer</h3>

          <div className='sample-subsection'>

            <div className='row'>

              <div className="layerelements-form-group">
                 <label>Elements:</label>
                 <input
                     name="substrateElement"
                     type="text"
                     value={sampleData.substrateElement || ''}
                     // Cambios de entrada en tiempo real: onChange={(e) => handleChange('ID', e.target.value)}
                     onChange={(e) => setSampleData({ ...sampleData, substrateElement: e.target.value })}
                     className={invalidFields.includes('substrateElement') ? 'invalid' : ''}
                  />
              </div>

              <div className="sample-form-group">
                  <label>Thickness [mm]:</label>
                  <input
                     type="number"
                     placeholder = "0.00"
                     step="0.01"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={sampleData.substrateThickness || ''}
                     onChange={(e) => handleDecimalInput(e, 'substrateThickness', setSampleData)}
                     className={invalidFields.includes('substrateThickness') ? 'invalid' : ''}
                  />
              </div>

              <div className="sample-form-group">
                  <label>Density [g/cm³]:</label>
                  <input
                     type="number"
                     placeholder = "0.00"
                     step="0.01"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={sampleData.substrateDensity || ''}
                     onChange={(e) => handleDecimalInput(e, 'substrateDensity', setSampleData)}
                     className={invalidFields.includes('substrateDensity') ? 'invalid' : ''}
                  />
              </div>

            </div>
          </div>
        </div>




      <button className="btn-save-target" onClick={handleSave}>Save Sample</button>

    </div>
  );
};

export default Sample;

