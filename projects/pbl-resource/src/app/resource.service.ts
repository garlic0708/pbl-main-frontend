import {Inject, Injectable} from '@angular/core';
import {GraphqlService, AuthConfig, AUTH_CONFIG, GQL_AUTH_TOKEN} from 'pbl-lib';
import {ListResourcesGQL, UploadFileGQL, UploadFileDocument} from '../generated/graphql';
import {NzTreeNodeOptions} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {map, pluck} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpLink} from 'apollo-angular-link-http';
import {Apollo} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';

interface Resource {
  fileName: string;
  url?: string;
}

export interface ResourceNode extends NzTreeNodeOptions {
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private graphql: GraphqlService,
              private listResourceGQL: ListResourcesGQL,
              private uploadFileGQL: UploadFileGQL,
              @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
              private httpClient: HttpClient,
              // todo temp approach
              private httpLink: HttpLink,
              @Inject(GQL_AUTH_TOKEN) private token: Observable<string>,
              private apollo: Apollo,
  ) {

    this.token.subscribe(theToken => {
      const http = httpLink.create({
        uri: `http://localhost:4004/graphql`,
        headers: new HttpHeaders({
          Authorization: `Bearer ${theToken}`,
        }),
      });

      apollo.create({
        link: http,
        cache: new InMemoryCache(),
      }, 'temp');
    });
  }

  private static transform(src: Resource[]): ResourceNode[] {
    const result = [];
    const cache = new Map<string, ResourceNode>();
    for (const resource of src) {
      const {fileName, url} = resource;
      let parent = '';
      let parentChildren = result;
      const parts = fileName.split('/');
      parts.forEach((part, i) => {
        if (part) {
          const key = parent ? `${parent}/${part}` : part;
          let item = cache.get(key);
          if (!item) {
            item = {
              title: part,
              key,
            };
            cache.set(key, item);
            parentChildren.push(item);
          }
          parent = key;
          if (i === parts.length - 1) {
            item.url = url;
            item.isLeaf = true;
          } else {
            if (!item.children) {
              item.children = [];
            }
            parentChildren = item.children;
          }
        }
      });
    }
    return result;
  }

  getResources(): Observable<ResourceNode[]> {
    return this.graphql.executeQuery(
      this.listResourceGQL.fetch({projectId: this.authConfig.projectId})
    ).pipe(
      map(({data}) => ResourceService.transform(data.listResources))
    );
  }

  upload(parent: ResourceNode, fileName: string, file: File): Observable<void> {
    console.log('uploading file', file);
    // todo temp approach
    return this.apollo
      .use('temp')
      .mutate({
        mutation: UploadFileDocument,
        variables: {
          projectId: this.authConfig.projectId,
          fileName: `${parent.key}/${fileName}`,
          content: file,
        },
        context: {
          useMultipart: true
        }
      }).pipe(
        pluck('data', 'uploadResource'),
        map(({fileName: newFileName, url}) => {
          parent.children.push({
            title: fileName,
            key: newFileName,
            url,
            isLeaf: true,
          });
          console.log('after adding', parent);
        })
      );
  }

  downloadFile(url: string, fileName: string) {
    this.httpClient
      .get(url, {
        responseType: 'blob',
      })
      .subscribe(res => {
        const newBlob = new Blob([res], {type: 'application/octet-stream'});

        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

        setTimeout(() => {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }
}
