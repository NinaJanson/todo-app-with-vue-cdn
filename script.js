Vue.createApp({
  data() {
    return {
      todos: [],
      newTask: "",
      listOfSelectedTodos: "all",
      searchValue: "",
    };
  },
  methods: {
    async fetchTodos() {
      const response = await fetch("http://localhost:4730/todos");
      this.todos = await response.json();
    },
    async addNewTodo() {
      if (this.newTask.length > 0) {
        const newTaskData = {
          task: this.newTask,
          done: false,
        };

        const response = await fetch("http://localhost:4730/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTaskData),
        });
        const newTodoFromApi = await response.json();
        this.todos.push(newTodoFromApi);

        this.newTask = "";
      }
    },

    async updateDoneStatus(index) {
      // this.todos[index].done = !this.todos[index].done;
      let todoUpdate = this.todos[index];
      todoUpdate.done = !todoUpdate.done;

      const response = await fetch(
        "http://localhost:4730/todos/" + this.todos[index].id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todoUpdate),
        }
      );
      // this.todos = await response.json();
      const updatedTodo = await response.json();
    },

    async removeDoneTodos() {
      /*    //this.todos = this.todos.filter((todo) => !todo.done);

      this.todos.forEach((todo) => {
        if (todo.done) {
          const response = fetch("http://localhost:3000/todos/" + todo.id, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then();
          //this.todos = response.json();
        }
      });
    },
    */
      this.todos.forEach(async (todo) => {
        if (todo.done) {
          const response = await fetch(
            "http://localhost:4730/todos/" + todo.id,
            {
              method: "DELETE",
            }
          );
          await response.json();
        }
      });

      //this.todos = this.todos.filter((todo) => !todo.done);
      this.fetchTodos();

      // this.todos
    },
  },

  computed: {
    todoList() {
      let result = [];
      if (this.listOfSelectedTodos === "all") {
        result = this.todos;
      } else if (this.listOfSelectedTodos === "done") {
        result = this.todos.filter((todo) => todo.done);
      } else if (this.listOfSelectedTodos === "open") {
        result = this.todos.filter((todo) => !todo.done);
      }
      if (this.searchValue.length > 0) {
        result = result.filter((todo) => todo.task.includes(this.searchValue));
      }
      return result;
    },
  },

  async created() {
    this.fetchTodos();
  },
}).mount("#app");
