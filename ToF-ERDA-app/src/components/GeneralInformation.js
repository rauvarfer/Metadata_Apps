import React, { useState } from 'react';
import './GeneralInformation.css';

const GeneralInformation = ({ generalInfo, setGeneralInfo }) => {

    const [error, setError] = useState(''); // Mensaje de error
    const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
    const [success, setSuccess] = useState(''); // Mensaje de éxito

    const [proposal, setProposal] = useState({...generalInfo.proposal,
        code: generalInfo.proposal?.code ?? '',
        abstract: generalInfo.proposal?.abstract ?? ''
    })

    const [principalInvestigator, setPrincipalInvestigator] = useState({...generalInfo.principalInvestigator,
        PIname: generalInfo.principalInvestigator?.name ?? '',
        PIinstitution: generalInfo.principalInvestigator?.institution ?? '',
        PIemail: generalInfo.principalInvestigator?.email ?? ''
    });

    const [team, setTeam] = useState([]);

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

        const missingFields = [];
        const missingMessage = [];

        // Validación de campos
        if (!proposal.code) missingFields.push('code') && missingMessage.push('Proposal Code');
        if (!principalInvestigator.PIname) missingFields.push('PIname') && missingMessage.push('PI name');
        if (!principalInvestigator.PIinstitution) missingFields.push('PIinstitution') && missingMessage.push('PI institution');

        // Si faltan campos, mostrar error
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingMessage.join(', ')}`);
            setSuccess(''); // Borra cualquier mensaje de éxito
            setInvalidFields(missingFields);

            if (window.electron) {
                window.electron.minimizeAndRestore();
            }    
            return;
        }    
        
        // Crear el objeto generalInfo
        const newGeneralInfo = {
            proposal: { 
                code: proposal.code,
                abstract: proposal.abstract
            },
            principalInvestigator: {
                name: principalInvestigator.PIname,
                institution: principalInvestigator.PIinstitution,
                email: principalInvestigator.PIemail
            },
            team: team
        };

        // Guardar los datos del experimento
        // Si no hay errores, guarda
        setError('');
        setInvalidFields([]);
        setSuccess('General information saved successfully!'); // Mostrar mensaje de éxito
        setGeneralInfo({
            ...newGeneralInfo
        });

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
            window.electron.minimizeAndRestore();
        }

    };

return (
        <div className="general-information-container">
            <h2>1. General Information</h2>

            {/* Mostrar mensaje de error */}
            {error && <div className="error-message">{error}</div>}

            {/* Mensaje de éxito */}
            {success && <div className="success-message">{success}</div>}
			
			<div className="section">
            <h3>1.1 Proposal</h3>

                <div className='sub-section'>

                    <div className='row'>
                    <div className="form-group">
                        <label>Proposal code:</label>
                        <input
                            name='proposalCode'
                            type="text"
                            value={proposal.code || ''}
                            onChange={(e) => setProposal((prev) => ({ ...prev, code: e.target.value }))}
                            className={invalidFields.includes('code') ? 'invalid' : ''}
                        />
                    </div>
                    </div>
                    <div className="form-group">
                        <label>Abstract:</label>
                        <textarea
                            value={proposal.abstract || ''}
                            placeholder="Provide a brief description of the experiment"
                            onChange={(e) => setProposal((prev) => ({ ...prev, abstract: e.target.value }))}
                            className="abstract-textarea"
                        />
                    </div>
                </div>

            </div>
			
            <div className="section">
                <h3>1.2 Principal Investigator</h3>

                <div className='sub-section'>
                
                <div className='row'>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={principalInvestigator.PIname}
                        onChange={(e) => setPrincipalInvestigator((prev) => ({ ...prev, PIname: e.target.value }))}
                        className={invalidFields.includes('PIname') ? 'invalid' : ''}
                    />
                </div>
                <div className="form-group">
                    <label>Institution:</label>
                    <input
                        type="institution"
                        value={principalInvestigator.PIinstitution}
                        onChange={(e) => setPrincipalInvestigator((prev) => ({ ...prev, PIinstitution: e.target.value }))}
                        className={invalidFields.includes('PIinstitution') ? 'invalid' : ''}
                    />
                </div>
                
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={principalInvestigator.PIemail}
                        onChange={(e) => setPrincipalInvestigator((prev) => ({ ...prev, PIemail: e.target.value }))}
                    />
                </div>

                </div>

                </div>
            </div>

            <div className="section">
			
                <h3>1.3 Experimental Team</h3>

               
				
                {team.map((member, index) => (
                    
                    <div className='sub-section'>

                    <div className='row'>

                    <div key={index} className="form-group">

                        <label>Name:</label>
                        <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                        />

                        <label>Institution:</label>
                        <input
                            type="institution"
                            value={member.institution}
                            onChange={(e) => handleTeamChange(index, 'institution', e.target.value)}
                        />

                        <label>Email:</label>
                        <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleTeamChange(index, 'email', e.target.value)}
                        />
                        
                    
                    </div>

                    </div>

                    <button className="btn-remove-member" onClick={() => handleRemoveMember(index)}>Remove Member</button>
                
                    </div>
                
                ))}

               
                <button className="btn-add-member" onClick={handleAddMember}>Add new member</button>
            </div>

            <button className="btn-save-geninfo" onClick={handleSave}>Save General Information</button>
        </div>
    );
};

export default GeneralInformation;
