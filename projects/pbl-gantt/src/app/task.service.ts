import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {GraphqlService, ProjectDetail} from 'pbl-lib';
import {CreateTaskGQL, DeleteTaskGQL, FindTaskByProjectGQL, UpdateTask, UpdateTaskGQL} from '../generated/graphql';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {formatDate} from '@angular/common';
// @ts-ignore
import * as parse from 'date-fns/parse/index';

export interface Task {
  id: string;
  start_date: string;
  text: string;
  assignee: string;
  progress: number;
  duration: number;
  parent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private graphql: GraphqlService,
              private findTaskGQL: FindTaskByProjectGQL,
              private createTaskGQL: CreateTaskGQL,
              private updateTaskGQL: UpdateTaskGQL,
              private deleteTaskGQL: DeleteTaskGQL,
              @Inject(LOCALE_ID) private locale: string,) {
  }

  private static convertTask(task: Task): UpdateTask {
    const {text, start_date, progress, duration} = task;
    console.log(parse);
    const formattedDate = parse(start_date, 'yyyy-MM-dd HH:mm', new Date()).toISOString();
    console.log('new start date', formattedDate);
    return {name: text, startDate: formattedDate, progress, duration};
  }

  findTask(projectId: string): Observable<Task[]> {
    return this.graphql.executeQuery(
      this.findTaskGQL.fetch({project: projectId})
        .pipe(map(({data: {findTaskByProject}}) =>
          findTaskByProject.map(task => {
            const {name, startDate, assignee, ...rest} = task;
            const formattedDate = formatDate(startDate, 'yyyy-MM-dd HH:mm', this.locale);
            console.log('formatted date', formattedDate);
            return {
              text: name, start_date: formattedDate,
              assignee: assignee && assignee.username, ...rest
            };
          })))
    );
  }

  createTask(projectId: string, task: Task): Promise<string> {
    return this.graphql.executeQuery(
      this.createTaskGQL.mutate({projectId, args: TaskService.convertTask(task)})
        .pipe(map(({data: {createTask: {id}}}) => id))
    ).toPromise();
  }

  private updateTaskConverted(taskId: string, args: UpdateTask): Observable<void> {
    return this.graphql.executeQuery(
      this.updateTaskGQL.mutate({taskId, args})
    );
  }

  updateTask(taskId: string, args: Task): Promise<void> {
    return this.updateTaskConverted(taskId, TaskService.convertTask(args)).toPromise();
  }

  assignTaskTo(taskId: string, username: string): Observable<void> {
    return this.updateTaskConverted(taskId, {assigneeId: username});
  }

  deleteTask(taskId: string): Promise<void> {
    return this.graphql.executeQuery(
      this.deleteTaskGQL.mutate({taskId})
    ).toPromise();
  }

  getCurrentProject(): Observable<ProjectDetail> {
    return this.graphql.getCurrentProject();
  }

}
