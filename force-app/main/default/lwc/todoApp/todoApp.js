import { refreshApex } from "@salesforce/apex";
import completeTodoTask from "@salesforce/apex/TodoHandler.completeTodoTask";
import getCompletedTasks from "@salesforce/apex/TodoHandler.getCompletedTasks";
import getTodoTasks from "@salesforce/apex/TodoHandler.getTodoTasks";
import returnTodoTask from "@salesforce/apex/TodoHandler.returnTodoTask";
import TODO_OBJECT from "@salesforce/schema/Todo__c";
import CREATED_ON_FIELD from "@salesforce/schema/Todo__c.Created_On__c";
import DESC_FIELD from "@salesforce/schema/Todo__c.Description__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { LightningElement, wire } from "lwc";

export default class TodoApp extends LightningElement {
  @wire(getTodoTasks)
  pendingTasks;

  @wire(getCompletedTasks)
  completedTasks;

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
      await refreshApex(this.pendingTasks);
    } catch (error) {
      console.error(error);
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error creating record",
          message: error,
          variant: "error"
        })
      );
    }
  }

  async handleCompleteTask(event) {
    try {
      const id = event.target.dataset.id;
      await completeTodoTask({ taskId: id });
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
