import getTodos from "@salesforce/apex/TodoHandler.getTodos";
import TODO_OBJECT from "@salesforce/schema/Todo__c";
import CREATED_ON_FIELD from "@salesforce/schema/Todo__c.Created_On__c";
import DESC_FIELD from "@salesforce/schema/Todo__c.Description__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { LightningElement, wire } from "lwc";

export default class TodoApp extends LightningElement {
  @wire(getTodos)
  pendingTasks;
  // @track completedTasks = [];
  newTask = "";

  handleNewTask(event) {
    this.newTask = event.target.value;
  }

  async handleSubmitTask() {
    if (this.newTask === "") return;
    const fields = {
      [DESC_FIELD.fieldApiName]: this.newTask,
      [CREATED_ON_FIELD.fieldApiName]: new Date()
    };
    const recordInput = {
      apiName: TODO_OBJECT.objectApiName,
      fields
    };
    try {
      await createRecord(recordInput);
      this.newTask = "";
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error creating record",
          message: error,
          variant: "error"
        })
      );
    }
  }

  // handleCompleteTask(event) {
  //   const id = event.target.dataset.id;
  //   const completedTask = this.pendingTasks.find((task) => task.id === id);
  //   completedTask.completed = true;
  //   this.completedTasks = [...this.completedTasks, completedTask];
  //   const newTasks = this.pendingTasks.filter((task) => task.id !== id);
  //   this.pendingTasks = newTasks;
  // }

  // handleReturnTask(event) {
  //   const id = event.target.dataset.id;
  //   const returnedTask = this.completedTasks.find((task) => task.id === id);
  //   returnedTask.completed = false;
  //   this.pendingTasks = [...this.pendingTasks, returnedTask];
  //   const newTasks = this.completedTasks.filter((task) => task.id !== id);
  //   this.completedTasks = newTasks;
  // }
}
        new ShowToastEvent({
          title: "Error updating record",
          variant: "error"
        })
      );
    }
  }

  async handleReturnTask(event) {
    try {
      const id = event.target.dataset.id;
      await returnTodoTask({ taskId: id });
      await refreshApex(this.pendingTasks);
      await refreshApex(this.completedTasks);
    } catch (error) {
      console.error(error);
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error updating record",
          variant: "error"
        })
      );
    }
  }
}
