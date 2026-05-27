const { buscarCitas } = require('./buscarCitasSkill');
const { cancelarCita } = require('./cancelarCitaSkill');

const processClaudeSkill = async (inputData) => {
    // Determine the action: either "buscar" or "cancelar"
    const action = inputData?.action || 'buscar';

    if (action === 'buscar' && inputData.email) {
        return await buscarCitas(inputData.email);
    } else if (action === 'cancelar') {
        return await cancelarCita(inputData.tipo, inputData.id, inputData.email, inputData.nombre_reserva);
    }
    
    return {
       success: false,
       message: "Skill ejecutada, pero faltan parámetros requeridos (email para buscar, o datos para cancelar)."
    };
};

module.exports = {
    processClaudeSkill
};
