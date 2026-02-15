import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any;
}
