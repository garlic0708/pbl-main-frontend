type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

export type Mutation = {
  pushNotification: Notification;
  createProject: Project;
  addUserToProject: Project;
  changeRole: Project;
  createTask: Task;
  updateTask: Task;
  deleteTask: Task;
};

export type MutationPushNotificationArgs = {
  receiver: Scalars["ID"];
  content: Scalars["String"];
};

export type MutationCreateProjectArgs = {
  name: Scalars["String"];
};

export type MutationAddUserToProjectArgs = {
  projectId: Scalars["ID"];
  username: Scalars["String"];
  role: Role;
};

export type MutationChangeRoleArgs = {
  projectId: Scalars["ID"];
  username: Scalars["String"];
  role: Role;
};

export type MutationCreateTaskArgs = {
  args: UpdateTask;
  projectId: Scalars["ID"];
};

export type MutationUpdateTaskArgs = {
  id: Scalars["ID"];
  args: UpdateTask;
};

export type MutationDeleteTaskArgs = {
  id: Scalars["ID"];
};

export type Notification = {
  content: Scalars["String"];
};

export type Project = {
  id: Scalars["ID"];
  name: Scalars["String"];
  userRoles: Array<UserRole>;
  role: Role;
};

export type ProjectConnection = {
  items: Array<Project>;
  nextCursor?: Maybe<Scalars["String"]>;
};

export type Query = {
  _empty?: Maybe<Scalars["String"]>;
  me: User;
  getUserByUsername: User;
  getProjectById: Project;
  findProjectsByUsername: ProjectConnection;
  findTaskByProject: Array<Task>;
};

export type QueryGetUserByUsernameArgs = {
  username: Scalars["String"];
};

export type QueryGetProjectByIdArgs = {
  id: Scalars["ID"];
};

export type QueryFindProjectsByUsernameArgs = {
  username?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
};

export type QueryFindTaskByProjectArgs = {
  projectId: Scalars["ID"];
};

export enum Role {
  Instructor = "INSTRUCTOR",
  Admin = "ADMIN",
  Member = "MEMBER"
}

export type Subscription = {
  newNotification?: Maybe<Notification>;
};

export type Task = {
  id: Scalars["ID"];
  name: Scalars["String"];
  startDate: Scalars["DateTime"];
  duration: Scalars["Int"];
  progress: Scalars["Float"];
  assignee?: Maybe<User>;
  project: Project;
};

export type UpdateTask = {
  name?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["DateTime"]>;
  duration?: Maybe<Scalars["Int"]>;
  progress?: Maybe<Scalars["Float"]>;
  assigneeId?: Maybe<Scalars["ID"]>;
};

export type User = {
  username: Scalars["String"];
};

export type UserRole = {
  user: User;
  role: Role;
};
export type FindTaskByProjectQueryVariables = {
  project: Scalars["ID"];
};

export type FindTaskByProjectQuery = { __typename?: "Query" } & {
  findTaskByProject: Array<
    { __typename?: "Task" } & Pick<
      Task,
      "id" | "name" | "duration" | "startDate" | "progress"
    > & { assignee: Maybe<{ __typename?: "User" } & Pick<User, "username">> }
  >;
};

export type CreateTaskMutationVariables = {
  projectId: Scalars["ID"];
  args: UpdateTask;
};

export type CreateTaskMutation = { __typename?: "Mutation" } & {
  createTask: { __typename?: "Task" } & Pick<Task, "id">;
};

export type UpdateTaskMutationVariables = {
  taskId: Scalars["ID"];
  args: UpdateTask;
};

export type UpdateTaskMutation = { __typename?: "Mutation" } & {
  updateTask: { __typename?: "Task" } & Pick<Task, "id">;
};

export type DeleteTaskMutationVariables = {
  taskId: Scalars["ID"];
};

export type DeleteTaskMutation = { __typename?: "Mutation" } & {
  deleteTask: { __typename?: "Task" } & Pick<Task, "id">;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

export const FindTaskByProjectDocument = gql`
  query FindTaskByProject($project: ID!) {
    findTaskByProject(projectId: $project) {
      id
      name
      duration
      startDate
      progress
      assignee {
        username
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class FindTaskByProjectGQL extends Apollo.Query<
  FindTaskByProjectQuery,
  FindTaskByProjectQueryVariables
> {
  document = FindTaskByProjectDocument;
}
export const CreateTaskDocument = gql`
  mutation CreateTask($projectId: ID!, $args: UpdateTask!) {
    createTask(projectId: $projectId, args: $args) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreateTaskGQL extends Apollo.Mutation<
  CreateTaskMutation,
  CreateTaskMutationVariables
> {
  document = CreateTaskDocument;
}
export const UpdateTaskDocument = gql`
  mutation UpdateTask($taskId: ID!, $args: UpdateTask!) {
    updateTask(id: $taskId, args: $args) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class UpdateTaskGQL extends Apollo.Mutation<
  UpdateTaskMutation,
  UpdateTaskMutationVariables
> {
  document = UpdateTaskDocument;
}
export const DeleteTaskDocument = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(id: $taskId) {
      id
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class DeleteTaskGQL extends Apollo.Mutation<
  DeleteTaskMutation,
  DeleteTaskMutationVariables
> {
  document = DeleteTaskDocument;
}
