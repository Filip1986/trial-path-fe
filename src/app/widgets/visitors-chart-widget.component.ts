import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

// Import ApexCharts
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

// Define chart options type
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
};

/**
 * Component for displaying a visitor distribution chart
 * Shows breakdown of visitors by device type using a doughnut chart
 */
@Component({
  selector: 'app-visitors-chart-widget',
  standalone: true,
  imports: [CommonModule, CardModule, NgApexchartsModule],
  templateUrl: './visitors-chart-widget.component.html',
  styleUrls: ['./visitors-chart-widget.component.scss'],
})
export class VisitorsChartWidgetComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  // Mock data for visitor distribution
  visitorData = {
    devices: [
      { name: 'Desktop', count: 45, color: '#4CAF50' },
      { name: 'Mobile', count: 32, color: '#2196F3' },
      { name: 'Tablet', count: 15, color: '#FFC107' },
      { name: 'Other', count: 8, color: '#9E9E9E' },
    ],
  };

  /**
   * Initializes the component and chart options
   */
  ngOnInit(): void {
    this.initChartOptions();
  }

  /**
   * Gets the total number of visitors
   * @returns Total visitor count
   */
  getTotalVisitors(): number {
    return this.visitorData.devices.reduce((sum, device) => sum + device.count, 0);
  }

  /**
   * Initialize chart options with mock data
   */
  private initChartOptions(): void {
    this.chartOptions = {
      series: this.visitorData.devices.map((device) => device.count),
      chart: {
        type: 'donut',
        height: 320,
        fontFamily: 'inherit',
        background: 'transparent',
      },
      labels: this.visitorData.devices.map((device) => device.name),
      colors: this.visitorData.devices.map((device) => device.color),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 260,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
              },
              value: {
                show: true,
                fontSize: '16px',
                formatter: function (val) {
                  return val + '%';
                },
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function () {
                  return '100%';
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          strokeWidth: 2,
          shape: 'circle',
        },
        itemMargin: {
          horizontal: 8,
          vertical: 8,
        },
      },
      stroke: {
        width: 0,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            return val + '%';
          },
        },
      },
    };
  }
}
