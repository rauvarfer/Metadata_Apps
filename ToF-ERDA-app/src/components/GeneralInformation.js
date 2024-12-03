import React, { useState } from 'react';
import './GeneralInformation.css';

const GeneralInformation = ({ setGeneralInfo }) => {
    const [principalInvestigator, setPrincipalInvestigator] = useState({
        name: '', institution: '', email: ''
    });
    const [team, setTeam] = useState([]);
	const [proposalCode, setProposalCode] = useState('');
    const [abstract, setAbstract] = useState('');
	const [error, setError] = useState(''); // Estado para el mensaje de error

    const handleAddMember = () => {
        if (team.length < 4) {
            setTeam([...team, { name: '', institution: '', email: '' }]);
        }
    };

    const handleRemoveMember = (index) => {
        setTeam(team.filter((_, i) => i !== index));
    };

    const handleTeamChange = (index, key, value) => {
        const newTeam = [...team];
        newTeam[index][key] = value;
        setTeam(newTeam);
    };

    const handleSave = () => {

        // Validar si los campos requeridos están vacío
        const missingFields = [];
        if (!proposalCode) missingFields.push('Proposal Code');
        if (!principalInvestigator.name) missingFields.push('PI name');
        if (!principalInvestigator.institution) missingFields.push('PI institution');

        if (missingFields.length > 0) {
            setError(`Missing required fields: ${missingFields.join(', ')}`);
            alert(`Missing required fields: ${missingFields.join(', ')}`);
            if (window.electron) {
                window.electron.minimizeAndRestore();
            }    
            return;
        }        
        
        // Si todos los campos requeridos están completos, limpiar el error y guardar la información
        setError('');
        alert('General information saved successfully');
        setGeneralInfo({
            proposalCode,
            abstract,
            principalInvestigator,
            team
        });

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
            window.electron.minimizeAndRestore();
        }

		// Reenfocar en el primer campo de entrada del siguiente grupo
        const currentInputs = document.querySelector("select[name='element']");
        currentInputs.focus();

    };

return (
        <div className="general-information-container">
            <h2>1. General Information</h2>
			
			<div className="section">
                <h3>1.1 Proposal</h3>
                <div className="form-group">
                    <label>Proposal code:</label>
                    <input
                        name='proposal'
                        type="text"
                        placeholder="Introduce the proposal code"
                        value={proposalCode}
                        onChange={(e) => setProposalCode(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Abstract:</label>
                    <textarea
                        value={abstract}
                        placeholder="Provide a brief description of the experiment"
                        onChange={(e) => setAbstract(e.target.value)}
                        className="abstract-textarea"
                    />
                </div>
            </div>
			
            <div className="section">
                <h3>1.2 Principal Investigator</h3>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Introduce PI's name"
                        value={principalInvestigator.name}
                        onChange={(e) => setPrincipalInvestigator({ ...principalInvestigator, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Institution:</label>
                    <input
                        type="text"
                        placeholder="Introduce PI's institution"
                        value={principalInvestigator.institution}
                        onChange={(e) => setPrincipalInvestigator({ ...principalInvestigator, institution: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Introduce PI's email"
                        value={principalInvestigator.email}
                        onChange={(e) => setPrincipalInvestigator({ ...principalInvestigator, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="section">
			
                <h3>1.3 Experimental Team</h3>
				
                {team.map((member, index) => (
                    <div key={index} className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            placeholder="Introduce member's name"
                            value={member.name}
                            onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                        />

                        <label>Institution:</label>
                        <input
                            type="text"
                            placeholder="Introduce member's institution"
                            value={member.institution}
                            onChange={(e) => handleTeamChange(index, 'institution', e.target.value)}
                        />

                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Introduce member's email"
                            value={member.email}
                            onChange={(e) => handleTeamChange(index, 'email', e.target.value)}
                        />
                        <button className="btn-remove-member" onClick={() => handleRemoveMember(index)}>Remove Member</button>
                    </div>
                ))}
                <button className="btn-add-member" onClick={handleAddMember}>Add new team members</button>
            </div>

            <button className="btn-save-geninfo" onClick={handleSave}>Save General Information</button>
        </div>
    );
};

export default GeneralInformation;
