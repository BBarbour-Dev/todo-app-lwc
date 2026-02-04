public with sharing class TodoHandler {
  @AuraEnabled(cacheable=true)
  public static List<Todo__c> getTodoTasks() {
    return [
      SELECT Id, Description__c, Completed__c, Created_On__c
      FROM Todo__c
      WHERE CreatedById = :UserInfo.getUserId() AND Completed__c = FALSE
      ORDER BY Created_On__c
    ];
  }
  @AuraEnabled(cacheable=true)
  public static List<Todo__c> getCompletedTasks() {
    return [
      SELECT Id, Description__c, Completed__c, Created_On__c
      FROM Todo__c
      WHERE CreatedById = :UserInfo.getUserId() AND Completed__c = TRUE
      ORDER BY Created_On__c
    ];
  }
  @AuraEnabled
  public static void completeTodoTask(String taskId) {
    Todo__c task = new Todo__c();
    task.Id = taskId;
    task.Completed__c = true;
    update task;
  }
  @AuraEnabled
  public static void returnTodoTask(String taskId) {
    Todo__c task = new Todo__c();
    task.Id = taskId;
    task.Completed__c = false;
    update task;
  }
}
