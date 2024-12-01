import { Request, Response, Router } from "express"
import {compile} from "morgan"
import {User} from "./models/User"

const router: Router = Router()

router.post("/add", async (req: Request, res: Response) => {
    const {name, todo} = req.body

    console.log(req.body);

    try {
        const userEntry = await User.findOne({name})
        console.log(userEntry)

        if (userEntry) {
            userEntry.todos.push({todo});

            await userEntry.save();
        }
        else {
            const newUser = new User({
                name: name,
                todos: [{todo}]
            })

            console.log(newUser);

            await newUser.save();
        }

        console.log(userEntry)

        res.send(`Todo added successfully for user ${name}`)
    }
    catch (error) {
        res.status(500).send("Error adding todo");
    }
})

router.get("/todos/:id", async (req: Request, res: Response) => {
    const name = req.params.id;

    try {
        const userEntry = await User.findOne({name})
        console.log(userEntry)

        if (!userEntry) {
            res.status(404).send("User not found");
        }
        else {
            res.json(userEntry.todos);
        }
    }
    catch (error) {
        res.status(500).send('Error getting todos');
    }
})

router.delete("/delete", async (req: Request, res: Response) => {
    const { name } = req.body;

    console.log(req.body)
    console.log("Delete: " + name)

    try {
        await User.deleteOne({name})
        res.send("User deleted successfully.");
    }
    catch (e) {
        res.status(404).send("User not found.");
    }
});

router.put("/update", async (req: Request, res: Response) => {
    const { name, todo_id } = req.body;

    try {
        console.log(todo_id)

        const userEntry = await User.findOne({name})
        if (!userEntry) {
            res.status(404).send("User not found");        
        }
        else {
            console.log(userEntry)

            userEntry.todos = userEntry.todos.filter((todo) => todo._id?.toString() !== todo_id);

            userEntry.save()
            res.send(`Todo deleted successfully.`)
        }
    }
    catch (error) {
        res.status(404).send("User not found");    
    }
})

router.put("/updateTodo", async (req: Request, res: Response) => {
    const { name, todo_id, checked } = req.body;

    try {
        console.log(todo_id)

        const userEntry = await User.findOne({name})
        if (!userEntry) {
            res.status(404).send("User not found");        
        }
        else {
            console.log(userEntry)

            const todoEntry = userEntry.todos.find((t) => t._id?.toString() === todo_id);
            if (!todoEntry) {
                res.status(404).send("Todo not found")
            }
            else {
                todoEntry.checked = checked

                userEntry.save()
                res.send(`Todo updated successfully.`)
            }
        }
    }
    catch (error) {
        res.status(404).send("User not found");    
    }
})


export default router