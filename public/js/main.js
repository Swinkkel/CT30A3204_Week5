
function initialize() {

    const todoForm = document.getElementById("todoForm")
    todoForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const userElement = document.getElementById("userInput")
        const user = userElement.value
        userElement.value = ""

        const todoElement = document.getElementById("todoInput")
        const todo = todoElement.value
        todoElement.value = ""

        const data = await fetch("/add", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({name: user, todo})
        }).catch((err) => {
            console.error("Fetch failed: ", err)
            return null
        })

        const msg = await data.text()
        console.log(msg)

        const message = document.getElementById("servermsg")
        message.innerText = msg
    })

    const searchForm = document.getElementById("searchForm")
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const searchElement = document.getElementById("searchInput")
        const name = searchElement.value
        searchElement.value = ""

        console.log("Search clicked");

        const response = await fetch(`/todos/${encodeURIComponent(name)}`)
        if (response.ok) {
            const todos = await response.json()

            const todoList = document.getElementById("todoList");
            todoList.innerHTML = "";
            todos.forEach((todo) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <label>
                        <input type="checkbox" class="checkBoxes" id="myCheckbox" data-id="${todo._id}" ${todo.checked ? 'checked' : ''} />
                        <span>${todo.todo}</span>
                        <a href="#" class="delete-task" data-id="${todo._id}">Delete</a>
                    </label>
                `;
                listItem.querySelector('.delete-task').addEventListener('click', async (event) => {
                    event.preventDefault();
                    const todo_res = await fetch('/update', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, todo_id: todo._id }),
                    });

                    console.log(`Deleting task: ${todo.todo}`);
                    listItem.remove(); // Remove this <li> from the DOM

                    const msg = await todo_res.text()
                    console.log(msg)
            
                    const message = document.getElementById("servermsg")
                    message.innerText = msg
                });

                listItem.querySelector('.checkBoxes').addEventListener('change', async (event) => {
                    event.preventDefault();

                    const todo_res = await fetch('/updateTodo', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, todo_id: todo._id, checked: event.target.checked }),
                    });

                    console.log(`Updating todo: ${todo.todo}`);

                    const msg = await todo_res.text()
                    console.log(msg)
            
                    const message = document.getElementById("servermsg")
                    message.innerText = msg
                });

                todoList.appendChild(listItem);
            });

            const deleteUserButton = document.createElement("button")
            deleteUserButton.id = "deleteUser"
            deleteUserButton.innerText = "Delete user"
            deleteUserButton.addEventListener("click", async() => {
                const delete_res = await fetch("/delete", {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({name})
                })

                if (delete_res.ok) {
                    console.log("Delete ok");
                }
                
                const msg = await delete_res.text()
                console.log(msg)
        
                const message = document.getElementById("servermsg")
                message.innerText = msg

                document.getElementById("todoList").innerHTML = ""
            })

            todoList.appendChild(deleteUserButton)

            console.log("response OK")
        }
        else {
            const msg = await response.text()
            console.log(msg)

            const message = document.getElementById("servermsg")
            message.innerText = msg
        }
    })


}

initialize()