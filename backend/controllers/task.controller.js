const Task = require("../models/task.model")

exports.createTask = async (req,res)=>{
    try {
        const {titre, description, priorite, status, assigne} = req.body
        const task = await Task.create({titre, description, priorite, status, assigne, createdBy: req.user._id})

            const taskWithUser = await Task.findById(task._id)
            .populate("assigne", "pseudo email") // pseudo et email du user assigné
            .populate("createdBy", "pseudo email"); // optionnel : si tu veux aussi celui qui a créé la tâche

        res.status(201).json(taskWithUser);
    } catch (error) {
        res.status(400).json({message: "Tâche non créé !"}, error)
    }
}



exports.getTask = async (req,res)=>{
    try {
        const {page = 1, limit = 2, priorite, status,} = req.query
        const filter = {}
        if(priorite) filter.priorite = priorite
        if(status) filter.status = status

        const task = await Task.find(filter)
        .populate("assigne", "pseudo email")
        .populate("createdBy", "pseudo email")
        .skip((page-1)*limit)
        .limit(parseInt(limit))
        .sort({createdAt: -1})
        res.json(task)
    } catch (error) {
        res.status(400).json({message: "Erreur d'affichage"})
    }
}


exports.updateTask = async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id)
        if(!task){return res.json({message: "Tâche non trouvé !"})}
        if(task.createdBy.toString()!==req.user._id.toString() && req.user.role !== "admin"){return res.status(403).json({message: "Non autorisé !"})}

        Object.assign(task, req.body)
        const updatedTask = await task.save()

            const populatedTask = await Task.findById(updatedTask._id)
            .populate("assigne", "pseudo email")
            .populate("createdBy", "pseudo email");


        res.status(200).json(populatedTask)
    } catch (error) {
        res.status(400).json({message: "Erreur", error})
    }
}



exports.deleteTask = async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id)
        if(!task){return res.json({message: "Tâche non trouvé !"})}
        if(task.createdBy.toString()!==req.user._id.toString() && req.user.role !=="admin"){return res.status(403).json({message: "Non autorisé !"})}
        await Task.deleteOne()

            const populatedTask = await Task.findById(task._id)
            .populate("assigne", "pseudo email")
            .populate("createdBy", "pseudo email");

        res.json({message: "Tâche supprimée avec succès !"}, populatedTask )
    } catch (error) {
        res.status(400).json({message: "Erreur de suppression !"})
    }
}