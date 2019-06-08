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
  addToWorkspace: Scalars["String"];
  removeFromWorkspace?: Maybe<Scalars["String"]>;
  uploadResource: Resource;
  createFolder: Scalars["String"];
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

export type MutationAddToWorkspaceArgs = {
  projectId: Scalars["ID"];
  appId: Scalars["String"];
};

export type MutationRemoveFromWorkspaceArgs = {
  projectId: Scalars["ID"];
  appId: Scalars["String"];
};

export type MutationUploadResourceArgs = {
  project: Scalars["ID"];
  fileName: Scalars["String"];
  content: Scalars["Upload"];
};

export type MutationCreateFolderArgs = {
  project: Scalars["ID"];
  path: Scalars["String"];
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
  workspace: Array<Scalars["String"]>;
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
  listResources: Array<Resource>;
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

export type QueryListResourcesArgs = {
  project: Scalars["ID"];
};

export type QueryFindTaskByProjectArgs = {
  projectId: Scalars["ID"];
};

export type Resource = {
  project: Scalars["ID"];
  fileName: Scalars["String"];
  url?: Maybe<Scalars["String"]>;
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
export type AddToWorkspaceMutationVariables = {
  projectId: Scalars["ID"];
  appId: Scalars["String"];
};

export type AddToWorkspaceMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "addToWorkspace"
>;

export type RemoveFromWorkspaceMutationVariables = {
  projectId: Scalars["ID"];
  appId: Scalars["String"];
};

export type RemoveFromWorkspaceMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "removeFromWorkspace"
>;

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

export type PushNotificationMutationVariables = {
  receiver: Scalars["ID"];
  content: Scalars["String"];
};

export type PushNotificationMutation = { __typename?: "Mutation" } & {
  pushNotification: { __typename?: "Notification" } & Pick<
    Notification,
    "content"
  >;
};

export type NewNotificationSubscriptionVariables = {};

export type NewNotificationSubscription = { __typename?: "Subscription" } & {
  newNotification: Maybe<
    { __typename?: "Notification" } & Pick<Notification, "content">
  >;
};

export type GetMyProjectsQueryVariables = {
  username: Scalars["String"];
  cursor?: Maybe<Scalars["String"]>;
};

export type GetMyProjectsQuery = { __typename?: "Query" } & {
  findProjectsByUsername: { __typename?: "ProjectConnection" } & Pick<
    ProjectConnection,
    "nextCursor"
  > & {
      items: Array<
        { __typename?: "Project" } & Pick<
          Project,
          "id" | "name" | "role" | "workspace"
        > & {
            userRoles: Array<
              { __typename?: "UserRole" } & Pick<UserRole, "role"> & {
                  user: { __typename?: "User" } & Pick<User, "username">;
                }
            >;
          }
      >;
    };
};

export type GetProjectDetailQueryVariables = {
  projectId: Scalars["ID"];
};

export type GetProjectDetailQuery = { __typename?: "Query" } & {
  getProjectById: { __typename?: "Project" } & Pick<
    Project,
    "name" | "role"
  > & {
      userRoles: Array<
        { __typename?: "UserRole" } & Pick<UserRole, "role"> & {
            user: { __typename?: "User" } & Pick<User, "username">;
          }
      >;
    };
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
  me: { __typename?: "User" } & Pick<User, "username">;
};

export type UploadFileMutationVariables = {
  projectId: Scalars["ID"];
  fileName: Scalars["String"];
  content: any;
};

export type UploadFileMutation = { __typename?: "Mutation" } & {
  uploadResource: { __typename?: "Resource" } & Pick<Resource, "fileName">;
};

export type ListResourcesQueryVariables = {
  projectId: Scalars["ID"];
};

export type ListResourcesQuery = { __typename?: "Query" } & {
  listResources: Array<
    { __typename?: "Resource" } & Pick<Resource, "fileName" | "url">
  >;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

export const AddToWorkspaceDocument = gql`
  mutation AddToWorkspace($projectId: ID!, $appId: String!) {
    addToWorkspace(projectId: $projectId, appId: $appId)
  }
`;

@Injectable({
  providedIn: "root"
})
export class AddToWorkspaceGQL extends Apollo.Mutation<
  AddToWorkspaceMutation,
  AddToWorkspaceMutationVariables
> {
  document = AddToWorkspaceDocument;
}
export const RemoveFromWorkspaceDocument = gql`
  mutation RemoveFromWorkspace($projectId: ID!, $appId: String!) {
    removeFromWorkspace(projectId: $projectId, appId: $appId)
  }
`;

@Injectable({
  providedIn: "root"
})
export class RemoveFromWorkspaceGQL extends Apollo.Mutation<
  RemoveFromWorkspaceMutation,
  RemoveFromWorkspaceMutationVariables
> {
  document = RemoveFromWorkspaceDocument;
}
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
export const PushNotificationDocument = gql`
  mutation PushNotification($receiver: ID!, $content: String!) {
    pushNotification(receiver: $receiver, content: $content) {
      content
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class PushNotificationGQL extends Apollo.Mutation<
  PushNotificationMutation,
  PushNotificationMutationVariables
> {
  document = PushNotificationDocument;
}
export const NewNotificationDocument = gql`
  subscription NewNotification {
    newNotification {
      content
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class NewNotificationGQL extends Apollo.Subscription<
  NewNotificationSubscription,
  NewNotificationSubscriptionVariables
> {
  document = NewNotificationDocument;
}
export const GetMyProjectsDocument = gql`
  query GetMyProjects($username: String!, $cursor: String) {
    findProjectsByUsername(username: $username, cursor: $cursor) {
      items {
        id
        name
        role
        userRoles {
          user {
            username
          }
          role
        }
        workspace
      }
      nextCursor
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetMyProjectsGQL extends Apollo.Query<
  GetMyProjectsQuery,
  GetMyProjectsQueryVariables
> {
  document = GetMyProjectsDocument;
}
export const GetProjectDetailDocument = gql`
  query GetProjectDetail($projectId: ID!) {
    getProjectById(id: $projectId) {
      name
      userRoles {
        user {
          username
        }
        role
      }
      role
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetProjectDetailGQL extends Apollo.Query<
  GetProjectDetailQuery,
  GetProjectDetailQueryVariables
> {
  document = GetProjectDetailDocument;
}
export const MeDocument = gql`
  query Me {
    me {
      username
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
  document = MeDocument;
}
export const UploadFileDocument = gql`
  mutation UploadFile($projectId: ID!, $fileName: String!, $content: Upload!) {
    uploadResource(
      project: $projectId
      fileName: $fileName
      content: $content
    ) {
      fileName
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class UploadFileGQL extends Apollo.Mutation<
  UploadFileMutation,
  UploadFileMutationVariables
> {
  document = UploadFileDocument;
}
export const ListResourcesDocument = gql`
  query ListResources($projectId: ID!) {
    listResources(project: $projectId) {
      fileName
      url
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class ListResourcesGQL extends Apollo.Query<
  ListResourcesQuery,
  ListResourcesQueryVariables
> {
  document = ListResourcesDocument;
}
