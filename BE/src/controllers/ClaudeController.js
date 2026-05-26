const { processClaudeSkill } = require('../skills/claudeSkill');

const executeSkill = async (req, res) => {
    try {
        const { input } = req.body;
        
        // Ejecutar la skill importada del archivo principal de skills
        const result = await processClaudeSkill(input);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al ejecutar la skill de Claude:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al procesar la solicitud con Claude",
            error: error.message
        });
    }
};

module.exports = {
    executeSkill
};
