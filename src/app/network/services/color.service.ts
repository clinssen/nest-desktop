import { Injectable } from '@angular/core';

import { NetworkConfigService } from '../network-config/network-config.service';
import { SimulationService } from '../../simulation/services/simulation.service';

import { AppNode } from '../../classes/appNode';
import { SimConnectome } from '../../classes/simConnectome';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public schemes: any;

  constructor(
    private _networkConfigService: NetworkConfigService,
    private _simulationService: SimulationService,
  ) {
    this.schemes = {
      "category10": ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
      "category20": ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
      "paired": ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
      "set1": ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
      "set2": ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
      "set3": ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
      "google 10c": ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395'],
      "google 20c": ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'],
    }
  }

  colors(): string[] {
    return Array.apply([], this._networkConfigService.config.color.cycle);
  }

  node(idx: number): string {
    let colors = this._networkConfigService.config.color.cycle;
    let node = this._simulationService.data.app.nodes[idx];
    if (node == undefined || node.color == undefined || node.color == idx) {
      return colors[idx % colors.length];
    } else if (typeof node.color == 'number') {
      return this.node(node.color);
    } else {
      return node.color;
    }
  }

  connectome(connectome: SimConnectome): string {
    return this.weight(connectome.syn_spec['weight'] || 1);
  }

  weight(value: number): string {
    return value < 0 ? '#b34846' : '#467ab3';
  }

  schemesKeys(): string[] {
    return Object.keys(this.schemes)
  }

}
