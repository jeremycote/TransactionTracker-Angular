import { Component } from '@angular/core';
import { Chart } from 'chart.js';

enum ChartType {
  CATEGORY,
  PIE_CHART,
}

@Component({
  selector: 'app-charts-page',
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss'],
})
export class ChartsPageComponent {
  chartTypes = [
    {
      type: ChartType.CATEGORY,
      text: 'Category',
    },
    {
      type: ChartType.PIE_CHART,
      text: 'Pie Chart',
    },
  ];
  chartType = ChartType.CATEGORY;
}
