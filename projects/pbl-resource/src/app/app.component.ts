import {Component, OnInit} from '@angular/core';
import {ResourceNode, ResourceService} from './resource.service';
import {NzFormatEmitEvent, NzMessageService, NzTreeNode, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {Subject, Subscription} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pbl-resource';
  nodes: ResourceNode[];
  selectedNode: ResourceNode;

  handleUpload = (item: UploadXHRArgs): Subscription => {
    console.log('item is', item);
    return this.uploadFile(item.file);
  };

  constructor(private resourceService: ResourceService,
              private message: NzMessageService,) {
  }

  ngOnInit(): void {
    this.resourceService.getResources()
      .subscribe(resources => {
        console.log('fetched resources', resources);
        this.nodes = resources;
      });
  }

  // uploadInputChange(evt) {
  //   const { files, validity } = evt.target;
  //   if (validity.valid) {
  //     this.uploadFile(files);
  //   }
  // }

  uploadFile(file: UploadFile) {
    const uploading = this.message.loading('Uploading...', {nzDuration: 0}).messageId;
    return this.resourceService.upload(this.selectedNode, file.name, file as any)
      .subscribe(() => {
        this.message.remove(uploading);
        this.nodes = [...this.nodes];
      });
  }

  selectNode(e: NzFormatEmitEvent) {
    this.selectedNode = e.node.origin;
    console.log('selecting node', this.selectedNode);
  }

  get selectedType(): 'folder' | 'file' | null {
    if (!this.selectedNode) {
      return null;
    }
    return this.selectedNode.isLeaf ? 'file' : 'folder';
  }

  downloadFile(node: ResourceNode) {
    this.resourceService.downloadFile(node.url, node.title);
  }

}
