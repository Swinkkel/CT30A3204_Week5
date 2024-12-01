import { Request, Response, Router } from "express"
import {User} from "./models/User"

const router: Router = Router()

router.post("/add", async (req: Request, res: Response) => {
    const {name, todo} = req.body

    console.log(req.body);

    const userEntry = await User.findOne({name})
    console.log(userEntry)

    if (userEntry) {
        userEntry.todos.push({todo, checked: false});

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
})

router.get("/todos/:id", async (req: Request, res: Response) => {
    const name = req.params.id;

    const userEntry = await User.findOne({name})
    console.log(userEntry)

    if (!userEntry) {
        res.status(404).send("User not found");
    }
    else {
        res.json(userEntry.todos);
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
   
/*
    console.log(users)

    // Find the index of the user
    const userIndex = users.findIndex((u : TUser) => u.name === name);

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove user from the array
        console.log(users)
        res.send("User deleted successfully.");
    } else {
        res.status(404).send("User not found.");
    }
        */
});

router.put("/update", async (req: Request, res: Response) => {
    const { name, todo } = req.body;

    const userEntry = await User.findOne({name})
    console.log(userEntry)

    if (userEntry) {
        const todoIndex = userEntry.todos.indexOf(todo)
        if (todoIndex === -1) {
            res.status(404).send("Todo not found.");
        }

        userEntry.todos.splice(todoIndex, 1)

        await userEntry.save();

        res.send(`Todo deleted successfully.`)
    }
    else {
        res.status(404).send("User not found");    
    }

/*
    console.log(users)

    const userEntry = users.find((u : TUser) => u.name === name)
    if (!userEntry) {
        res.status(404).send("User not found.");
    }
    else {
        const todoIndex = userEntry.todos.indexOf(todo)
        if (todoIndex === -1) {
            res.status(404).send("Todo not found.");
        }

        userEntry.todos.splice(todoIndex, 1)

        console.log(users)

        res.send(`Todo deleted successfully.`)
    }
        */
})

export default router