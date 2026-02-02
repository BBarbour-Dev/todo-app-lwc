import { LightningElement, track } from "lwc";

export default class TodoApp extends LightningElement {
  @track pendingTasks = [];
  @track completedTasks = [];
  @track newTask = "";

  handleNewTask(event) {
    this.newTask = event.target.value;
  }

  handleSubmitTask() {
    if (this.newTask === "") return;
    const task = {
      id: crypto.randomUUID(),
      desc: this.newTask,
      completed: false,
      date: new Date().toString()
    };
    this.pendingTasks = [...this.pendingTasks, task];
    this.newTask = "";
  }

  handleCompleteTask(event) {
    console.log(event.target.dataset.id);
    const id = event.target.dataset.id;
    const completedTask = this.pendingTasks.find((task) => task.id === id);
    completedTask.completed = true;
    this.completedTasks = [...this.completedTasks, completedTask];
    const newTasks = this.pendingTasks.filter((task) => task.id !== id);
    this.pendingTasks = newTasks;
  }

  handleReturnTask(event) {
    const id = event.target.dataset.id;
    const returnedTask = this.completedTasks.find((task) => task.id === id);
    returnedTask.completed = false;
    this.pendingTasks = [...this.pendingTasks, returnedTask];
    const newTasks = this.completedTasks.filter((task) => task.id !== id);
    this.completedTasks = newTasks;
  }
}
