import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import './App.css';
import GeneralInformation from './components/GeneralInformation';
import ExperimentSetup from './components/ExperimentSetup';
import Detector from './components/Detector';
//import Sample from './components/Sample';

function App() {

  const [error, setError] = useState(''); // Estado para el mensaje de error
  const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos

  const [generalInfo, setGeneralInfo] = useState({});
  const [experimentSetup, setExperimentSetup] = useState({});
  const [detectors, setDetectors] = useState({});
//  const [sample, setSample] = useState({});

  const [activeTab, setActiveTab] = useState('General Information');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'General Information':
        return <GeneralInformation setGeneralInfo={setGeneralInfo} generalInfo={generalInfo} />;
      case 'Experiment Setup':
        return <ExperimentSetup setExperimentSetup={setExperimentSetup} experimentSetup={experimentSetup} />;
      case 'Detection System':
        return <Detector setDetectors={setDetectors} detectors={detectors}/>;
//      case 'Sample':
//        return <Sample setSample={setSample} sample={sample}  />;
      default:
        return <GeneralInformation setGeneralInfo={setGeneralInfo} generalInfo={generalInfo} />;
    }
  };
  
  const handleSave = () => {

    const missingFields = [];
    
    // Validación de campos para "Beam Settings"
    if (!generalInfo.proposal) missingFields.push('General Info.');
    if (!experimentSetup.beamSettings) missingFields.push('Experiment Setup');
    if (!detectors.genParams) missingFields.push('Detection System');
//    if (!sample.ID) missingFields.push('Sample');
    
    // Si faltan campos, mostrar error
    if (missingFields.length > 0) {
        setError(`Missing required forms: ${missingFields.join(', ')}`);
        setInvalidFields(missingFields);
        alert(`Missing required forms: ${missingFields.join(', ')}`);
        if (window.electron) {
            window.electron.minimizeAndRestore();
        }    
        return;
    }

    // Guardar los datos del experimento
    setError('');
    setInvalidFields([]);
    alert('JSON saved successfully');
    const jsonData = {
      date: new Date().toISOString(),
      generalInfo,
      experimentSetup,
      detectors,
//      sample,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `experiment_${new Date().toISOString()}.json`);
    
    // Llamar a la API de Electron para minimizar y maximizar la ventana
    if (window.electron) {
        window.electron.minimizeAndRestore();
    }

  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // Validar estructura del JSON cargado (puedes añadir más validaciones según sea necesario)
        if (jsonData.generalInfo && jsonData.experimentSetup && jsonData.detectors) {
          setGeneralInfo(jsonData.generalInfo)
          setExperimentSetup(jsonData.experimentSetup);
          setDetectors(jsonData.detectors);
//          setSample(jsonData.sample);
          alert('JSON loaded successfully');

          // Cambiar la pestaña activa condicionalmente
          if (activeTab === 'General Info.') {
            setActiveTab('Experiment Setup');
        } else {
            setActiveTab('General Info.');
        }

          // Llamar a la API de Electron para minimizar y maximizar la ventana
          if (window.electron) {
          window.electron.minimizeAndRestore();
        }
          
        } else {
          alert('Invalid JSON structure');

          // Cambiar la pestaña activa condicionalmente
          if (activeTab === 'General Info.') {
            setActiveTab('Experiment Setup');
          } else {
            setActiveTab('General Info.');
          }

          // Llamar a la API de Electron para minimizar y maximizar la ventana
          if (window.electron) {
            window.electron.minimizeAndRestore();
          }
        }
      } catch (error) {
        alert('Error reading JSON file');

        // Cambiar la pestaña activa condicionalmente
        if (activeTab === 'General Info.') {
          setActiveTab('Experiment Setup');
        } else {
        setActiveTab('General Info.');
        }

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
          window.electron.minimizeAndRestore();
        }
      }
    };

    reader.readAsText(file);
  
  };

  const handleClean = () => {
    // Restablecer los estados
    setGeneralInfo({});
    setExperimentSetup({});
    setDetectors({});
//    setSample({});
    setError('');
    alert('All data has been cleaned.');

    // Cambiar la pestaña activa condicionalmente
    if (activeTab === 'General Info.') {
      setActiveTab('Experiment Setup');
    } else {
      setActiveTab('General Info.');
    }

    // Llamar a la API de Electron para minimizar y maximizar la ventana
    if (window.electron) {
        window.electron.minimizeAndRestore();
      }
  };

  /* 
        <button 
        onClick={() => setActiveTab('Sample')}
        className={invalidFields.includes('Sample') ? 'invalid' : ''} 
        >Sample</button>
  */
  
  return (
    <div className="container">

      <h1>IBA Metadata Generator</h1>

      <div className="tab-buttons">

      <button 
        onClick={() => setActiveTab('General Info.')}
        className={invalidFields.includes('General Info.') ? 'invalid' : ''} 
        >General Info.</button>

        <button 
        onClick={() => setActiveTab('Experiment Setup')}
        className={invalidFields.includes('Experiment Setup') ? 'invalid' : ''} 
        >Experiment Setup</button>

        <button 
        onClick={() => setActiveTab('Detection System')}
        className={invalidFields.includes('Detection System') ? 'invalid' : ''} 
        >Detection System</button>

      </div>

      {renderTabContent()}

<div className='row'>
      <button className="btn-save-json" onClick={handleSave}>Save JSON</button>

      <label className="btn-load-json">
          Load JSON
          <input type="file" accept=".json" onChange={handleLoad} style={{ display: 'none' }} />
      </label>

      <button className="btn-clean-json" onClick={handleClean}>Clean JSON</button>

      </div>



    </div>
  );
}

export default App;
