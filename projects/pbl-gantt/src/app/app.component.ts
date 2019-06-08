import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Task, TaskService} from './task.service';

import 'dhtmlx-gantt';
import 'ng-zorro-antd';
import {AUTH_CONFIG, AuthConfig, ProjectDetail, Role, UserRole} from 'pbl-lib';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pbl-gantt';
  projectId: string;
  projectDetail: ProjectDetail;
  nonInstructors: UserRole[];
  @ViewChild('gantt') ganttContainer: ElementRef;

  selectedTaskId: string;
  updatingAssignee = false;

  constructor(private taskService: TaskService,
              @Inject(AUTH_CONFIG) private authConfig: AuthConfig,) {
    this.projectId = this.authConfig.projectId;
    this.taskService.getCurrentProject()
      .subscribe(v => {
        this.projectDetail = v;
        this.nonInstructors = v.userRoles.filter(x => x.role !== Role.Instructor);
      });
  }

  ngOnInit(): void {

    gantt.config.xml_date = '%Y-%m-%d %H:%i';
    gantt.init(this.ganttContainer.nativeElement);

    gantt.createDataProcessor({
      task: {
        update: (data: Task) => {
          console.log('update task', data);
          return this.taskService.updateTask(data.id, data);
        },
        create: (data: Task) => this.taskService.createTask(this.projectId, data)
          .then(id => {
            gantt.changeTaskId(data.id, id);
            this.selectedTaskId = id;
          }),
        delete: (id) => this.taskService.deleteTask(id)
      },
      link: {},
    });

    gantt.attachEvent('onTaskSelected', id => {
      if (!Number.isInteger(id)) {
        this.selectedTaskId = id;
      }
    });
    gantt.attachEvent('onTaskUnselected', id => {
      if (this.selectedTaskId === id) {
        this.selectedTaskId = null;
      }
    });

    this.taskService.findTask(this.projectId)
      .subscribe(task => {
        console.log('got data', task);
        return gantt.parse({data: task});
      });
  }

  get selectedTask(): Task {
    if (this.selectedTaskId) {
      return gantt.getTask(this.selectedTaskId);
    }
  }

  assigneeClick(username: string) {
    if (username !== this.selectedTask.assignee) {
      this.updatingAssignee = true;
      this.taskService.assignTaskTo(this.selectedTaskId, username)
        .subscribe(() => {
          this.selectedTask.assignee = username;
          this.updatingAssignee = false;
        });
    }
  }
}
