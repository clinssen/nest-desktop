import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppLink } from '../../classes/appLink';

import { listAnimation } from '../../animations/list-animation';


@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class NetworkListComponent implements OnInit {
  @Input() data: Data;
  @Input() selective: boolean = true;
  @Input() paramSelective: boolean = true;
  @Input() columns: boolean = false;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit(): void {
    // console.log('Init network list')
  }

  nodeDisplay(node: AppNode): boolean {
    return this._networkService.isNodeSelected(node, this.data) || !this.selective;
  }

  linkDisplay(link: AppLink): boolean {
    return this._networkService.isLinkSelected(link, this.data) || !this.selective;
  }

}
