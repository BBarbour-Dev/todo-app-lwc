/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class TodoHandlerTest {
  // Utility method to create tasks for the running user
  private static List<Todo__c> createTasks() {
    List<Todo__c> tasks = new List<Todo__c>{
      new Todo__c(
        Description__c = 'Task 1',
        Completed__c = false,
        Created_On__c = DateTime.now()
      ),
      new Todo__c(
        Description__c = 'Task 2',
        Completed__c = true,
        Created_On__c = DateTime.now().addMinutes(1)
      )
    };
    insert tasks;
    return tasks;
  }
  @IsTest
  static void testGetTodoTasks() {
    List<Todo__c> tasks = createTasks();

    Test.startTest();
    List<Todo__c> result = TodoHandler.getTodoTasks();
    Test.stopTest();

    System.assertEquals(
      1,
      result.size(),
      'Should return only incomplete tasks'
    );
    System.assertEquals(false, result[0].Completed__c);
    System.assertEquals(tasks[0].Id, result[0].Id);
  }
  @IsTest
  static void testGetCompletedTasks() {
    List<Todo__c> tasks = createTasks();

    Test.startTest();
    List<Todo__c> result = TodoHandler.getCompletedTasks();
    Test.stopTest();

    System.assertEquals(1, result.size(), 'Should return only completed tasks');
    System.assertEquals(true, result[0].Completed__c);
    System.assertEquals(tasks[1].Id, result[0].Id);
  }
  @IsTest
  static void testCompleteTodoTask() {
    List<Todo__c> tasks = createTasks();
    Id taskId = tasks[0].Id;

    Test.startTest();
    TodoHandler.completeTodoTask(taskId);
    Test.stopTest();

    Todo__c updatedTask = [SELECT Completed__c FROM Todo__c WHERE Id = :taskId];
    System.assertEquals(
      true,
      updatedTask.Completed__c,
      'Task should be marked complete'
    );
  }
  @IsTest
  static void testReturnTodoTask() {
    List<Todo__c> tasks = createTasks();
    Id taskId = tasks[1].Id;

    Test.startTest();
    TodoHandler.returnTodoTask(taskId);
    Test.stopTest();

    Todo__c updatedTask = [SELECT Completed__c FROM Todo__c WHERE Id = :taskId];
    System.assertEquals(
      false,
      updatedTask.Completed__c,
      'Task should be marked incomplete'
    );
  }
}
