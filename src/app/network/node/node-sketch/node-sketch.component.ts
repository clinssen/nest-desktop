import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color.service';
import { NetworkService } from '../../services/network.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { AppLink } from '../../../classes/appLink';
import { SimCollection } from '../../../classes/simCollection';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'g[app-node-sketch]',
  templateUrl: 'node-sketch.component.html',
  styleUrls: ['./node-sketch.component.scss'],
})
export class NodeSketchComponent implements OnInit {
  @Input() data: Data;
  @Input() dragable: boolean;
  @Input() eventTrigger: boolean = true;
  @Input() height: number;
  @Input() node: AppNode;
  @Input() selected: AppNode;
  @Input() width: number;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  private selector: any;
  public collection: SimCollection;

  constructor(
    private _colorService: ColorService,
    private _networkService: NetworkService,
    private _networkConfigService: NetworkConfigService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit(): void {
    if (this.node == undefined) return
    var node = this.selector.selectAll("g.node").data([this.node]); // UPDATE
    if (this.dragable) {
      node.on('mousedown.drag', null);
      node.call(this.dragHandler());
    }
    this.collection = this.data.simulation.collections[this.node.idx];
  }

  label(): string {
    return this.collection.model.split('-')[1]
  }

  radius(): number {
    var radius = this._networkConfigService.config.sketch.node.radius.value;
    return this._networkSketchService.focused.node == this.node ? radius + 3 : radius;
  }

  strokeWidth(): number {
    return this._networkConfigService.config.sketch.node.strokeWidth.value;
  }

  strokeColor(): string {
    return this._colorService.node(this.node.idx);
  }

  fillColor(): string {
    // var color = this._colorService.node(this.node.idx);
    // return d3.color(color).brighter(1.2);
    return 'white';
  }

  connect(): void {
    this.data.createLink(this.selected, this.node);
    this.dataChange.emit(this.data);
  }

  onClick(event: MouseEvent): void {
    // console.log('Click node')
    if (this.eventTrigger && this.selected && this._networkSketchService.focused.node && this._networkSketchService.connect) {
      this.connect();
      if (this._networkSketchService.keyDown == '17') return
      this._networkService.resetSelection();
    } else {
      this._networkService.selectNode(this.node);
    }
    this._networkSketchService.connect = false;
  }

  dragHandler(): any {
    let r = this._networkConfigService.config.sketch.node.radius.value + 3;

    return d3.drag()
      .on('drag', node => {
        this._networkService.resetSelection();
        this._networkSketchService.reset();
        if (d3.event.x < r || d3.event.x > this.width - r - 1) return
        if (d3.event.y < r || d3.event.y > this.height - r - 1) return
        node['position'].x = d3.event.x;
        node['position'].y = d3.event.y;
      }
      )
  }

}
