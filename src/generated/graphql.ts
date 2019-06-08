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
  removeUserFromProject: Project;
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

export type MutationRemoveUserFromProjectArgs = {
  projectId: Scalars["ID"];
  username: Scalars["String"];
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

export type CreateProjectMutationVariables = {
  name: Scalars["String"];
};

export type CreateProjectMutation = { __typename?: "Mutation" } & {
  createProject: { __typename?: "Project" } & Pick<
    Project,
    "id" | "name" | "role" | "workspace"
  > & {
      userRoles: Array<
        { __typename?: "UserRole" } & Pick<UserRole, "role"> & {
            user: { __typename?: "User" } & Pick<User, "username">;
          }
      >;
    };
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
export const CreateProjectDocument = gql`
  mutation CreateProject($name: String!) {
    createProject(name: $name) {
      id
      name
      userRoles {
        user {
          username
        }
        role
      }
      role
      workspace
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class CreateProjectGQL extends Apollo.Mutation<
  CreateProjectMutation,
  CreateProjectMutationVariables
> {
  document = CreateProjectDocument;
}
